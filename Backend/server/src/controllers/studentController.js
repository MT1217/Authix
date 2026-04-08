import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { Content } from '../models/Content.js';
import { Submission } from '../models/Submission.js';

/**
 * Searches for mentors by name or expertise.
 */
export async function searchMentors(req, res) {
  try {
    const { query } = req.query;
    // Global mentor discovery for students (not tenant-restricted).
    let filter = { role: 'mentor' };
    
    if (query) {
      filter = {
        ...filter,
        $or: [
          { 'profile.name': { $regex: query, $options: 'i' } },
          { 'profile.expertise': { $regex: query, $options: 'i' } }
        ]
      };
    }
    
    const mentors = await User.find(filter).select('profile email');
    return res.json(mentors);
  } catch (error) {
    return res.status(500).json({ message: 'Mentor search failed', error: error.message });
  }
}

/**
 * Subscribe to a specific mentor.
 */
export async function subscribeToMentor(req, res) {
  try {
    const { mentorId } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(mentorId)) {
        return res.status(400).json({ message: 'Invalid mentor ID' });
    }

    const mentor = await User.findOne({ _id: mentorId, role: 'mentor' });
    if (!mentor) return res.status(404).json({ message: 'Mentor not found' });

    await User.findByIdAndUpdate(req.user.userId, {
      $addToSet: { subscribedMentorIds: mentor._id }
    });

    return res.json({ message: 'Subscribed successfully' });
  } catch (error) {
    return res.status(500).json({ message: 'Subscription failed', error: error.message });
  }
}

/**
 * List mentors this student is subscribed to.
 */
export async function listMyMentors(req, res) {
  try {
    const me = await User.findById(req.user.userId).populate('subscribedMentorIds', 'profile email');
    return res.json(me.subscribedMentorIds || []);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to load subscribed mentors', error: error.message });
  }
}

/**
 * Get content from a subscribed mentor.
 */
export async function getMentorContent(req, res) {
  try {
     const { mentorId } = req.params;
     const me = await User.findById(req.user.userId);

     const isSubscribed = (me?.subscribedMentorIds || []).some((id) => String(id) === String(mentorId));
     if (!isSubscribed) {
         return res.status(403).json({ message: 'Not subscribed to this mentor' });
     }

     const content = await Content.find({ mentorId });
     return res.json(content);
  } catch (error) {
     return res.status(500).json({ message: 'Failed to load content', error: error.message });
  }
}

/**
 * Submit answers to a mentor's assignment.
 */
export async function submitAssignment(req, res) {
    try {
        const { contentId } = req.params;
        const { answers, mentorId } = req.body;

        const me = await User.findById(req.user.userId);
        const isSubscribed = (me?.subscribedMentorIds || []).some((id) => String(id) === String(mentorId));
        if (!isSubscribed) {
            return res.status(403).json({ message: 'Not subscribed to this mentor' });
        }

        const content = await Content.findOne({ _id: contentId, mentorId });
        if (!content) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const submission = await Submission.findOneAndUpdate(
            { studentId: req.user.userId, contentId },
            { tenantId: content.tenantId, mentorId, answers, status: 'pending' },
            { upsert: true, new: true }
        );

        return res.json(submission);
    } catch (error) {
        return res.status(500).json({ message: 'Submission failed', error: error.message });
    }
}

/**
 * List the student's evaluated submissions (performance report loop).
 */
export async function listMySubmissions(req, res) {
    try {
        const submissions = await Submission.find({ studentId: req.user.userId })
            .populate('mentorId', 'profile.name')
            .populate('contentId', 'title');
        
        return res.json(submissions);
    } catch (error) {
        return res.status(500).json({ message: 'Failed to load submissions', error: error.message });
    }
}
