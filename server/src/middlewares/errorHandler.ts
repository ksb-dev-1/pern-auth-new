import type { NextFunction, Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import { config } from "../utils/env.js";
import { ApiError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // Log the error
  logger.error(err.stack || err.message || "Unknown error", {
    path: req.path,
    method: req.method,
    ip: req.ip,
  });

  // Zod validation errors
  if (err instanceof ZodError) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: err.message });
  }

  // Custom API errors
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Multer errors (optional)
  if (err.code === "LIMIT_FILE_SIZE") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ error: "File too large" });
  }

  // Default internal server error
  const status = err.status || StatusCodes.INTERNAL_SERVER_ERROR;
  const message =
    config.nodeEnv === "production"
      ? "Internal server error"
      : err.message || "Something went wrong";

  res.status(status).json({ error: message });
};
