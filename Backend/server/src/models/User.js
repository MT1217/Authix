import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'mentor', 'student'], required: true },
    isApprovedMentor: { type: Boolean, default: false },
    mfaEnabled: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', userSchema);
