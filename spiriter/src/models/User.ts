import mongoose, { Schema, model, models } from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false }, // Admin flag
    budget: { type: Number, default: 9000000 }, // Default user budget
    team: { type: Schema.Types.ObjectId, ref: "Team", default: null }, // Reference to the Team model
    totalPoints: { type: Number, default: 0 }, // Total points in fantasy league
  },
  { timestamps: true }
);

// ✅ **Pre-save hook to hash password only if modified**
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // Avoid rehashing if password is unchanged
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// ✅ **Explicitly set the collection name to "Users"**
export default models.User || model("User", UserSchema, "Users");
