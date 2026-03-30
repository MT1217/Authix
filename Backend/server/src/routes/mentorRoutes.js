import { Router } from 'express';
import { createCourse, getStudentProgress } from '../controllers/mentorController.js';
import { permit, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, permit('mentor'));
router.post('/courses', createCourse);
router.get('/students/progress', getStudentProgress);

export default router;
