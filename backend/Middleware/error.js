const ErrorHandler = require("../utils/errorHandler");

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  if (err.name === "CastError") {
    const message = `Resource not found. invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  } else if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    err = new ErrorHandler(message, 400);
  } else if (err.name === "JsonWebTokenError") {
    const message = `JSON Web Token is invalid, try again`;
    err = new ErrorHandler(message, 400);
  } else if (err.name === "TokenExpiredError") {
    const message = `JSON Web Token is Expired, try again`;
    err = new ErrorHandler(message, 400);
  }

  const errorResponse = {
    success: false,
    message: err.message,
  };
  if (process.env.NODE_ENV === "development") {
    errorResponse.error = err.stack;
  }

  res.status(err.statusCode).json(errorResponse);
};
