import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { type AuthRequest } from "../middlewares/auth.js";
import * as linkService from "../services/link.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { config } from "../utils/env.js";
import { ApiError } from "../utils/errors.js";
import { createLinkSchema, deleteLinkSchema } from "../validation/link.js";
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

/**
 * Redirect to original URL
 * GET /:shortCode
 */
export const redirectToOriginal = asyncHandler(
  async (req: Request, res: Response) => {
    const shortCode = req.params.shortCode as string; // ✅ Type assertion

    if (!shortCode) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Short code is required");
    }

    const link = await linkService.getLinkByShortCode(shortCode);
    linkService.incrementClicks(link.id).catch(() => {});

    res.redirect(StatusCodes.MOVED_PERMANENTLY, link.originalUrl);
  },
);

export const getUserLinks = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.userId;

    if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");

    // Parse pagination parameters from query string
    const limit = Math.min(Number(req.query.limit) || 10, 100); // max 100
    const offset = Math.max(Number(req.query.offset) || 0, 0);

    const [links, total] = await Promise.all([
      linkService.getUserLinks(userId, limit, offset),
      linkService.getTotalLinksCount(userId),
    ]);

    const linksWithShortUrl = links.map((link) => ({
      ...link,
      shortUrl: `${config.baseUrl}/${link.shortCode}`,
    }));

    res.json({
      data: linksWithShortUrl,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + links.length < total,
      },
    });
  },
);

export const deleteLink = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.userId;

    if (!userId) throw new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized");

    const { linkId } = req.params;

    if (!linkId || typeof linkId !== "string") {
      throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid link ID");
    }

    const validated = validate(deleteLinkSchema, { linkId });

    await linkService.deleteLinkById(validated.linkId, userId);

    res.status(StatusCodes.NO_CONTENT).send();
  },
);
