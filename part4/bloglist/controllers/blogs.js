const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogsRouter.post('/', async (request, response) => {
  const user = await User.findOne({});
  if (!user)
    return response.status(400).json({ error: 'no users in database' });

  const blog = new Blog({ ...request.body, user: user._id });
  const savedBlog = await blog.save();

  user.blogs = [...user.blogs, savedBlog._id];
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) return response.status(404).end();

  const { title, author, url, likes } = request.body;
  blog.title = title ?? blog.title;
  blog.author = author ?? blog.author;
  blog.url = url ?? blog.url;
  blog.likes = likes ?? blog.likes;

  const savedBlog = await blog.save();
  response.status(200).json(savedBlog);
});

module.exports = blogsRouter;
