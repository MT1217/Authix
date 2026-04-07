import express from 'express';
import { 
    createContent, 
    addContentVersion, 
    listMyStudents, 
    listSubmissions, 
    evaluateSubmission 
} from '../controllers/mentorController.js';
import { authenticate, requireSameTenant } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';

const router = express.Router();

router.use(authenticate, requireSameTenant, checkRole('mentor'));

router.post('/content', createContent);
router.post('/content/:contentId/version', addContentVersion);

router.get('/students', listMyStudents);
router.get('/submissions', listSubmissions);
router.put('/submissions/:submissionId/evaluate', evaluateSubmission);

export default router;
