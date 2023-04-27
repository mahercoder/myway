const winston = require("winston");
const config = require("./config");

const logger = winston.createLogger({
  defaultMeta: {
    date: new Date(),
  },
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: "logs/error.log", level: "error" }),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

if (!config.production) {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = logger;
