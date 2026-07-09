import express from "express";

import {
  createShortLinkController,
  deleteLinkController,
  getUserLinksController,
} from "../controllers/link.controller.js";
import { protect } from "../middlewares/auth.js";

const router = express.Router();

router.use(protect);

router.post("/", createShortLinkController);
router.get("/", getUserLinksController);
router.delete("/:linkId", deleteLinkController);

export default router;
