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
//Function to add two numbers
const add = (n1, n2) => {
  return n1 + n2;
};
// API Route for Addition
app.get("/add", (req, res) => {
  try {
    // Parse query parameters as floating point numbers
    const n1 = parseFloat(req.query.n1);
    const n2 = parseFloat(req.query.n2);
    if (isNaN(n1)) {
      logger.error("n1 is incorrectly defined");
      throw new Error("n1 incorrectly defined");
    }
    // Validate the inputs
    if (isNaN(n2)) {
      logger.error("n2 is incorrectly defined");
      throw new Error("n2 incorrectly defined");
    }

    if (n1 === NaN || n2 === NaN) {
      console.log();
      throw new Error("Parsing Error");
    }
    // Log the received parameters
    logger.info("Parameters " + n1 + " and " + n2 + " received for addition");
    // Perform addition
    const result = add(n1, n2);
    // Perform addition
    res.status(200).json({ statuscocde: 200, data: result });
  } catch (error) {
    // Log errors
    console.error(error);
    // Return error response
    res.status(500).json({ statuscocde: 500, msg: error.toString() });
  }
});
// Define the port number
const port = 3040;
// Start the server
app.listen(port, () => {
  console.log("hello i'm listening to port " + port);
});
