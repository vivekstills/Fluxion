import * as admin from 'firebase-admin';
import { https, HttpsError, onCall } from 'firebase-functions/v2/https';
import { z } from 'zod';
import { simulateGBM } from './lib/simulatePath';
import { encodeFloat32Array, sha256Base64 } from './lib/encoding';
import { computeServerTickIndex } from './lib/ticks';
import * as crypto from 'crypto';

admin.initializeApp();

const db = admin.firestore();

// Define a placeholder for the shared Trader type
// TODO: Replace with import from shared monorepo path: `import type { Trader } from '../../src/types/trader';`
const TraderSchema = z.object({
  traderId: z.string(),
  name: z.string(),
  elo: z.number(),
  // Add other fields as necessary from the shared type
});
type Trader = z.infer<typeof TraderSchema>;


// --- Callable Functions ---

export const createDuel = onCall(async (request) => {
    const CreateDuelInput = z.object({
      symbol: z.string(),
      simDays: z.union([z.literal(1), z.literal(2)]),
      durationSec: z.number().optional().default(60),
      traderA: TraderSchema,
      traderB: TraderSchema,
    });

    const data = CreateDuelInput.parse(request.data);

    const duelRef = db.collection('duels').doc();
    await duelRef.set({
      duelId: duelRef.id,
      symbol: data.symbol,
      simDays: data.simDays,
      durationSec: data.durationSec,
      traderAId: data.traderA.traderId,
      traderBId: data.traderB.traderId,
      status: 'CREATED',
      pnl: {
        [data.traderA.traderId]: 0,
        [data.traderB.traderId]: 0,
      }
    });

    return { duelId: duelRef.id };
});

export const joinAndLockDuel = onCall(async (request) => {
    const JoinDuelInput = z.object({
        duelId: z.string(),
    });
    const { duelId } = JoinDuelInput.parse(request.data);

    const duelRef = db.collection('duels').doc(duelId);
    const duelDoc = await duelRef.get();

    if (!duelDoc.exists) {
        throw new HttpsError('not-found', 'Duel not found.');
    }
    const duelData = duelDoc.data()!;

    // For now, we assume 2 players are implicitly joined.
    // In a real scenario, you'd have a join mechanism.

    const seed = crypto.randomBytes(16).toString('hex');
    
    // Stub for getPastOHLCV
    const pastDataRef = db.collection('pastData').doc(duelData.symbol);
    const pastDataDoc = await pastDataRef.get();
    if (!pastDataDoc.exists) {
        throw new HttpsError('failed-precondition', `No past data for symbol ${duelData.symbol}`);
    }
    const closePrices = pastDataDoc.data()!.close as number[];

    // Compute mu and sigma from log returns
    const logReturns = [];
    for (let i = 1; i < closePrices.length; i++) {
        logReturns.push(Math.log(closePrices[i] / closePrices[i-1]));
    }
    const meanReturn = logReturns.reduce((a, b) => a + b, 0) / logReturns.length;
    const mu = meanReturn * 252 * 24 * 60; // Annualized
    const variance = logReturns.reduce((sq, v) => sq + Math.pow(v - meanReturn, 2), 0) / (logReturns.length -1);
    const sigma = Math.sqrt(variance) * Math.sqrt(252 * 24 * 60); // Annualized

    const minutes = duelData.simDays * 1440;
    const path = simulateGBM({ S0: closePrices[closePrices.length-1], mu, sigma, minutes, seed });
    
    const encodedPath = encodeFloat32Array(path);
    const pathHash = await sha256Base64(encodedPath);

    const duelPathRef = db.collection('duelPaths').doc(duelId);
    await duelPathRef.set({
        duelId: duelId,
        path: encodedPath,
    });
    
    await duelRef.update({
        seed,
        mu,
        sigma,
        pathHash,
        status: 'LOCKED',
    });

    return { ok: true };
});

export const startDuel = onCall(async (request) => {
    const StartDuelInput = z.object({
        duelId: z.string(),
    });
    const { duelId } = StartDuelInput.parse(request.data);

    const duelRef = db.collection('duels').doc(duelId);
    await duelRef.update({
        startTime: admin.firestore.FieldValue.serverTimestamp(),
        status: 'RUNNING',
    });
    
    // Fetch start time to return
    const duelDoc = await duelRef.get();
    const startTime = duelDoc.data()!.startTime.toDate().toISOString();
    
    return { startTime };
});

export const placeOrder = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'You must be logged in to place an order.');
  }
  
  const PlaceOrderInput = z.object({
    duelId: z.string(),
    side: z.union([z.literal('BUY'), z.literal('SELL')]),
    type: z.union([z.literal('MARKET'), z.literal('LIMIT')]),
    qty: z.number().gt(0).lte(1000),
    limitPrice: z.number().optional(),
    clientTickIndex: z.number(),
  });

  const data = PlaceOrderInput.parse(request.data);
  const traderId = request.auth.uid;

  const duelRef = db.collection('duels').doc(data.duelId);
  const duelDoc = await duelRef.get();

  if (!duelDoc.exists || duelDoc.data()!.status !== 'RUNNING') {
    throw new HttpsError('failed-precondition', 'Duel is not active.');
  }

  const duelData = duelDoc.data()!;
  
  const serverTickIndex = computeServerTickIndex({
      startTime: duelData.startTime.toDate(), 
      now: new Date(),
      simDays: duelData.simDays,
      durationSec: duelData.durationSec,
  });

  if (Math.abs(data.clientTickIndex - serverTickIndex) > 1) {
    throw new HttpsError('failed-precondition', 'Client tick index is out of sync with server.');
  }

  const duelPathDoc = await db.collection('duelPaths').doc(data.duelId).get();
  if (!duelPathDoc.exists) {
      throw new HttpsError('internal', 'Duel path not found.');
  }
  const pathBase64 = duelPathDoc.data()!.path;
  const pathBuffer = Buffer.from(pathBase64, 'base64');
  const path = new Float32Array(pathBuffer.buffer, pathBuffer.byteOffset, pathBuffer.byteLength / Float32Array.BYTES_PER_ELEMENT);

  let fillPrice: number | undefined;
  let status: 'FILLED' | 'OPEN' = 'OPEN';
  
  const currentPrice = path[serverTickIndex];

  if (data.type === 'MARKET') {
    fillPrice = currentPrice;
    status = 'FILLED';
  } else if (data.type === 'LIMIT' && data.limitPrice) {
    if ((data.side === 'BUY' && currentPrice <= data.limitPrice) || (data.side === 'SELL' && currentPrice >= data.limitPrice)) {
      fillPrice = data.limitPrice; // Fill at limit price
      status = 'FILLED';
    }
  } else {
    throw new HttpsError('invalid-argument', 'Invalid order type or missing limit price.');
  }

  const orderRef = duelRef.collection('orders').doc();
  const orderData = {
      orderId: orderRef.id,
      duelId: data.duelId,
      traderId,
      side: data.side,
      type: data.type,
      qty: data.qty,
      limitPrice: data.limitPrice,
      clientTickIndex: data.clientTickIndex,
      status,
      fillPrice,
      filledAtTick: status === 'FILLED' ? serverTickIndex : undefined,
      pnl: 0, // PNL calculation will be more complex, placeholder
  };
  await orderRef.set(orderData);

  // TODO: Update positions and PnL in a transaction
  
  return { status, fillPrice, filledAtTick: orderData.filledAtTick, pnl: orderData.pnl };
});


export const endAndSettle = onCall(async (request) => {
    const EndDuelInput = z.object({
        duelId: z.string(),
    });
    const { duelId } = EndDuelInput.parse(request.data);
    
    const duelRef = db.collection('duels').doc(duelId);
    const duelDoc = await duelRef.get();
    if (!duelDoc.exists) {
      throw new HttpsError('not-found', 'Duel not found.');
    }
    const duelData = duelDoc.data()!;

    if (new Date() < duelData.startTime.toDate().getTime() + duelData.durationSec * 1000) {
      throw new HttpsError('failed-precondition', 'Duel has not ended yet.');
    }

    // TODO: Close open positions at the last price from the path

    // For now, placeholder winner and PNL
    const winnerUid = duelData.traderAId;
    const pnl = { [duelData.traderAId]: 100, [duelData.traderBId]: -100 };

    const serverSecret = process.env.SERVER_SECRET || "default_secret";
    const signaturePayload = JSON.stringify({ duelId, winnerUid, pnl });
    const signature = crypto.createHmac('sha256', serverSecret).update(signaturePayload).digest('hex');

    await duelRef.update({
        status: 'COMPLETE',
        winnerUid,
        pnl,
        signature
    });

    return { winnerUid, pnl, signature };
});

export const verifyResult = onCall(async (request) => {
    const VerifyResultInput = z.object({
        duelId: z.string(),
    });
    const { duelId } = VerifyResultInput.parse(request.data);

    const duelDoc = await db.collection('duels').doc(duelId).get();
    if (!duelDoc.exists) {
        throw new HttpsError('not-found', 'Duel not found.');
    }
    const duelData = duelDoc.data()!;

    // TODO: Re-calculate PNL deterministically from all orders and path
    const recomputedPnl = { [duelData.traderAId]: 100, [duelData.traderBId]: -100 };

    const serverSecret = process.env.SERVER_SECRET || "default_secret";
    const signaturePayload = JSON.stringify({ duelId, winnerUid: duelData.winnerUid, pnl: recomputedPnl });
    const recomputedSignature = crypto.createHmac('sha256', serverSecret).update(signaturePayload).digest('hex');

    const isPnlOk = JSON.stringify(recomputedPnl) === JSON.stringify(duelData.pnl);
    const isSignatureOk = recomputedSignature === duelData.signature;

    return { ok: isPnlOk && isSignatureOk };
});
