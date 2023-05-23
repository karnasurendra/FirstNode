const winston = require('winston');

// Create a Winston logger instance
const logger = winston.createLogger({
    transports: [
      new winston.transports.Console(),
      new winston.transports.File({ filename: 'error.log', level: 'error' }),
    ],
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  });
  
  // Error handling middleware
  const errorHandlerMiddleware = async (request, h) => {
    try {
      // Proceed with the request handling
      const response = await h.continue;
      return response;
    } catch (error) {
      // Log the error using the Winston logger
      logger.error(error);
  
      // Handle the error and send an appropriate response
      return h.response('Internal Server Error === ' + error.details[0]).code(500);
    }
  };
  
  module.exports = {
    logger,
    errorHandlerMiddleware,
  };