require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');

const app = express();

// --- Database ---
const MONGODB_URI = process.env.MONGODB_URI;

console.log('Connecting to db');
mongoose
  .connect(MONGODB_URI, { family: 4 })
  .then(() => {
    console.log('Connected to DB');
  })
  .catch((error) => {
    console.error('Error when connecting DB: ', error);
  });

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
});

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Blog = mongoose.model('Blog', blogSchema);

// --- Middleware ---
app.use(express.json());

morgan.token('data', (request) => {
  return JSON.stringify(request.body);
});

app.use(
  morgan(':method :url :status :res[content-length] - :response-time ms :data'),
);

// --- Routes ---
app.get('/api/blogs', (request, response, next) => {
  Blog.find({})
    .then((blogs) => {
      response.json(blogs);
    })
    .catch((error) => next(error));
});

app.post('/api/blogs', (request, response, next) => {
  const blog = new Blog(request.body);

  blog
    .save()
    .then((savedBlog) => {
      response.status(201).json(savedBlog);
    })
    .catch((error) => next(error));
});

const unknownEndpoint = (request, response) => {
  response.status(404).json({ error: 'Unknown endpoint' });
};

app.use(unknownEndpoint);

// --- Middleware ---
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  return response.status(500).json({ error: 'Internal server error' });
};

app.use(errorHandler);

// --- Server Start ---
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
