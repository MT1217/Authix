import mongoose from 'mongoose';

/**
 * ChatThread is the unique conversation between:
 * - one Assignment (we use Content._id as assignment_id)
 * - one Student
 * - one Mentor
 *
 * Logical isolation:
 * - tenantId is mandatory on every chat thread so data never crosses organizations.
 * - All routes MUST filter by { tenantId: req.tenantId }.
 */
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    messageText: { type: String, required: true, trim: true },
    timestamp: { type: Date, default: Date.now, index: true },
    /**
     * Future-proofing: allow file attachments in chats later.
     * Keeping it optional now so current UI stays simple.
     */
    attachments: [
      {
        type: { type: String, default: 'link' },
        url: { type: String, default: '' },
      },
    ],
  },
  { _id: false }
);

const chatThreadSchema = new mongoose.Schema(
  {
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Tenant',
      required: true,
      index: true,
    },
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Content',
      required: true,
      index: true,
    },
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    mentorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    messages: { type: [messageSchema], default: [] },
  },
  { timestamps: true }
);

// One assignment has one unique thread per student+mentor.
chatThreadSchema.index(
  { tenantId: 1, assignmentId: 1, studentId: 1, mentorId: 1 },
  { unique: true }
);

export const ChatThread = mongoose.model('ChatThread', chatThreadSchema);

