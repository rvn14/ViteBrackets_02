import mongoose, { Schema, model, models } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isAdmin: { type: Boolean, default: false }, // Add isAdmin field
  budget: { type: Number, default: 9000000 },
  team: { type: Schema.Types.ObjectId, ref: 'Team' },
  totalPoints: { type: Number, default: 0 }
});

// Pre-save hook to hash password if modified
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export default models.User || model('User', UserSchema);
