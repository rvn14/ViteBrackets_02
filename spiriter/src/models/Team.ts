import mongoose, { Schema, model, models } from 'mongoose';

/**
 * Updated Team schema:
 * - Removed 'user' field (since user now stores 'team')
 * - 'players' remains an array of player IDs
 */
const TeamSchema = new Schema({
  name: { type: String, default: 'My Team' },
  players: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
  createdAt: { type: Date, default: Date.now }
});

export default models.Team || model('Team', TeamSchema);
