import express from "express";

import { createShortLink } from "../controllers/link.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

// All routes under /api/v1/links are protected
router.use(protect);

// Create a short link
router.post("/", createShortLink);

export default router;
