import winston from "winston";

const { combine, timestamp, printf, colorize } = winston.format;

const customLevels = {
  levels: {
    error: 0,
    warn: 1,
    success: 2,
    info: 3,
    debug: 4,
  },
  colors: {
    error: "red",
    warn: "yellow",
    success: "green",
    info: "blue",
    debug: "gray",
  },
};

winston.addColors(customLevels.colors);

const logFormat = printf(({ level, message, timestamp, ...meta }) => {
  const metaString = Object.keys(meta).length
    ? JSON.stringify(meta)
    : "";

  return `${timestamp} [${level}] ${message} ${metaString}`;
});

const baseLogger = winston.createLogger({
  levels: customLevels.levels,
  level: "debug",
  format: combine(
    timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    logFormat
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        logFormat
      ),
    }),
  ],
});

type LogMethod = (...args: unknown[]) => void;

const logger = {
  error: (...args: unknown[]) => baseLogger.error(args),
  warn: (...args: unknown[]) => baseLogger.warn(args),
  info: (...args: unknown[]) => baseLogger.info(args),
  success: (...args: unknown[]) => baseLogger.log("success", args),
  debug: (...args: unknown[]) => baseLogger.debug(args),
};

export default logger;
