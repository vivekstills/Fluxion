import * as admin from 'firebase-admin';

// IMPORTANT: Path to your service account key
// Download from Firebase Console > Project Settings > Service accounts
const serviceAccount = require('../../../studio-1458848467-21ace-firebase-adminsdk-15z2h-b43a60a7e0.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

async function seedData() {
  const pastDataRef = db.collection('pastData').doc('BTCUSD');

  // Generate some plausible historical data for BTC
  const closePrices = [];
  let price = 60000;
  for (let i = 0; i < 30 * 24 * 60; i++) { // 30 days of minute data
      price += (Math.random() - 0.5) * 5;
      closePrices.push(price);
  }

  await pastDataRef.set({
    close: closePrices
  });

  console.log('Seeding complete for pastData/BTCUSD');
}

seedData().then(() => {
    console.log('Database seeded successfully.');
    process.exit(0);
}).catch((error) => {
    console.error('Error seeding database:', error);
    process.exit(1);
});
