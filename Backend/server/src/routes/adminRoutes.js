import { Router } from 'express';
import { authenticate, requireSameTenant } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';
import { getCompanyOverview, updateBranding } from '../controllers/adminController.js';

const router = Router();

router.use(authenticate, requireSameTenant, checkRole('admin'));
router.patch('/branding', updateBranding);
router.get('/overview', getCompanyOverview);

export default router;
