import mongoose, { Schema, Document } from 'mongoose';
import { IScreeningResult } from './ScreeningResult';

export interface IShortlist extends Document {
  jobId: mongoose.Types.ObjectId;
  title: string;
  candidates: IScreeningResult['_id'][];
  totalApplicants: number;
  createdAt: Date;
  updatedAt: Date;
}

const ShortlistSchema: Schema = new Schema({
  jobId: {
    type: Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  candidates: [{
    type: Schema.Types.ObjectId,
    ref: 'ScreeningResult',
    required: true,
  }],
  totalApplicants: {
    type: Number,
    required: true,
    min: 0,
  },
}, {
  timestamps: true,
});

ShortlistSchema.index({ jobId: 1 });
ShortlistSchema.index({ createdAt: -1 });

export const Shortlist = mongoose.model<IShortlist>('Shortlist', ShortlistSchema);
