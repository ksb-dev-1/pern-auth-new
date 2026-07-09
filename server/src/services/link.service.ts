import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";

import { db } from "../db/index.js";
import { links } from "../db/schema/index.js";
import { ApiError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

const SHORT_CODE_LENGTH = 6;

/**
 * Generate a unique short code (with collision retry)
 */
async function generateUniqueShortCode(): Promise<string> {
  for (let attempt = 1; attempt <= 3; attempt++) {
    const code = nanoid(SHORT_CODE_LENGTH);

    const [existing] = await db
      .select()
      .from(links)
      .where(eq(links.shortCode, code))
      .limit(1);

    if (!existing) {
      return code;
    }

    logger.warn(`Short code collision: "${code}", retrying (${attempt}/3)`);
  }

  throw new ApiError(
    StatusCodes.INTERNAL_SERVER_ERROR,
    "Failed to generate unique code",
  );
}

/**
 * Create a new short link for a user
 */
export async function createShortLink(userId: string, originalUrl: string) {
  // Validate URL format
  try {
    new URL(originalUrl);
  } catch {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid URL format");
  }

  const shortCode = await generateUniqueShortCode();

  const [newLink] = await db
    .insert(links)
    .values({
      userId,
      originalUrl,
      shortCode,
    })
    .returning({
      id: links.id,
      shortCode: links.shortCode,
      originalUrl: links.originalUrl,
      createdAt: links.createdAt,
    });

  if (!newLink) {
    throw new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      "Failed to create short link",
    );
  }

  return newLink;
}
