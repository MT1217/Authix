import { Content } from '../models/Content.js';
import { User } from '../models/User.js';
import { Submission } from '../models/Submission.js';
import mongoose from 'mongoose';

/**
 * Mentor-only: create content with optional assignment.
 */
export async function createContent(req, res) {
  try {
    const { title, url, assignmentDescription, totalScore } = req.body;

    if (!title || !url) {
      return res.status(400).json({ message: 'title and url are required' });
    }

    const mentorId = new mongoose.Types.ObjectId(req.user.userId);

    const content = await Content.create({
      tenantId: req.tenantId,
      mentorId,
      title,
      url,
      assignment: {
        description: assignmentDescription || '',
        totalScore: Number(totalScore) || 100
      },
      versionHistory: [{ version: 1, url, label: 'Initial' }],
    });

    return res.status(201).json(content);
  } catch (error) {
    return res.status(500).json({ message: 'Content creation failed', error: error.message });
  }
}

/**
 * Append a new version
 */
export async function addContentVersion(req, res) {
  try {
    const { contentId } = req.params;
    const { url, label } = req.body;

    if (!url) {
      return res.status(400).json({ message: 'url is required' });
    }

    const content = await Content.findOne({
      _id: contentId,
      tenantId: req.tenantId,
      mentorId: new mongoose.Types.ObjectId(req.user.userId),
    });

    if (!content) {
      return res.status(404).json({ message: 'Content not found' });
    }

    const nextVersion = (content.versionHistory?.length || 0) + 1;
    content.versionHistory.push({ version: nextVersion, url, label: label || `v${nextVersion}` });
    content.url = url;
    await content.save();

    return res.json(content);
  } catch (error) {
    return res.status(500).json({ message: 'Version update failed', error: error.message });
  }
}

/**
 * Get all students subscribed to this mentor
 */
export async function listMyStudents(req, res) {
    try {
        const students = await User.find({ 
            tenantId: req.tenantId, 
            role: 'student',
            subscribedMentorIds: req.user.userId 
        }).select('email profile');
        return res.json(students);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load students', error: error.message });
    }
}

/**
 * Get all submissions pointing to this mentor
 */
export async function listSubmissions(req, res) {
    try {
        const submissions = await Submission.find({ tenantId: req.tenantId, mentorId: req.user.userId })
            .populate('studentId', 'email')
            .populate('contentId', 'title assignment');
        return res.json(submissions);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load submissions', error: error.message });
    }
}

/**
 * Mentor: list their own assignment contents.
 * Used by the mentor chat UI to select an assignment and open per-student threads.
 *
 * Multi-tenant isolation:
 * - Always filters by { tenantId: req.tenantId, mentorId: req.user.userId }.
 */
export async function listMyContent(req, res) {
  try {
    const contents = await Content.find({
      tenantId: req.tenantId,
      mentorId: req.user.userId,
    }).select('_id title url assignment');

    return res.json(contents);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load content', error: error.message });
  }
}

/**
 * Evaluate a submission
 */
export async function evaluateSubmission(req, res) {
    try {
        const { submissionId } = req.params;
        const { score, feedback } = req.body;
        
        const submission = await Submission.findOneAndUpdate(
            { _id: submissionId, mentorId: req.user.userId, tenantId: req.tenantId },
            { 
                status: 'evaluated', 
                evaluation: {
                    score: Number(score),
                    feedback,
                    evaluatedAt: new Date()
                }
            },
            { new: true }
        );

        if (!submission) return res.status(404).json({ message: 'Submission not found' });
        return res.json(submission);
    } catch (error) {
        return res.status(500).json({ message: 'Evaluation failed', error: error.message });
    }
}
