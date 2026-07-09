import { and, desc, eq, sql } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";
import { nanoid } from "nanoid";

import { db } from "../db/index.js";
import { links } from "../db/schema/index.js";
import { ApiError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

const SHORT_CODE_LENGTH = 6;

const RESERVED_ALIASES = [
  "admin",
  "api",
  "login",
  "signin",
  "signup",
  "logout",
  "profile",
  "settings",
  "dashboard",
  "health",
  "auth",
  "favicon",
  "robots",
  "sitemap",
  "static",
  "assets",
];

function isReservedAlias(alias: string): boolean {
  return RESERVED_ALIASES.includes(alias.toLowerCase());
}

// Generate a unique short code (with collision retry)
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

// ----- Create short link service -----
export async function createShortLinkService(
  userId: string,
  originalUrl: string,
  customAlias?: string,
) {
  // Validate URL format
  try {
    new URL(originalUrl);
  } catch {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid URL format");
  }

  let shortCode: string;

  if (customAlias) {
    // Check if alias is reserved
    if (isReservedAlias(customAlias)) {
      throw new ApiError(StatusCodes.BAD_REQUEST, "This alias is reserved");
    }

    // Check if alias already exists
    const [existing] = await db
      .select()
      .from(links)
      .where(eq(links.shortCode, customAlias))
      .limit(1);

    if (existing) {
      throw new ApiError(StatusCodes.CONFLICT, "This alias is already taken");
    }

    shortCode = customAlias;
  } else {
    // Generate random code (existing logic)
    shortCode = await generateUniqueShortCode();
  }

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

// ----- Get link by short code service -----
export async function getLinkByShortCodeService(shortCode: string) {
  const [link] = await db
    .select({
      id: links.id,
      originalUrl: links.originalUrl,
      clicks: links.clicks,
    })
    .from(links)
    .where(eq(links.shortCode, shortCode))
    .limit(1);

  if (!link) {
    throw new ApiError(StatusCodes.NOT_FOUND, "Link not found");
  }
  return link;
}

// ----- Icrement link clicks service -----
export async function incrementClicks(linkId: string) {
  await db
    .update(links)
    .set({ clicks: sql`${links.clicks} + 1` })
    .where(eq(links.id, linkId));
}

// ----- Get user links service -----
export async function getUserLinksService(
  userId: string,
  limit: number = 10,
  offset: number = 0,
) {
  return db
    .select({
      id: links.id,
      shortCode: links.shortCode,
      originalUrl: links.originalUrl,
      clicks: links.clicks,
      createdAt: links.createdAt,
    })
    .from(links)
    .where(eq(links.userId, userId))
    .orderBy(desc(links.createdAt))
    .limit(limit)
    .offset(offset);
}

// ----- Get total counts service -----
export async function getTotalLinksCount(userId: string) {
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(links)
    .where(eq(links.userId, userId));
  return Number(result[0]?.count ?? 0);
}

// ----- Delete link by ID service -----
export async function deleteLinkById(linkId: string, userId: string) {
  const [deletedLink] = await db
    .delete(links)
    .where(and(eq(links.id, linkId), eq(links.userId, userId)))
    .returning({ id: links.id });

  if (!deletedLink) {
    throw new ApiError(
      StatusCodes.NOT_FOUND,
      "Link not found or you don't have permission",
    );
  }

  return deletedLink;
}
