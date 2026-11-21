const createAppError = require("../utils/appError");

const notFound = (req, res, next) => {
  next(createAppError("Route not found", 404));
};

module.exports = notFound;
