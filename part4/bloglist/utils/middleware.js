const morgan = require('morgan');
const logger = require('./logger');

morgan.token('data', (request) => {
  return JSON.stringify(request.body);
});

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :data',
  {
    skip: () => process.env.NODE_ENV === 'test',
  },
);

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'Unknown endpoint' });
};

const errorHandler = (error, request, response, next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformed ID' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }

  return response.status(500).json({ error: 'Internal server error' });
};

const middleware = { requestLogger, unknownEndpoint, errorHandler };
module.exports = middleware;
