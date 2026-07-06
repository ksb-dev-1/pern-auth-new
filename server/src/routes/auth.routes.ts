import express from "express";

import {
  forgotPasswordController,
  getProfile,
  logoutController,
  refreshTokenController,
  resendVerificationEmailController,
  resetPasswordController,
  signinController,
  signupController,
  updateProfile,
  verifyEmailController,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.js";
import { upload } from "../middlewares/upload.js";

const router = express.Router();

// Public routes
router.post("/signup", signupController);
router.get("/verify-email", verifyEmailController);
router.post("/signin", signinController);
router.post("/refresh", refreshTokenController);
router.post("/forgot-password", forgotPasswordController);
router.post("/reset-password", resetPasswordController);
router.post("/resend-verification", resendVerificationEmailController);

// Protected routes
router.post("/logout", protect, logoutController);
router.get("/profile", protect, getProfile);
router.put("/profile", protect, upload.single("image"), updateProfile);

export default router;
