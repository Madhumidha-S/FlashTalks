import winston from "winston";
import config from "../config.js";

const logger = winston.createLogger({
  level: config.env === "development" ? "debug" : "info",
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
    winston.format.json()
  ),
  defaultMeta: {
    service: "flash_talks_service",
    app: "FlashTalks",
    environment: config.env,
  },
});

if (config.env !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
}

export default logger;
