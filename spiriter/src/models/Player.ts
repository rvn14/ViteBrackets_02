import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  university: { type: String, required: true },
  runs: { type: Number, default: 0 },
  balls_faced: { type: Number, default: 0 },
  innings_played: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  overs_bowled: { type: Number, default: 0 },
  runs_conceded: { type: Number, default: 0 },
  category: { type: String, enum: ["Batsman", "Bowler", "All-rounder"], required: true },
  value: { type: Number, required: true },
  points: { type: Number, default: 0 },
});

export default mongoose.models.Player || mongoose.model("Player", PlayerSchema);
