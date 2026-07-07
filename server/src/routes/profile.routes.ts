import express from "express";

import {
  getProfile,
  updateProfile,
} from "../controllers/profile.controller.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("image"), updateProfile);

export default router;
