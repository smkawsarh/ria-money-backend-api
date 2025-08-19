"use strict";

const winston = require("winston");
const { createLogger, format, transports } = winston;
require("winston-daily-rotate-file");
const path = require("path");
const fs = require("fs");

// Function to ensure year/month directory exists
function ensureLogDirectory() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");

  const yearDir = path.join(__dirname, "../logs", String(year));
  const monthDir = path.join(yearDir, String(month));

  if (!fs.existsSync(yearDir)) {
    fs.mkdirSync(yearDir);
  }
  if (!fs.existsSync(monthDir)) {
    fs.mkdirSync(monthDir);
  }

  return monthDir;
}

// Get the log directory dynamically
const logDirectory = ensureLogDirectory();

// Configure DailyRotateFile transport
const dailyRotateFileTransport = new transports.DailyRotateFile({
  filename: path.join(logDirectory, "app-%DATE%.log"),
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  maxSize: "20m",
  maxFiles: "60d",
});

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }), // Timestamp format
    format.printf(
      ({ timestamp, level, message }) => `${timestamp} ${level}: ${message}`
    )
  ),
  transports: [
    new transports.Console(),
    dailyRotateFileTransport,
  ],
});

module.exports = logger;
