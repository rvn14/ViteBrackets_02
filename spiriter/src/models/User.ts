import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  budget: { type: Number, default: 9000000 },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
