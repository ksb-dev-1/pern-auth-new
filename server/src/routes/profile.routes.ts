import express from "express";

import {
  getProfileController,
  updateProfileController,
} from "../controllers/profile.controller.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/profile", protect, getProfileController);
router.put(
  "/profile",
  protect,
  upload.single("image"),
  updateProfileController,
);

export default router;
