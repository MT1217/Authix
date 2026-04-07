import mongoose from 'mongoose';

/**
 * A student's submission in response to a Mentor's Content assignment.
 * Logical isolation: must always query using tenantId.
 */
const submissionSchema = new mongoose.Schema(
  {
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true, index: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    mentorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    contentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Content', required: true, index: true },
    answers: { type: String, required: true },
    status: { type: String, enum: ['pending', 'evaluated'], default: 'pending' },
    evaluation: {
      score: { type: Number, default: null },
      feedback: { type: String, default: '' },
      evaluatedAt: { type: Date, default: null }
    }
  },
  { timestamps: true }
);

submissionSchema.index({ tenantId: 1, studentId: 1, contentId: 1 }, { unique: true });

export const Submission = mongoose.model('Submission', submissionSchema);
