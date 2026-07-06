import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

import { ApiError } from "../utils/errors.js";

export function validate<T>(schema: any, data: T): T {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const messages = error.issues
        .map((e) => `${e.path.join(".")}: ${e.message}`)
        .join(", ");
      throw new ApiError(StatusCodes.BAD_REQUEST, messages);
    }
    throw error;
  }
}
