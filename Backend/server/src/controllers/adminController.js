import { User } from '../models/User.js';

export async function getMentorQueue(req, res) {
  const pendingMentors = await User.find({
    tenantId: req.tenantId,
    role: 'mentor',
    isApprovedMentor: false,
  });

  return res.json(pendingMentors);
}

export async function approveMentor(req, res) {
  const { mentorId } = req.params;
  const mentor = await User.findOneAndUpdate(
    { _id: mentorId, tenantId: req.tenantId, role: 'mentor' },
    { isApprovedMentor: true },
    { new: true }
  );

  if (!mentor) return res.status(404).json({ message: 'Mentor not found in tenant scope' });
  return res.json(mentor);
}

export function getRevenueAnalytics(req, res) {
  return res.json({
    tenantId: req.tenantId,
    grossVolume: 12840,
    platformRevenue: 1284,
    mentorPayouts: 11556,
  });
}
