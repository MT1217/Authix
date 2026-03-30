import { Router } from 'express';
import { approveMentor, getMentorQueue, getRevenueAnalytics } from '../controllers/adminController.js';
import { permit, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, permit('admin'));
router.get('/mentor-queue', getMentorQueue);
router.patch('/mentor-queue/:mentorId/approve', approveMentor);
router.get('/analytics/revenue', getRevenueAnalytics);

export default router;
