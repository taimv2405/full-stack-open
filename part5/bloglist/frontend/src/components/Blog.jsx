import { useState } from 'react';

const Blog = ({ blog, onLike, user, onRemove }) => {
  const [detail, setDetail] = useState(false);

  const blogStyle = {
    border: '1px solid black',
    padding: '8px 16px',
    marginBottom: 5,
  };

  const toggleShowDetail = () => {
    setDetail(!detail);
  };

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
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleShowDetail}>{detail ? 'hide' : 'view'}</button>
      </div>
      {detail && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button onClick={handleLike}>like</button>
          </div>
          <div>{blog.user?.name}</div>
          {user?.username && user?.username === blog.user?.username && (
            <button onClick={handleRemove}>remove</button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
