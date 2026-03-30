import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';
import { createCheckoutSession } from '../services/stripeService.js';

export async function getMarketplace(req, res) {
  const { q } = req.query;
  const query = { tenantId: req.tenantId };
  if (q) query.title = { $regex: q, $options: 'i' };

  const courses = await Course.find(query);
  return res.json(courses);
}

export async function getMyCourses(req, res) {
  const myEnrollments = await Enrollment.find({
    tenantId: req.tenantId,
    studentId: req.user.userId,
  }).populate('courseId');

  return res.json(myEnrollments);
}

export async function startCheckout(req, res) {
  const { courseTitle, amountInCents, mentorStripeAccountId } = req.body;
  const session = await createCheckoutSession({ courseTitle, amountInCents, mentorStripeAccountId });
  return res.json({ url: session.url });
}
