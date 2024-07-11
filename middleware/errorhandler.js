// errorMiddleware.js
const logger = require('./logger');

function errorHandler(err, req, res, next) {
    // Log the error for debugging purposes
    logger.error(err);
  
    // Set the status code based on the error type or default to 500
    const statusCode = err.statusCode || 500;
  
    // Send a response to the client
    res.status(statusCode).json({
      error: {
        message: err.message || "Internal Server Error"
      }
    });
    next(err);
}

module.exports = errorHandler;
