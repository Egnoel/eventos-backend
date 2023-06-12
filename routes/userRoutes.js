import { Router } from 'express';
import {
  registerUser,
  authUser,
  allUsers,
  addFavoriteEvent,
  removeFavoriteEvent,
} from '../controllers/userControllers.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.route('/').get(protect, allUsers);
router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/favorites/:eventId').post(protect, addFavoriteEvent);
router.route('/favorites/:eventId').delete(protect, removeFavoriteEvent);

export default router;
