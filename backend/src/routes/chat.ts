import { Router } from 'express';
import { listThreads, findOrCreateThread, listMessages, sendMessage } from '../controllers/chat.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/threads', listThreads);
router.post('/threads', findOrCreateThread);
router.get('/threads/:id/messages', listMessages);
router.post('/threads/:id/messages', sendMessage);
export default router;
