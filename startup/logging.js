const winston = require('winston');

module.exports = function() {
  // Handle uncaught exceptions
  winston.exceptions.handle(
    new winston.transports.File({ filename: 'uncaughtExceptions.log' })
  );
  
  // Add transports
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  // winston.add(new winston.transports.MongoDB({ 
  //   db: 'mongodb://localhost/vidly',
  //   level: 'info'
  // }));
};