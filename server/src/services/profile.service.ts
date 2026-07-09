import { eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

import { db } from "../db/index.js";
import { users } from "../db/schema/index.js";
import { uploadAvatar } from "../utils/cloudinary.js";
import { ApiError } from "../utils/errors.js";

// ---------- Get profile service ----------
export async function getProfile(userId: string) {
  if (!userId) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      imageUrl: users.imageUrl,
      isVerified: users.isVerified,
    })
    .from(users)
    .where(eq(users.id, userId));

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  return user;
}

// ---------- Update profile service ----------
export async function updateProfile(
  userId: string,
  name?: string,
  imageBuffer?: Buffer,
  mimeType?: string,
) {
  const updateData: any = { updatedAt: new Date() };

  if (name !== undefined) updateData.name = name;

  if (imageBuffer && mimeType) {
    const { url, publicId } = await uploadAvatar(userId, imageBuffer, mimeType);
    updateData.imageUrl = url;
    updateData.imagePublicId = publicId;
  }

  if (Object.keys(updateData).length === 1) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "No data to update");
  }

  const [updatedUser] = await db
    .update(users)
    .set(updateData)
    .where(eq(users.id, userId))
    .returning({
      id: users.id,
      email: users.email,
      name: users.name,
      imageUrl: users.imageUrl,
      isVerified: users.isVerified,
    });

  if (!updatedUser) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

  return updatedUser;
}
