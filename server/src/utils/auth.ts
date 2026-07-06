import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";

import { config } from "./env.js";

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(
  plain: string,
  hashed: string,
): Promise<boolean> {
  return bcrypt.compare(plain, hashed);
}

// Hash a plain token (for storing)
export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

// Generate a cryptographically secure random token
export function generateRandomToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

// JWT helpers
export function generateAccessToken(userId: string): string {
  return jwt.sign({ userId }, config.accessTokenSecret, {
    expiresIn: "15m",
  });
}

export function verifyAccessToken(token: string): { userId: string } {
  return jwt.verify(token, config.accessTokenSecret) as {
    userId: string;
  };
}
