import { Router } from 'express';
import { adminRegister, mentorLogin, mentorRegister } from '../controllers/publicAuthController.js';

const router = Router();

router.post('/admin-register', adminRegister);
router.post('/mentor-register', mentorRegister);
router.post('/mentor-login', mentorLogin);

export default router;

