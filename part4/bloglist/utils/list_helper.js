const _ = require('lodash');

const dummy = (_blogs) => 1;

const totalLikes = (blogs = []) =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs = []) => {
  if (blogs.length === 0) return null;

  return blogs.reduce((mostLiked, current) =>
    current.likes > mostLiked.likes ? current : mostLiked,
  );
};

const mostBlogs = (blogs = []) => {
  if (blogs.length === 0) return null;

  return _.chain(blogs)
    .countBy('author')
    .map((blogCount, authorName) => ({ author: authorName, blogs: blogCount }))
    .maxBy('blogs')
    .value();
};

const mostLikes = (blogs = []) => {
  if (blogs.length === 0) return null;

  return _.chain(blogs)
    .groupBy('author')
    .map((blogs, authorName) => ({
      author: authorName,
      likes: _.sumBy(blogs, 'likes'),
    }))
    .maxBy('likes')
    .value();
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
