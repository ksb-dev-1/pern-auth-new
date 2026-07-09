import { type Response } from "express";
import { StatusCodes } from "http-status-codes";

import { type AuthRequest } from "../middlewares/auth.js";
import * as linkService from "../services/link.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { config } from "../utils/env.js";
import { ApiError } from "../utils/errors.js";
import { createLinkSchema } from "../validation/link.js";
import { validate } from "../validation/validation.js";

export const createShortLink = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.userId;
    if (!userId) {
      throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");
    }

    const { originalUrl } = validate(createLinkSchema, req.body);

    const link = await linkService.createShortLink(userId, originalUrl);

    // Build full short URL
    const shortUrl = `${config.baseUrl}/${link.shortCode}`;

    res.status(StatusCodes.CREATED).json({
      id: link.id,
      shortCode: link.shortCode,
      shortUrl,
      originalUrl: link.originalUrl,
      createdAt: link.createdAt,
    });
  },
);
