import { Router } from 'express';
import { getMarketplace, getMyCourses, startCheckout } from '../controllers/studentController.js';
import { permit, requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth, permit('student'));
router.get('/marketplace', getMarketplace);
router.get('/my-courses', getMyCourses);
router.post('/checkout', startCheckout);

export default router;
