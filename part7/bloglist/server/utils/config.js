require('dotenv').config();

const PORT = process.env.PORT || 3003;

const MONGODB_URI =
  process.env.NODE_ENV === 'test'
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

const BCRYPT_SALT_ROUNDS = Number(process.env.BCRYPT_SALT_ROUNDS) || 10;

const SECRET = process.env.SECRET;

const config = { PORT, MONGODB_URI, BCRYPT_SALT_ROUNDS, SECRET };
module.exports = config;
