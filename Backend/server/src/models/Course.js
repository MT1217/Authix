import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema(
  {
    tenantId: { type: String, required: true, index: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    description: { type: String, default: '' },
    priceInCents: { type: Number, required: true },
  },
  { timestamps: true }
);

export const Course = mongoose.model('Course', courseSchema);
