import { Router } from 'express';
import {
  listEvents, createEvent, getEvent,
  upsertRsvp, deleteRsvp, myRsvps,
} from '../controllers/events.controller.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();
router.use(requireAuth);
router.get('/me/rsvps', myRsvps);
router.get('/', listEvents);
router.post('/', createEvent);
router.get('/:id', getEvent);
router.post('/:id/rsvp', upsertRsvp);
router.delete('/:id/rsvp', deleteRsvp);
export default router;
