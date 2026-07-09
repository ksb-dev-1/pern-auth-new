import { z } from "zod";

export const createLinkSchema = z.object({
  originalUrl: z.url("Please provide a valid URL"),
});

export const deleteLinkSchema = z.object({
  linkId: z.uuid("Invalid link ID"),
});
