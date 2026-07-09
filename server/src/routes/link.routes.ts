import express from "express";

import {
  createShortLink,
  getUserLinks,
} from "../controllers/link.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router.post("/", createShortLink);
router.get("/", getUserLinks); // ✅ This is the list endpoint

export default router;
