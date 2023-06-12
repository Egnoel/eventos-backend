import { Router } from "express";
import { subscribe, subscribed } from "../controllers/inscriptionController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.route("/:eventID").get(protect, subscribed);
router.route("/:eventID").post(protect, subscribe);

export default router;
