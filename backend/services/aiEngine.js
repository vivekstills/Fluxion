import { spawn } from "child_process";
import path from "path";

export const simulateBattle = (traderA, traderB) => {
  return new Promise((resolve, reject) => {
    const scriptPath = path.resolve(process.cwd(), "../ai_engine/simulate.py");
    const proc = spawn("python3", [scriptPath, traderA, traderB]);

    let output = "";
    proc.stdout.on("data", (data) => (output += data.toString()));
    proc.stderr.on("data", (err) => console.error("AI STDERR:", err.toString()));
    proc.on("close", (code) => {
      try {
        const result = JSON.parse(output);
        resolve(result);
      } catch (err) {
        reject(err);
      }
    });
  });
};
