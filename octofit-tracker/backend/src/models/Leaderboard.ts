import mongoose, { Schema, Document } from 'mongoose';

interface ILeaderboardEntry extends Document {
  userId: mongoose.Types.ObjectId;
  username: string;
  points: number;
  rank: number;
  teamId?: mongoose.Types.ObjectId;
  period: 'daily' | 'weekly' | 'monthly' | 'allTime';
  updatedAt: Date;
}

const leaderboardSchema = new Schema<ILeaderboardEntry>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    username: { type: String, required: true },
    points: { type: Number, required: true },
    rank: { type: Number, required: true },
    teamId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    period: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'allTime'],
      required: true,
    },
  },
  { timestamps: true }
);

const Leaderboard = mongoose.model<ILeaderboardEntry>(
  'Leaderboard',
  leaderboardSchema
);

export default Leaderboard;
export type { ILeaderboardEntry };
