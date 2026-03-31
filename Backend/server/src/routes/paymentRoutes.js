import { Router } from 'express';
import { authenticate, requireSameTenant } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';
import { createPaymentIntent } from '../controllers/paymentController.js';

const router = Router();

router.post(
  '/create-intent',
  authenticate,
  requireSameTenant,
  checkRole('student'),
  createPaymentIntent
);

export default router;
