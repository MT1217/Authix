import { Router } from 'express';
import { authenticate, requireSameTenant } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';
import { addContentVersion, createContent } from '../controllers/mentorController.js';

const router = Router();

router.use(authenticate, requireSameTenant, checkRole('mentor'));
router.post('/content', createContent);
router.post('/content/:contentId/version', addContentVersion);

export default router;
