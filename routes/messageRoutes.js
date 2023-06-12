import { Router } from "express";
import { allMessages, sendMessage } from "../controllers/messageControllers.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/:eventID").get(protect, allMessages);
router.route("/:eventID").post(protect, sendMessage);

export default router;
