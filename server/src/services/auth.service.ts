import { and, eq } from "drizzle-orm";
import { StatusCodes } from "http-status-codes";

import { db } from "../db/index.js";
import { refreshSessions, users } from "../db/schema/index.js";
import {
  sendResetPasswordEmail,
  sendVerificationEmail,
} from "../emails/email.js";
import {
  comparePassword,
  generateAccessToken,
  generateRandomToken,
  hashPassword,
  hashToken,
} from "../utils/auth.js";
import { uploadAvatar } from "../utils/cloudinary.js";
import { ApiError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

// ---------- Signup ----------
export async function signupService(
  email: string,
  password: string,
  name?: string,
) {
  const [existing] = await db
    .select()
    .from(users)
    .where(eq(users.email, email));

  if (existing) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "User already exists");
  }

  const hashedPassword = await hashPassword(password);
  const plainToken = generateRandomToken();
  const tokenHash = hashToken(plainToken);
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

  const [newUser] = await db
    .insert(users)
    .values({
      email,
      password: hashedPassword,
      name: name || null,
      verificationTokenHash: tokenHash,
      verificationTokenExpiry: expiry,
    })
    .returning();

  // Send email (non-blocking – catch errors)
  sendVerificationEmail(email, plainToken).catch((err) =>
    logger.error("Failed to send verification email", { error: err, email }),
  );

  return { userId: newUser?.id };
}

// ---------- Verify Email ----------
export async function verifyEmailService(token: string) {
  const tokenHash = hashToken(token);

  const [user] = await db
    .select()
    .from(users)
    .where(
      and(
        eq(users.verificationTokenHash, tokenHash),
        eq(users.isVerified, false),
      ),
    );

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or expired token");
  }

  if (
    user.verificationTokenExpiry &&
    new Date() > user.verificationTokenExpiry
  ) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Token expired");
  }

  await db
    .update(users)
    .set({
      isVerified: true,
      verificationTokenHash: null,
      verificationTokenExpiry: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));
}

// ---------- Signin ----------
export async function signinService(
  email: string,
  password: string,
  device?: string,
  ip?: string,
) {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  if (!user.isVerified) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Email not verified");
  }

  const valid = await comparePassword(password, user.password);
  if (!valid) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
  }

  // Create refresh session
  const plainRefreshToken = generateRandomToken();
  const hashedRefreshToken = hashToken(plainRefreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await db.insert(refreshSessions).values({
    userId: user.id,
    hashedToken: hashedRefreshToken,
    expiresAt,
    device,
    ip,
  });

  const accessToken = generateAccessToken(user.id);

  return {
    accessToken,
    refreshToken: plainRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
    },
  };
}

// ---------- Refresh Tokens (Rotation) ----------
export async function refreshTokensService(
  refreshTokenPlain: string,
  device?: string,
  ip?: string,
) {
  const hashed = hashToken(refreshTokenPlain);

  // Find non‑revoked, non‑expired session
  const [session] = await db
    .select()
    .from(refreshSessions)
    .where(
      and(
        eq(refreshSessions.hashedToken, hashed),
        eq(refreshSessions.revoked, false),
      ),
    );

  if (!session) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid refresh token");
  }

  if (new Date() > session.expiresAt) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "Refresh token expired");
  }

  // Get user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, session.userId));
  if (!user) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, "User not found");
  }

  // --- Rotate: revoke old session, create new one ---
  await db
    .update(refreshSessions)
    .set({ revoked: true })
    .where(eq(refreshSessions.id, session.id));

  const newPlainRefreshToken = generateRandomToken();
  const newHashed = hashToken(newPlainRefreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  await db.insert(refreshSessions).values({
    userId: user.id,
    hashedToken: newHashed,
    expiresAt,
    device,
    ip,
  });

  const newAccessToken = generateAccessToken(user.id);

  return {
    accessToken: newAccessToken,
    refreshToken: newPlainRefreshToken,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      imageUrl: user.imageUrl,
    },
  };
}

// ---------- Logout (revoke specific session) ----------
export async function logoutService(
  userId: string,
  refreshTokenPlain?: string,
) {
  if (refreshTokenPlain) {
    const hashed = hashToken(refreshTokenPlain);
    await db
      .update(refreshSessions)
      .set({ revoked: true })
      .where(
        and(
          eq(refreshSessions.userId, userId),
          eq(refreshSessions.hashedToken, hashed),
        ),
      );
  } else {
    // If no token provided, revoke all sessions (optional, but we'll do it)
    await db
      .update(refreshSessions)
      .set({ revoked: true })
      .where(eq(refreshSessions.userId, userId));
  }
}

// ---------- Forgot Password ----------
export async function forgotPasswordService(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) return; // silent to avoid email enumeration

  const plainToken = generateRandomToken();
  const tokenHash = hashToken(plainToken);
  const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await db
    .update(users)
    .set({
      resetPasswordTokenHash: tokenHash,
      resetPasswordExpiry: expiry,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  sendResetPasswordEmail(email, plainToken).catch((err) =>
    logger.error("Failed to send reset password email", { error: err, email }),
  );
}

// ---------- Reset Password ----------
export async function resetPasswordService(token: string, newPassword: string) {
  const tokenHash = hashToken(token);

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.resetPasswordTokenHash, tokenHash));

  if (!user) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Invalid or expired token");
  }
  if (user.resetPasswordExpiry && new Date() > user.resetPasswordExpiry) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Token expired");
  }

  const hashedPassword = await hashPassword(newPassword);

  // Revoke all refresh sessions (security)
  await db
    .update(refreshSessions)
    .set({ revoked: true })
    .where(eq(refreshSessions.userId, user.id));

  await db
    .update(users)
    .set({
      password: hashedPassword,
      resetPasswordTokenHash: null,
      resetPasswordExpiry: null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));
}

// ---------- Resend Verification Email ----------
export async function resendVerificationEmailService(email: string) {
  const [user] = await db.select().from(users).where(eq(users.email, email));

  if (!user) {
    throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
  }

  if (user.isVerified) {
    throw new ApiError(StatusCodes.BAD_REQUEST, "Email already verified");
  }

  const plainToken = generateRandomToken();
  const tokenHash = hashToken(plainToken);
  const expiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

  await db
    .update(users)
    .set({
      verificationTokenHash: tokenHash,
      verificationTokenExpiry: expiry,
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  sendVerificationEmail(email, plainToken).catch((err) =>
    logger.error("Failed to resend verification email", { error: err, email }),
  );
}

// ---------- Get Profile ----------
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

// ---------- Update Profile ----------
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
