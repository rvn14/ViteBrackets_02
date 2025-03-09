import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    budget: { type: Number, default: 9000000 },
    totalPoints: { type: Number, default: 0 },

    // ✅ "team" is an array of Player ObjectIds
    team: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
      default: null, // or default: [] if you want an empty array by default
    },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema, "Users");
