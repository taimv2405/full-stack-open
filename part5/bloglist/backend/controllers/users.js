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

  if (!trimmedUsername || !password) {
    return response
      .status(400)
      .json({ error: 'username and password cannot be empty' });
  }

  if (password.length < 3) {
    return response
      .status(400)
      .json({ error: 'password must be at least 3 characters long' });
  }

  const passwordHash = await bcrypt.hash(password, config.BCRYPT_SALT_ROUNDS);

  const user = new User({
    username: trimmedUsername,
    passwordHash,
    name: trimmedName,
  });

  const savedUser = await user.save();
  return response.status(201).json(savedUser);
});

usersRouter.get('/', async (_request, response) => {
  const users = await User.find({}).populate('blogs', {
    title: 1,
    author: 1,
    url: 1,
    likes: 1,
  });
  response.json(users);
});

module.exports = usersRouter;
