const blogsRouter = require('express').Router();

const Blog = require('../models/blog');
const middleware = require('../utils/middleware');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.get('/:id', async (request, response) => {
  const blogs = await Blog.findById(request.params.id).populate('user', {
    username: 1,
    name: 1,
  });
  response.json(blogs);
});

blogsRouter.post('/', middleware.userExtractor, async (request, response) => {
  const user = request.user;
  const { title, author, url, likes } = request.body;
  const blog = new Blog({ title, author, url, likes, user: user.id });
  const savedBlog = await blog.save();
  await savedBlog.populate('user', { username: 1, name: 1 });

  user.blogs = [...user.blogs, savedBlog._id];
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.post(
  '/:id/comments',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) return response.status(404).end();

    const { comment } = request.body;

    if (typeof comment !== 'string') {
      return response.status(400).json({ error: 'comment must be a string' });
    }
    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      return response.status(400).json({ error: 'comment cannot be empty' });
    }

    blog.comments.push(trimmedComment);

    const savedBlog = await blog.save();
    await savedBlog.populate('user', { username: 1, name: 1 });

    response.status(201).json(savedBlog);
  },
);

blogsRouter.delete(
  '/:id',
  middleware.userExtractor,
  async (request, response) => {
    const blog = await Blog.findById(request.params.id);
    if (!blog) {
      return response
        .status(404)
        .json({ error: 'blog not found or already deleted' });
    }

    if (!blog.user || blog.user.toString() !== request.user.id) {
      return response.status(403).json({ error: 'no permission' });
    }

    await blog.deleteOne();
    response.status(204).end();
  },
);

blogsRouter.put('/:id', middleware.userExtractor, async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) return response.status(404).end();

  const { title, author, url, likes } = request.body;
  blog.title = title ?? blog.title;
  blog.author = author ?? blog.author;
  blog.url = url ?? blog.url;
  blog.likes = likes ?? blog.likes;

  const savedBlog = await blog.save();
  await savedBlog.populate('user', { username: 1, name: 1 });
  response.status(200).json(savedBlog);
});

module.exports = blogsRouter;
