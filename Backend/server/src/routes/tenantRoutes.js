import { Router } from 'express';
import { getTenantSettings } from '../controllers/tenantController.js';

const router = Router();

router.get('/settings', getTenantSettings);

export default router;
