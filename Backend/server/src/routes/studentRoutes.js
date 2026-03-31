import { Router } from 'express';
import { authenticate, requireSameTenant } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';
import { listMarketplace, listMyContent } from '../controllers/studentController.js';

const router = Router();

router.use(authenticate, requireSameTenant, checkRole('student'));
router.get('/marketplace', listMarketplace);
router.get('/my-content', listMyContent);

export default router;
