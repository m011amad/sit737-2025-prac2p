// Import required modules
const express = require("express");
// Create an Express application
const app = express();
const fs = require("fs");
const winston = require("winston");
// Configure Winston Logger
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "add-service" },
  transports: [
    //
    // - Write all logs with importance level of `error` or less to `error.log`
    // - Write all logs with importance level of `info` or less to `combined.log`
    //
    new winston.transports.File({ filename: "error.log", level: "error" }),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
// Enable logging in the console when not in production
if (process.env.NODE_ENV !== "production") {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

// Mathematical operation functions
const operations = {
  add: (n1, n2) => n1 + n2,
  subtract: (n1, n2) => n1 - n2,
  multiply: (n1, n2) => n1 * n2,
  divide: (n1, n2) => {
    if (n2 === 0) throw new Error("Division by zero is not allowed");
    return n1 / n2;
  },
};
// Universal route handler for operations
const handleOperation = (operation, req, res) => {
  try {
    const n1 = parseFloat(req.query.n1);
    const n2 = parseFloat(req.query.n2);

    if (isNaN(n1) || isNaN(n2)) {
      logger.error(`Invalid input: n1=${req.query.n1}, n2=${req.query.n2}`);
      throw new Error("Invalid input: Both n1 and n2 must be numbers");
    }

    const result = operations[operation](n1, n2);
    logger.info(
      `Operation: ${operation}, Parameters: ${n1}, ${n2}, Result: ${result}`
    );

    res.status(200).json({ statuscode: 200, operation, data: result });
  } catch (error) {
    logger.error(error.message);
    res.status(500).json({ statuscode: 500, msg: error.message });
  }
};

// API Routes
app.get("/add", (req, res) => handleOperation("add", req, res));
app.get("/subtract", (req, res) => handleOperation("subtract", req, res));
app.get("/multiply", (req, res) => handleOperation("multiply", req, res));
app.get("/divide", (req, res) => handleOperation("divide", req, res));

const port = 3040;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
