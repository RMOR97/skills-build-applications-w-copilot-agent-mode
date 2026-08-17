import mongoose, { Schema, Document } from 'mongoose';

interface IActivity extends Document {
  userId: mongoose.Types.ObjectId;
  type: string;
  duration: number;
  distance?: number;
  calories?: number;
  points: number;
  description?: string;
  date: Date;
  createdAt: Date;
}

const activitySchema = new Schema<IActivity>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    type: { type: String, required: true }, // e.g., 'running', 'cycling', 'swimming'
    duration: { type: Number, required: true }, // in minutes
    distance: Number, // in kilometers
    calories: Number,
    points: { type: Number, required: true },
    description: String,
    date: { type: Date, required: true },
  },
  { timestamps: true }
);

const Activity = mongoose.model<IActivity>('Activity', activitySchema);

export default Activity;
export type { IActivity };
