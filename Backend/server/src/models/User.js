import mongoose from 'mongoose';

/**
 * User document — always scoped to exactly one tenant via tenantId.
 * Multi-tenant isolation: queries MUST include { tenantId: req.tenantId } (or req.user.tenantId)
 * so a JWT from tenant A cannot access users from tenant B even if IDs are guessed.
 */
const userSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ['admin', 'mentor', 'student'],
      required: true,
    },
    /** Mentor Profile Information (Ignored for Students) */
    profile: {
      name: { type: String, default: '' },
      expertise: { type: String, default: '' },
      bio: { type: String, default: '' }
    },
    /** For Students: Mentors they have subscribed to */
    subscribedMentorIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    /** Content IDs explicitly unlocked (legacy/direct access) */
    unlockedContentIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Content' }],
  },
  { timestamps: true }
);

userSchema.index({ tenantId: 1, email: 1 }, { unique: true });

export const User = mongoose.model('User', userSchema);
