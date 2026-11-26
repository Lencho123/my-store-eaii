const express = require("express");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const materialRoute = require("./routes/materialRoute");
const initializeStorage = require("./services/storageService");
const app = express();

// Initialize storage before any route operation
(async () => {
  await initializeStorage();
})();

// Middleware for parsing incoming Json req bodies
app.use(express.json());

// Material apis
app.use("/api/materials", materialRoute);

// Handle unknown routes
app.use(notFound);

// Centralized error handling
app.use(errorHandler);

module.exports = app;
