import { Router } from 'express';
import authRouter from './auth.js';
import usersRouter from './users.js';
import listingsRouter from './listings.js';
import eventsRouter from './events.js';
import chatRouter from './chat.js';
import availabilityRouter from './availability.js';

const router = Router();
router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/listings', listingsRouter);
router.use('/events', eventsRouter);
router.use('/chat', chatRouter);
router.use('/availability', availabilityRouter);
export default router;
