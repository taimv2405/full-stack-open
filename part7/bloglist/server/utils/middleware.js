const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const logger = require('./logger');
const config = require('./config');
const User = require('../models/user');

morgan.token('data', (request) => {
  return JSON.stringify(request.body);
});

const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms :data',
  {
    skip: () => process.env.NODE_ENV === 'test',
  },
);

const getTokenFrom = (request) => {
  const authorization = request.get('Authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '');
  }
  return null;
};

const tokenExtractor = (request, response, next) => {
  request.token = getTokenFrom(request);
  next();
};

const userExtractor = async (request, response, next) => {
  if (!request.token) {
    return response.status(401).json({ error: 'token missing' });
  }
  const decodedToken = jwt.verify(request.token, config.SECRET);
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'invalid token' });
  }
  request.user = await User.findById(decodedToken.id);
  if (!request.user)
    return response.status(400).json({ error: 'user not found' });
  next();
};

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'Unknown endpoint' });
};

const errorHandler = (error, request, response, _next) => {
  logger.error(error.message);

  if (error.name === 'CastError') {
    return response.status(400).json({ error: 'Malformed ID' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.type === 'entity.parse.failed') {
    return response.status(400).json({ error: 'Malformed JSON payload' });
  } else if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(409)
      .json({ error: 'expected `username` to be unique' });
  } else if (
    error.name === 'JsonWebTokenError' ||
    error.name === 'TokenExpiredError'
  ) {
    return response.status(401).json({ error: 'token invalid or expired' });
  }
  return response.status(500).json({ error: 'Internal server error' });
};

const middleware = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor,
};
module.exports = middleware;
