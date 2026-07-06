import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.string().default("5000"),
  DATABASE_URL: z.url(),
  ACCESS_TOKEN_SECRET: z.string().min(32),
  RESEND_API_KEY: z.string().min(1),
  FRONTEND_URL: z.url(),
  EMAIL_FROM: z.email(),
  COOKIE_DOMAIN: z.string().optional(),
  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  console.error("❌ Invalid environment variables:", parsed.error.issues);
  process.exit(1);
}

export const config = {
  nodeEnv: parsed.data.NODE_ENV,
  port: parseInt(parsed.data.PORT, 10),
  databaseUrl: parsed.data.DATABASE_URL,
  accessTokenSecret: parsed.data.ACCESS_TOKEN_SECRET,
  resendApiKey: parsed.data.RESEND_API_KEY,
  frontendUrl: parsed.data.FRONTEND_URL,
  emailFrom: parsed.data.EMAIL_FROM,
  cookieDomain: parsed.data.COOKIE_DOMAIN,
  cloudinary: {
    cloudName: parsed.data.CLOUDINARY_CLOUD_NAME,
    apiKey: parsed.data.CLOUDINARY_API_KEY,
    apiSecret: parsed.data.CLOUDINARY_API_SECRET,
  },
};
