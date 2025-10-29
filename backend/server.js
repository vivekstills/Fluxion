import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { simulateBattle } from "./services/aiEngine.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("✅ Fluxion Backend Running"));

app.post("/simulate", async (req, res) => {
  try {
    const { traderA, traderB } = req.body;
    const result = await simulateBattle(traderA, traderB);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.toString() });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Backend running on port ${PORT}`));
