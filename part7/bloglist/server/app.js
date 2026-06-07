const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
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
app.use(middleware.tokenExtractor);

app.get('/api/ping', (req, res) => {
  res.json({ message: 'pong', time: new Date().toISOString() });
});

app.use('/api/blogs', blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('/*splat', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
