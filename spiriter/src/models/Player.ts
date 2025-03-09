import mongoose, { Schema, model, models } from "mongoose";

const PlayerSchema = new Schema({}, { strict: false }); // Allow dynamic fields

// ------------------------
// Existing Virtual Fields
// ------------------------
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

// ------------------------
// New Virtual Fields
// ------------------------

// "playerPoints" => Maps from the "Points" field (or whatever your DB field name is)
PlayerSchema.virtual("playerPoints").get(function () {
  // If your DB field is "Points", map it here. If it's different, adjust accordingly.
  return (this as any)["Points"] || 0;
});

// "playerValue" => Maps from "Value" or "Price" field in DB (adjust if needed)
PlayerSchema.virtual("playerValue").get(function () {
  // If your DB field is "Value", map it here. E.g., "Price", "Player Value", etc.
  return (this as any)["Value"] || 0;
});

// Enable virtuals in JSON and Object responses
PlayerSchema.set("toJSON", { virtuals: true });
PlayerSchema.set("toObject", { virtuals: true });

export default models.Player || model("Player", PlayerSchema, "Players");
