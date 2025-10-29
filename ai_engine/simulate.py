#!/usr/bin/env python3
import random, json, hashlib, sys, time

def simulate(traderA, traderB):
    seed_source = f"{traderA}|{traderB}|{int(time.time()/10)}"
    seed = int(hashlib.sha256(seed_source.encode()).hexdigest()[:8], 16)
    random.seed(seed)
    turns = []
    scoreA = scoreB = 1000
    for i in range(5):
        move = random.uniform(-5, 5)
        actA = random.choice(["buy", "sell", "hold"])
        actB = random.choice(["buy", "sell", "hold"])
        scoreA += move if actA == "buy" else -move if actA == "sell" else 0
        scoreB += -move if actB == "buy" else move if actB == "sell" else 0
        turns.append({
            "turn": i+1,
            "move": round(move, 2),
            "A_action": actA,
            "B_action": actB,
            "A_score": round(scoreA, 2),
            "B_score": round(scoreB, 2)
        })
    winner = traderA if scoreA > scoreB else traderB
    result = {"seed": seed, "turns": turns, "winner": winner}
    result["battle_hash"] = hashlib.sha256(json.dumps(result, sort_keys=True).encode()).hexdigest()
    print(json.dumps(result))

if __name__ == "__main__":
    simulate(sys.argv[1], sys.argv[2])
