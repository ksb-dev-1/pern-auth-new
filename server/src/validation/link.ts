import { z } from "zod";

const aliasSchema = z
  .string()
  .min(4, "Alias must be at least 4 characters")
  .max(20, "Alias must be at most 20 characters")
  .regex(
    /^[a-zA-Z0-9_-]+$/,
    "Alias can only contain letters, numbers, underscores and hyphens",
  )
  .optional();

export const createLinkSchema = z.object({
  originalUrl: z.string().url("Please provide a valid URL"),
  customAlias: aliasSchema,
});

export const deleteLinkSchema = z.object({
  linkId: z.uuid({ message: "Invalid link ID" }),
});
