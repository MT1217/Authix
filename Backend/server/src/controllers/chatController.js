import mongoose from 'mongoose';
import { ChatThread } from '../models/ChatThread.js';
import { Content } from '../models/Content.js';
import { User } from '../models/User.js';

function requireObjectId(value) {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    throw new Error('Invalid ObjectId');
  }
  return new mongoose.Types.ObjectId(value);
}

function mapMessages(messages) {
  // Ensure a stable sort order for UI rendering.
  return (messages || []).slice().sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
}

/**
 * Students:
 * GET /api/student/chats/threads/:assignmentId/:mentorId
 * - Validates assignment belongs to mentor within this tenant.
 * - Validates student is subscribed to that mentor.
 * - Returns chat thread messages (creates an empty thread on first request).
 */
export async function getStudentThread(req, res) {
  try {
    const assignmentId = requireObjectId(req.params.assignmentId);
    const mentorId = requireObjectId(req.params.mentorId);

    // Ensure assignment belongs to this mentor.
    const content = await Content.findOne({
      _id: assignmentId,
      mentorId,
    });

    if (!content) return res.status(404).json({ message: 'Assignment not found for this mentor' });

    // Ensure student subscription to that mentor.
    const student = await User.findOne({
      _id: req.user.userId,
      role: 'student',
      subscribedMentorIds: mentorId,
    });

    if (!student) return res.status(403).json({ message: 'Not subscribed to this mentor' });

    const thread = await ChatThread.findOne({
      tenantId: content.tenantId,
      assignmentId,
      studentId: req.user.userId,
      mentorId,
    });

    if (!thread) {
      // Create empty thread so subsequent UI refreshes are consistent.
      const created = await ChatThread.create({
        tenantId: content.tenantId,
        assignmentId,
        studentId: req.user.userId,
        mentorId,
        messages: [],
      });
      return res.json({ threadId: created._id, messages: [] });
    }

    return res.json({ threadId: thread._id, messages: mapMessages(thread.messages) });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to load chat thread' });
  }
}

/**
 * Students:
 * POST /api/student/chats/threads/:assignmentId/:mentorId/messages
 * Body: { messageText }
 */
export async function postStudentMessage(req, res) {
  try {
    const assignmentId = requireObjectId(req.params.assignmentId);
    const mentorId = requireObjectId(req.params.mentorId);
    const { messageText } = req.body;

    if (!messageText || !String(messageText).trim()) {
      return res.status(400).json({ message: 'messageText is required' });
    }

    // Validate assignment + subscription (same logic as GET).
    const content = await Content.findOne({
      _id: assignmentId,
      mentorId,
    });
    if (!content) return res.status(404).json({ message: 'Assignment not found for this mentor' });

    const student = await User.findOne({
      _id: req.user.userId,
      role: 'student',
      subscribedMentorIds: mentorId,
    });
    if (!student) return res.status(403).json({ message: 'Not subscribed to this mentor' });

    const thread = await ChatThread.findOneAndUpdate(
      {
        tenantId: content.tenantId,
        assignmentId,
        studentId: req.user.userId,
        mentorId,
      },
      {
        $push: {
          messages: {
            senderId: req.user.userId,
            messageText: String(messageText).trim(),
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!thread) {
      // If thread didn't exist, create then push.
      const created = await ChatThread.create({
        tenantId: content.tenantId,
        assignmentId,
        studentId: req.user.userId,
        mentorId,
        messages: [
          {
            senderId: req.user.userId,
            messageText: String(messageText).trim(),
            timestamp: new Date(),
          },
        ],
      });
      return res.json({ threadId: created._id, messages: mapMessages(created.messages) });
    }

    return res.json({ threadId: thread._id, messages: mapMessages(thread.messages) });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to send chat message' });
  }
}

/**
 * Mentors:
 * GET /api/mentor/chats/threads?assignmentId=...
 * Returns list of threads for this mentor (and optional assignment filter),
 * enriched with student identity and last message time.
 */
export async function listMentorThreads(req, res) {
  try {
    const assignmentId = req.query.assignmentId ? requireObjectId(req.query.assignmentId) : null;

    // If assignment is provided, return ALL subscribed students for this mentor
    // so the UI can open a conversation even before any message exists.
    if (assignmentId) {
      const students = await User.find({
        role: 'student',
        subscribedMentorIds: req.user.userId,
      }).select('email profile.name');

      const studentIds = students.map((s) => s._id);

      const existingThreads = await ChatThread.find({
        tenantId: req.tenantId,
        assignmentId,
        mentorId: req.user.userId,
        studentId: { $in: studentIds },
      })
        .select('studentId messages')
        .lean();

      const threadByStudentId = new Map(
        existingThreads.map((t) => [
          String(t.studentId),
          {
            threadId: t._id,
            messages: t.messages || [],
          },
        ])
      );

      const enriched = students.map((s) => {
        const found = threadByStudentId.get(String(s._id));
        const messages = found?.messages || [];
        const last = (messages || [])[messages.length - 1];
        return {
          threadId: found?.threadId || null,
          assignmentId,
          studentId: s._id,
          studentName: s.profile?.name || s.email || 'Student',
          studentEmail: s.email,
          lastMessageText: last?.messageText || '',
          lastMessageAt: last?.timestamp || null,
        };
      });

      // Sort newest first by lastMessageAt
      enriched.sort(
        (a, b) => (a.lastMessageAt ? new Date(a.lastMessageAt) : 0) - (b.lastMessageAt ? new Date(b.lastMessageAt) : 0)
      );
      enriched.reverse();

      return res.json(enriched);
    }

    // Fallback: no assignment filter — return only existing threads.
    const threads = await ChatThread.find({
      tenantId: req.tenantId,
      mentorId: req.user.userId,
    })
      .populate('studentId', 'email profile.name profile.expertise')
      .populate('assignmentId', 'title assignment.description totalScore url')
      .lean();

    return res.json(
      threads.map((t) => {
        const last = (t.messages || [])[t.messages.length - 1];
        return {
          threadId: t._id,
          assignmentId: t.assignmentId?._id || t.assignmentId,
          studentId: t.studentId?._id || t.studentId,
          studentName: t.studentId?.profile?.name || t.studentId?.email || 'Student',
          studentEmail: t.studentId?.email || '',
          lastMessageText: last?.messageText || '',
          lastMessageAt: last?.timestamp || null,
        };
      })
    );
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to load mentor chat threads' });
  }
}

/**
 * Mentors:
 * GET /api/mentor/chats/threads/:assignmentId/:studentId/messages
 */
export async function getMentorThreadMessages(req, res) {
  try {
    const assignmentId = requireObjectId(req.params.assignmentId);
    const studentId = requireObjectId(req.params.studentId);

    const content = await Content.findOne({
      _id: assignmentId,
      mentorId: req.user.userId,
    });
    if (!content) return res.status(404).json({ message: 'Assignment not found' });

    // Validate that student is actually subscribed to this mentor.
    const student = await User.findOne({
      _id: studentId,
      role: 'student',
      subscribedMentorIds: req.user.userId,
    });
    if (!student) return res.status(403).json({ message: 'Student not subscribed to this mentor' });

    const thread = await ChatThread.findOne({
      tenantId: content.tenantId,
      assignmentId,
      studentId,
      mentorId: req.user.userId,
    });

    if (!thread) {
      // Create an empty thread on first open so the mentor UI can show a consistent chat.
      const created = await ChatThread.create({
        tenantId: content.tenantId,
        assignmentId,
        studentId,
        mentorId: req.user.userId,
        messages: [],
      });
      return res.json({ threadId: created._id, messages: [] });
    }

    return res.json({ threadId: thread._id, messages: mapMessages(thread.messages) });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to load messages' });
  }
}

/**
 * Mentors:
 * POST /api/mentor/chats/threads/:assignmentId/:studentId/messages
 * Body: { messageText }
 */
export async function postMentorMessage(req, res) {
  try {
    const assignmentId = requireObjectId(req.params.assignmentId);
    const studentId = requireObjectId(req.params.studentId);
    const { messageText } = req.body;

    if (!messageText || !String(messageText).trim()) {
      return res.status(400).json({ message: 'messageText is required' });
    }

    const content = await Content.findOne({
      _id: assignmentId,
      mentorId: req.user.userId,
    });
    if (!content) return res.status(404).json({ message: 'Assignment not found' });

    const student = await User.findOne({
      _id: studentId,
      role: 'student',
      subscribedMentorIds: req.user.userId,
    });
    if (!student) return res.status(403).json({ message: 'Student not subscribed to this mentor' });

    const thread = await ChatThread.findOneAndUpdate(
      {
        tenantId: content.tenantId,
        assignmentId,
        studentId,
        mentorId: req.user.userId,
      },
      {
        $push: {
          messages: {
            senderId: req.user.userId,
            messageText: String(messageText).trim(),
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!thread) {
      const created = await ChatThread.create({
        tenantId: content.tenantId,
        assignmentId,
        studentId,
        mentorId: req.user.userId,
        messages: [
          {
            senderId: req.user.userId,
            messageText: String(messageText).trim(),
            timestamp: new Date(),
          },
        ],
      });
      return res.json({ threadId: created._id, messages: mapMessages(created.messages) });
    }

    return res.json({ threadId: thread._id, messages: mapMessages(thread.messages) });
  } catch (error) {
    return res.status(400).json({ message: error.message || 'Failed to send mentor message' });
  }
}

