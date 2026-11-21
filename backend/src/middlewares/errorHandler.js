const errorHandler = (err, req, res, next) => {
  console.log(err);
  const statusCode = err.statusCode || err.status || 500;

  const message = statusCode >= 500 ? "Internal server problem" : err.message;

  res.status(statusCode).json({ error: message });
};

module.exports = errorHandler;
