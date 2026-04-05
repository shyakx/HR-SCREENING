import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  role: 'recruiter' | 'admin';
  company?: string;
  createdAt: Date;
  lastLogin: Date;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  role: {
    type: String,
    enum: ['recruiter', 'admin'],
    default: 'recruiter',
  },
  company: {
    type: String,
    trim: true,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

UserSchema.index({ email: 1 });

export const User = mongoose.model<IUser>('User', UserSchema);
