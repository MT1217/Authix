import express from 'express';
import { 
    searchMentors, 
    subscribeToMentor, 
    listMyMentors, 
    getMentorContent, 
    submitAssignment, 
    listMySubmissions 
} from '../controllers/studentController.js';
import { authenticate, requireSameTenant } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.use(authenticate, requireSameTenant, checkRole('student'));

router.get('/mentors/search', searchMentors);
router.post('/mentors/:mentorId/subscribe', subscribeToMentor);
router.get('/mentors/subscribed', listMyMentors);
router.get('/content/:mentorId', getMentorContent);
router.post('/content/:contentId/submit', submitAssignment);
router.get('/submissions', listMySubmissions);

export default router;
