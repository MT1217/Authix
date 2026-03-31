import mongoose from 'mongoose';

/**
 * Mentor-owned learning asset; belongs to one tenant only.
 * mentorId must reference a user in the same tenantId — enforce in controllers.
 */
const versionEntrySchema = new mongoose.Schema(
  {
    version: { type: Number, required: true },
    url: { type: String, required: true },
    label: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const contentSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true },
    /** Current canonical file/source URL */
    url: { type: String, required: true },
    priceCents: { type: Number, default: 0 },
    versionHistory: [versionEntrySchema],
  },
  { timestamps: true }
);

contentSchema.index({ tenantId: 1, title: 1 });

export const Content = mongoose.model('Content', contentSchema);
