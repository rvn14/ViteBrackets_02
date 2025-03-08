import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
    budget: { type: Number, default: 9000000 },
    team: { type: Schema.Types.ObjectId, ref: "Team", default: null },
    totalPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// ✅ Pre-save Hook: Hash Password Only When Modified
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ Store Users in the "Users" Collection inside "Spirit11" Database
export default models.User || model("User", UserSchema, "Users");
