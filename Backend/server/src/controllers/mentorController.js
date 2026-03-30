import { Course } from '../models/Course.js';
import { Enrollment } from '../models/Enrollment.js';

export async function createCourse(req, res) {
  const { title, description, priceInCents } = req.body;
  const course = await Course.create({
    tenantId: req.tenantId,
    mentorId: req.user.userId,
    title,
    description,
    priceInCents,
  });

  return res.status(201).json(course);
}

export async function getStudentProgress(req, res) {
  const courses = await Course.find({ tenantId: req.tenantId, mentorId: req.user.userId });
  const courseIds = courses.map((course) => course._id);
  const progress = await Enrollment.find({ tenantId: req.tenantId, courseId: { $in: courseIds } });

  return res.json(progress);
}
