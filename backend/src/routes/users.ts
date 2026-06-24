import { Router } from 'express';
import { patchMe, completeOnboarding } from '../controllers/users.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.patch('/me', patchMe);
router.post('/me/onboarding', completeOnboarding);
export default router;
