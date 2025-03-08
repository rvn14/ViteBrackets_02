// import mongoose from "mongoose";

// const PlayerSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   university: { type: String, required: true },
//   runs: { type: Number, default: 0 },
//   balls_faced: { type: Number, default: 0 },
//   innings_played: { type: Number, default: 0 },
//   wickets: { type: Number, default: 0 },
//   overs_bowled: { type: Number, default: 0 },
//   runs_conceded: { type: Number, default: 0 },
//   category: { type: String, enum: ["Batsman", "Bowler", "All-rounder"], required: true },
// });

// export default mongoose.models.Player || mongoose.model("Player", PlayerSchema, "Players");


import mongoose, { Schema, model, models } from "mongoose";

const PlayerSchema = new Schema({}, { strict: false }); // Allow dynamic fields

// **Virtual Fields to Map MongoDB Fields to Schema-Friendly Names**
PlayerSchema.virtual("name").get(function () {
  return (this as any)["Name"]; // Map "Name" to "name"
});
PlayerSchema.virtual("university").get(function () {
  return (this as any)["University"]; // Map "University" to "university"
});
PlayerSchema.virtual("runs").get(function () {
  return (this as any)["Total Runs"] || 0; // Map "Total Runs" to "runs"
});
PlayerSchema.virtual("balls_faced").get(function () {
  return (this as any)["Balls Faced"] || 0; // Map "Balls Faced" to "balls_faced"
});
PlayerSchema.virtual("innings_played").get(function () {
  return (this as any)["Innings Played"] || 0; // Map "Innings Played" to "innings_played"
});
PlayerSchema.virtual("wickets").get(function () {
  return (this as any)["Wickets"] || 0; // Map "Wickets" to "wickets"
});
PlayerSchema.virtual("overs_bowled").get(function () {
  return (this as any)["Overs Bowled"] || 0; // Map "Overs Bowled" to "overs_bowled"
});
PlayerSchema.virtual("runs_conceded").get(function () {
  return (this as any)["Runs Conceded"] || 0; // Map "Runs Conceded" to "runs_conceded"
});
PlayerSchema.virtual("category").get(function () {
  return (this as any)["Category"] || "Unknown"; // Map "Category" to "category"
});

// Enable virtuals in JSON and Object responses
PlayerSchema.set("toJSON", { virtuals: true });
PlayerSchema.set("toObject", { virtuals: true });

export default models.Player || model("Player", PlayerSchema, "Players");
