import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthRequest } from "../middlewares/auth.js";
import * as authService from "../services/auth.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { config } from "../utils/env.js";
import { ApiError } from "../utils/errors.js";
import {
  forgotPasswordSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  signinSchema,
  signupSchema,
  updateProfileSchema,
} from "../validation/auth.js";
import { validate } from "../validation/validation.js";

// ---------- Signup ----------
export const signupController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password, name } = validate(signupSchema, req.body);

    await authService.signupService(email, password, name);

    res.status(StatusCodes.CREATED).json({
      message: "Signup successful. Please verify your email.",
    });
  },
);

// ---------- Verify Email ----------
export const verifyEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: "Token required",
      });
    }

    await authService.verifyEmailService(token);

    res.json({ message: "Email verified successfully" });
  },
);

// ---------- Signin ----------
export const signinController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email, password } = validate(signinSchema, req.body);

    const result = await authService.signinService(
      email,
      password,
      req.headers["user-agent"],
      req.ip,
    );

    // Set refresh token as HTTP-only cookie
    const cookieOptions: any = {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    };

    // Only add domain if it exists and is not empty
    if (config.cookieDomain?.trim()) {
      cookieOptions.domain = config.cookieDomain;
    }

    res.cookie("refreshToken", result.refreshToken, cookieOptions);

    // Send the response – this is what was missing
    res.json({
      accessToken: result.accessToken,
      user: result.user,
    });
  },
);

// ---------- Refresh Token ----------
export const refreshTokenController = asyncHandler(
  async (req: Request, res: Response) => {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(StatusCodes.UNAUTHORIZED).json({
        error: "Refresh token missing",
      });
    }

    const result = await authService.refreshTokensService(
      refreshToken,
      req.headers["user-agent"],
      req.ip,
    );

    // Set new refresh token (rotation)
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: config.nodeEnv === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
      domain: config.cookieDomain,
    });

    res.json({
      accessToken: result.accessToken,
      user: result.user,
    });
  },
);

// ---------- Logout ----------
export const logoutController = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.userId!;
    const refreshToken = req.cookies?.refreshToken;

    await authService.logoutService(userId, refreshToken);

    res.clearCookie("refreshToken", {
      path: "/",
      domain: config.cookieDomain,
    });

    res.json({ message: "Logged out successfully" });
  },
);

// ---------- Forgot Password ----------
export const forgotPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = validate(forgotPasswordSchema, req.body);

    await authService.forgotPasswordService(email);

    res.json({
      message: "If that email is registered, you will receive a reset link",
    });
  },
);

// ---------- Reset Password ----------
export const resetPasswordController = asyncHandler(
  async (req: Request, res: Response) => {
    const { token, newPassword } = validate(resetPasswordSchema, req.body);

    await authService.resetPasswordService(token, newPassword);

    res.json({ message: "Password reset successfully" });
  },
);

// ---------- Resend Verification Email ----------
export const resendVerificationEmailController = asyncHandler(
  async (req: Request, res: Response) => {
    const { email } = validate(resendVerificationSchema, req.body);

    await authService.resendVerificationEmailService(email);

    res.json({ message: "Verification email sent successfully" });
  },
);

// ---------- Get Profile ----------
export const getProfile = asyncHandler(async function (
  req: AuthRequest,
  res: Response,
) {
  const userId = req.userId!;

  const user = await authService.getProfile(userId);

  res.status(StatusCodes.OK).json(user);
});

// ---------- Update Profile ----------
export const updateProfile = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const userId = req.userId;

    if (!userId) throw new ApiError(StatusCodes.NOT_FOUND, "User not found");

    const { name } = validate(updateProfileSchema, req.body);

    const file = req.file;

    if (!name && !file)
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        "Provide name or image to update",
      );

    const updatedUser = await authService.updateProfile(
      userId,
      name,
      file?.buffer,
      file?.mimetype,
    );

    res.json({ message: "Profile updated successfully", user: updatedUser });
  },
);
