const loginRouter = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../utils/config');

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body || {};

  if (typeof username !== 'string' || typeof password !== 'string') {
    return response
      .status(400)
      .json({ error: 'username and password must be valid strings' });
  }

  const trimmedUsername = username.trim();

  if (!trimmedUsername || !password) {
    return response
      .status(400)
      .json({ error: 'username and password cannot be empty' });
  }

  const user = await User.findOne({ username: trimmedUsername });
  const passwordCorrect =
    user === null ? false : await bcrypt.compare(password, user.passwordHash);
  if (!user || !passwordCorrect) {
    return response.status(401).json({ error: 'invalid username or password' });
  }

  const userForToken = {
    id: user._id,
    username: user.username,
  };
  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60 * 60 });

  response
    .status(200)
    .json({ username: user.username, name: user.name, token });
});

module.exports = loginRouter;
