import { Router } from 'express';
import { protect } from '../middleware/authMiddleware.js';
import {
  allEvents,
  createEvent,
  oneEvent,
  editEvent,
  filterEvents,
  deleteEvent,
  registerForEvent,
} from '../controllers/eventController.js';

const router = Router();

router.route('/').get(allEvents);
router.route('/:id').get(oneEvent);
router.route('/create').post(protect, createEvent);
router.route('/:id').put(protect, editEvent);
router.route('/filter').get(filterEvents);
router.route('/:id').delete(protect, deleteEvent);
router.route('/register/:id').post(protect, registerForEvent);

export default router;
