import type { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import type { AuthRequest } from "../middlewares/auth.js";
import * as authService from "../services/profile.service.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/errors.js";
import { updateProfileSchema } from "../validation/auth.js";
import { validate } from "../validation/validation.js";

/**
 * Get user profileL
 * GET /profile
 */
export const getProfileController = asyncHandler(async function (
  req: AuthRequest,
  res: Response,
) {
  const userId = req.userId!;

  const user = await authService.getProfile(userId);

  res.status(StatusCodes.OK).json(user);
});

/**
 * Update user profile
 * PUT /profile
 */
export const updateProfileController = asyncHandler(
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
