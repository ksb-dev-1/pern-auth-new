import { z } from "zod";

// Strong password policy: 8+ chars, uppercase, lowercase, number, special
const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

// ----- Signup -----
export const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100).optional(),
  email: z.email().transform((v) => v.trim().toLowerCase()),
  password: passwordSchema,
});

// ----- Signin -----
export const signinSchema = z.object({
  email: z.email().transform((v) => v.trim().toLowerCase()),
  password: z.string().min(1, "Password required"),
});

// ----- Forgot Password -----
export const forgotPasswordSchema = z.object({
  email: z.email().transform((v) => v.trim().toLowerCase()),
});

// ----- Reset Password -----
export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token required"),
  newPassword: passwordSchema,
});

// ----- Resend Verification -----
export const resendVerificationSchema = z.object({
  email: z.email().transform((v) => v.trim().toLowerCase()),
});

// ----- Refresh Token (if using body, but we usually read from cookie) -----
// For consistency, you might also have a schema if you pass it in body, but we'll use cookies.
