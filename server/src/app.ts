import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";

import { errorHandler } from "./middlewares/errorHandler.js";
import { authLimiter } from "./middlewares/rateLimitter.js";
import authRouter from "./routes/auth.routes.js";
import linkRouter from "./routes/link.routes.js";
import profileRouter from "./routes/profile.routes.js";
import { config } from "./utils/env.js";
import { morganStream } from "./utils/logger.js";

const app = express();

// Trust proxy (for correct IP behind reverse proxy)
if (config.nodeEnv === "production") {
  app.set("trust proxy", 1);
}

// Logging
app.use(morgan("combined", { stream: morganStream }));

// Security
app.use(
  helmet({
    hsts: {
      maxAge: 31536000,
      includeSubDomains: true,
      preload: true,
    },
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        // Add your frontend domain if needed: scriptSrc, styleSrc, imgSrc, etc.
      },
    },
  }),
);

// Compression
app.use(compression());

// CORS
app.use(
  cors({
    origin: config.frontendUrl,
    credentials: true,
  }),
);

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// Global rate limiting (optional – adjust limits as needed)
// app.use(globalLimiter); // if you want to limit all routes

// Auth rate limiting (applied only to auth endpoints)
app.use("/api/v1/auth", authLimiter);

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// API routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1", profileRouter);
app.use("/api/v1/links", linkRouter);

// Global error handler (must be last)
app.use(errorHandler);

export default app;
