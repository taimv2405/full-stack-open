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

    describe('POST /api/blogs', () => {
      test('successfully creates a new blog post', async () => {
        const newBlog = {
          title: 'First class tests',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
          likes: 10,
        };

        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();

        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
        assert(blogsAtEnd.some((blog) => blog.title === newBlog.title));
      });

      test('defaults to the value 0 if the likes property is missing', async () => {
        const newBlog = {
          title: 'First class tests',
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        };

        const response = await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(201)
          .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        const savedBlog = blogsAtEnd.find(
          (blog) => blog.id === response.body.id,
        );

        assert.ok(savedBlog, 'Blog should be explicitly saved in the database');
        assert.strictEqual(savedBlog.likes, 0);
      });

      test('responds with status code 400 if the title is missing', async () => {
        const newBlog = {
          author: 'Robert C. Martin',
          url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.html',
        };

        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
      });

      test('responds with status code 400 if the url is missing', async () => {
        const newBlog = {
          author: 'Robert C. Martin',
          title: 'First class tests',
        };

        await api
          .post('/api/blogs')
          .send(newBlog)
          .expect(400)
          .expect('Content-Type', /application\/json/);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
      });
    });

    describe('DELETE /api/blogs/:id', () => {
      test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToDelete = blogsAtStart[0];

        await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1);
        assert(!blogsAtEnd.some((blog) => blog.id === blogToDelete.id));
      });

      test('responds with status code 204 if id does not exist', async () => {
        const nonExistingId = new mongoose.Types.ObjectId();
        await api.delete(`/api/blogs/${nonExistingId}`).expect(204);

        const blogsAtEnd = await helper.blogsInDb();
        assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
      });
    });

    describe('PUT /api/blogs/:id', () => {
      test('succeeds with status code 200 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb();
        const blogToUpdate = blogsAtStart[0];
        blogToUpdate.likes = blogToUpdate.likes + 5;

        await api
          .put(`/api/blogs/${blogToUpdate.id}`)
          .send(blogToUpdate)
          .expect(200);

        const blogsAtEnd = await helper.blogsInDb();
        const updatedBlog = blogsAtEnd.find(
          (blog) => blog.id === blogToUpdate.id,
        );

        assert.strictEqual(updatedBlog.likes, blogToUpdate.likes);
      });

      test('responds with status code 404 if id does not exist', async () => {
        const nonExistingId = new mongoose.Types.ObjectId();
        await api
          .put(`/api/blogs/${nonExistingId}`)
          .send({ likes: 100 })
          .expect(404);
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
