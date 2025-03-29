import { Schema, model, models } from "mongoose";

const TeamSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, default: "My Team" },
  players: [{ type: Schema.Types.ObjectId, ref: "Player" }],
  createdAt: { type: Date, default: Date.now },
});

export default models.Team || model("Team", TeamSchema);
