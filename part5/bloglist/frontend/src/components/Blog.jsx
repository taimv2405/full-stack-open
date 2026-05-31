const Blog = ({ blog, onLike, user, onRemove }) => {
  if (!blog) {
    return null;
  }

  const handleLike = () => {
    const updatedBlog = {
      ...blog,
      likes: blog.likes + 1,
    };
    onLike(blog.id, updatedBlog);
  };

  const handleRemove = () => {
    const message = blog.author
      ? `${blog.title} by ${blog.author}`
      : blog.title;
    if (window.confirm(`Remove blog ${message}`)) {
      onRemove(blog.id);
    }
  };

  return (
    <>
      <h1>
        {blog.author}: {blog.title}
      </h1>
      <a href={blog.url}>{blog.url}</a>
      <div>
        <span>likes {blog.likes}</span>{' '}
        {user && <button onClick={handleLike}>like</button>}
      </div>
      {blog.user && <div>Added by {blog.user.name}</div>}
      {user && user.username === blog.user?.username && (
        <button onClick={handleRemove}>remove</button>
      )}
    </>
  );
};

export default Blog;
