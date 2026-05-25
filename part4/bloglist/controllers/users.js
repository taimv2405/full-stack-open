const usersRouter = require('express').Router();
const bcrypt = require('bcrypt');
const config = require('../utils/config');
const User = require('../models/user');

usersRouter.post('/', async (request, response) => {
  const { username, password, name } = request.body || {};

  if (typeof username !== 'string' || typeof password !== 'string') {
    return response
      .status(400)
      .json({ error: 'username and password must be valid strings' });
  }

  let trimmedName = undefined;
  if (name !== undefined) {
    if (typeof name !== 'string') {
      return response.status(400).json({
        error: 'name must be a string if provided',
      });
    }
    trimmedName = name.trim();
    if (!trimmedName) {
      return response
        .status(400)
        .json({ error: 'name cannot be empty if provided' });
    }
  }

  const trimmedUsername = username.trim();
  const trimmedPassword = password.trim();

  if (!trimmedUsername || !trimmedPassword) {
    return response
      .status(400)
      .json({ error: 'username and password cannot be empty' });
  }

  const passwordHash = await bcrypt.hash(
    trimmedPassword,
    config.BCRYPT_SALT_ROUNDS,
  );

  const user = new User({
    username: trimmedUsername,
    passwordHash,
    name: trimmedName,
  });

  const savedUser = await user.save();
  return response.status(201).json(savedUser);
});

usersRouter.get('/', async (_request, response) => {
  const users = await User.find({});
  response.json(users);
});

module.exports = usersRouter;
