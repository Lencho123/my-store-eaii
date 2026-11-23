const express = require("express");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

// Middleware for parsing incoming Json req bodies
app.use(express.json());

// Home -welcome endpoint

app.get("/", (req, res) => {
  res.status(200).json({
    message: "Welcome to My Store api",
  });
});

// Handle unknown routes
app.use(notFound);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
