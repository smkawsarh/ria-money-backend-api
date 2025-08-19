"use strict";

const express = require("express");
const morgan = require("morgan");
const logger = require("./libs/logger");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const config = require("./config");

const app = express();

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(
    morgan("combined", {
      stream: { write: (message) => logger.info(message.trim()) },
    })
  );
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Root route for testing
app.get("/", (req, res) => {
  res.send("Welcome to the Recharge API!");
});

const apiRoutes = require("./routes/rai-money-apis/fetch-wallet");
app.use("/api", apiRoutes);

// Global error handling
app.use((err, req, res, next) => {
  logger.error(`ERROR: ${err.message}`);
  res.status(err.status || 500).json({
    status: "error",
    message: err.message || "Something went wrong!",
  });
});

module.exports = app;
