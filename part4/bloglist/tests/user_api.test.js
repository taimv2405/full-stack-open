const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');

const app = require('../app');
const User = require('../models/user');
const helper = require('./test_helper');
const config = require('../utils/config');

const api = supertest(app);

describe('User API Integration Tests', () => {
  describe('when there is initially some users saved', () => {
    beforeEach(async () => {
      await User.deleteMany({});
      const DEFAULT_PASSWORD = '123456';
      const passwordHash = await bcrypt.hash(
        DEFAULT_PASSWORD,
        config.BCRYPT_SALT_ROUNDS,
      );
      await User.insertMany(
        helper.initialUsers.map((user) => ({ ...user, passwordHash })),
      );
    });

    describe('GET /api/users', () => {
      test('succeeds and returns all users as json', async () => {
        const response = await api
          .get('/api/users')
          .expect(200)
          .expect('Content-Type', /application\/json/);
        assert.strictEqual(response.body.length, helper.initialUsers.length);
      });
    });

    describe('POST /api/users', () => {
      test('successfully creates a new user', async () => {
        const newUser = {
          username: 'john',
          password: '123456',
          name: 'John',
        };

        await api
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();

        assert.strictEqual(usersAtEnd.length, helper.initialUsers.length + 1);
        assert(usersAtEnd.some((user) => user.username === newUser.username));
      });

      test('responds with status code 400 if the username is missing', async () => {
        const newUser = {
          password: '123456',
          name: 'John',
        };

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();
        assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
      });

      test('responds with status code 400 if the password is missing', async () => {
        const newUser = {
          username: 'john',
          name: 'John',
        };

        await api
          .post('/api/users')
          .send(newUser)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        const usersAtEnd = await helper.usersInDb();

        assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
      });

      test('responds with status code 400 if the username is under 3 characters long', async () => {
        const newUser = {
          username: 'jo',
          password: '123456',
          name: 'John',
        };

        await api.post('/api/users').send(newUser).expect(400);

        const usersAtEnd = await helper.usersInDb();

        assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
      });

      test('responds with status code 400 if the password is under 3 characters long', async () => {
        const newUser = {
          username: 'john',
          password: '12',
          name: 'John',
        };

        await api.post('/api/users').send(newUser).expect(400);

        const usersAtEnd = await helper.usersInDb();

        assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
      });

      test('responds with status code 409 if the username existed', async () => {
        const newUser = {
          username: 'anna',
          password: '123456',
          name: 'Anna',
        };

        await api.post('/api/users').send(newUser).expect(409);

        const usersAtEnd = await helper.usersInDb();

        assert.strictEqual(usersAtEnd.length, helper.initialUsers.length);
      });
    });
  });

  describe('when database is completely empty', () => {
    beforeEach(async () => {
      await User.deleteMany({});
    });

    describe('GET /api/users', () => {
      test('succeeds and returns an empty array', async () => {
        const response = await api
          .get('/api/users')
          .expect(200)
          .expect('Content-Type', /application\/json/);
        assert.strictEqual(response.body.length, 0);
      });
    });
  });

  after(async () => {
    await mongoose.connection.close();
  });
});
