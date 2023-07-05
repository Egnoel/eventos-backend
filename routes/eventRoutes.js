import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  allEvents,
  createEvent,
  oneEvent,
  editEvent,
  filterEvents,
  deleteEvent,
  myEvents,
  myFavorites,
} from "../controllers/eventController.js";

const router = Router();

router.route("/").get(allEvents);
router.route("/created").get(protect, myEvents);
router.route("/favourites").get(protect, myFavorites);
router.route("/:id").get(oneEvent);
router.route("/create").post(protect, createEvent);
router.route("/:id").put(protect, editEvent);
router.route("/filter").get(filterEvents);
router.route("/:id").delete(protect, deleteEvent);

export default router;
