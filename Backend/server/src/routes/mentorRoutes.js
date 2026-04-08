import express from 'express';
import { 
    createContent, 
    addContentVersion, 
    listMyStudents, 
    listSubmissions, 
    evaluateSubmission,
    listMyContent
} from '../controllers/mentorController.js';
import { authenticate, requireSameTenant } from '../middleware/auth.js';
import { checkRole } from '../middleware/checkRole.js';
import { getMentorThreadMessages, listMentorThreads, postMentorMessage } from '../controllers/chatController.js';

const router = express.Router();

router.use(authenticate, requireSameTenant, checkRole('mentor'));

router.post('/content', createContent);
router.post('/content/:contentId/version', addContentVersion);

router.get('/students', listMyStudents);
router.get('/submissions', listSubmissions);
router.put('/submissions/:submissionId/evaluate', evaluateSubmission);

// List mentor assignments/contents (used for assignment-wise chat UI)
router.get('/content', listMyContent);

// Assignment + student chat threads
router.get('/chats/threads', listMentorThreads);
router.get('/chats/threads/:assignmentId/:studentId/messages', getMentorThreadMessages);
router.post('/chats/threads/:assignmentId/:studentId/messages', postMentorMessage);

export default router;
