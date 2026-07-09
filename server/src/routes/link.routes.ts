import express from "express";

import {
  createShortLink,
  deleteLink,
  getUserLinks,
} from "../controllers/link.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router.post("/", createShortLink);
router.get("/", getUserLinks);
router.delete("/:linkId", deleteLink);

export default router;
