// logger.js
const { createLogger, format, transports } = require('winston');
const { combine, timestamp, errors, printf } = format;

// Custom format to include error path and short message
const myFormat = printf(({ level, message, timestamp, stack }) => {
  // Extract path from stack trace
  const path = stack ? stack.split('\n')[1].trim().split(' ')[1] : '';

  return `${timestamp} ${level}: ${path} - ${message}`;
});

// Configure the logger with custom format
const logger = createLogger({
  level: 'info', // Set the default log level
  format: combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Add timestamp to logs
    errors({ stack: true }), // Include stack traces for errors
    myFormat // Use custom format
  ),
  transports: [
    new transports.Console(), // Log to console
    new transports.File({ filename: 'error.log', level: 'error' }), // Log errors to error.log
    new transports.File({ filename: 'combined.log' }) // Log all levels to combined.log
  ]
});

module.exports = logger;
