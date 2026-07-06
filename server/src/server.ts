import app from "./app.js";
import { config } from "./utils/env.js";
import { logger } from "./utils/logger.js";

const port = config.port;

const server = app.listen(port, () => {
  logger.info(`🚀 Server running in ${config.nodeEnv} mode on port ${port}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});

process.on("SIGINT", () => {
  logger.info("SIGINT received, shutting down gracefully");
  server.close(() => {
    logger.info("Server closed");
    process.exit(0);
  });
});
