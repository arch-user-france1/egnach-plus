import { Router } from 'express';
import { myAvailability, saveAvailability, userAvailability } from '../controllers/availability.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/', myAvailability);
router.put('/:date', saveAvailability);
router.get('/user/:userId', userAvailability);
export default router;
