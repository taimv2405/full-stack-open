const express = require('express');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const middleware = require('./utils/middleware');
const config = require('./utils/config');
const logger = require('./utils/logger');

const app = express();

mongoose.set('strictQuery', false);
logger.info('Connecting to DB');
mongoose
  .connect(config.MONGODB_URI, { family: 4 })
  .then(() => logger.info('Connected to DB'))
  .catch((error) => {
    logger.error('Error when connecting DB: ', error.message);
    process.exit(1);
  });

app.use(express.json());
app.use(middleware.requestLogger);
app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);
app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
