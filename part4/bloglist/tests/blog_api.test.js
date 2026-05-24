const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');

const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');

const api = supertest(app);

describe('Blog API Integration Tests', () => {
  describe('when there is initially some blogs saved', () => {
    beforeEach(async () => {
      await Blog.deleteMany({});
      await Blog.insertMany(helper.initialBlogs);
    });

    describe('GET /api/blogs', () => {
      test('succeeds and returns all blogs as json', async () => {
        const response = await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/);
        assert.strictEqual(response.body.length, helper.initialBlogs.length);
      });

      test('the unique identifier property of the blog posts is named id', async () => {
        const response = await api
          .get('/api/blogs')
          .expect(200)
          .expect('Content-Type', /application\/json/);
        response.body.forEach((blog) => {
          assert.ok(blog.id, "Blog is missing the 'id' property");
          assert.strictEqual(blog._id, undefined);
          assert.strictEqual(blog.__v, undefined);
        });
      });
    });
  });

  describe('when database is completely empty', () => {
    beforeEach(async () => {
      await Blog.deleteMany({});
    });

    describe('GET /api/blogs', () => {
      test('succeeds and returns an empty array', async () => {
        const response = await api
          .get('/api/blogs')
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
