import { z } from "zod";

export const createLinkSchema = z.object({
  originalUrl: z.url("Please provide a valid URL"),
});
