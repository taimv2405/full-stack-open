const dummy = (blogs) => 1;

const totalLikes = (blogs = []) =>
  blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = (blogs = []) => {
  if (blogs.length === 0) return null;

  return blogs.reduce((mostLiked, current) =>
    current.likes > mostLiked.likes ? current : mostLiked,
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
};
