import { Router } from "express";
import {
  registerUser,
  authUser,
  allUsers,
  addFavoriteEvent,
  removeFavoriteEvent,
  participateEvent,
  getUser,
  singleUser,
  unsubscribeEvent,
} from "../controllers/userControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/").get(protect, allUsers);
router.route("/user").get(protect, getUser);
router.route("/user/:id").get(protect, singleUser);
router.route("/").post(registerUser);
router.post("/login", authUser);
router.route("/addFav/:eventId").put(protect, addFavoriteEvent);
router.route("/removeFav/:eventId").put(protect, removeFavoriteEvent);
router.route("/signEvent/:eventId").put(protect, participateEvent);
router.route("/unsubscribeEvent/:eventId").put(protect, unsubscribeEvent);

export default router;
