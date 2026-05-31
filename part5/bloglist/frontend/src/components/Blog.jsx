import { useNavigate } from 'react-router-dom';

const Blog = ({ blog, onLike, user, onRemove }) => {
  const navigate = useNavigate();

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

  const handleRemove = async () => {
    const message = blog.author
      ? `${blog.title} by ${blog.author}`
      : blog.title;
    if (window.confirm(`Remove blog ${message}`)) {
      const success = await onRemove(blog.id);
      if (success) navigate('/');
    }
  };

  return (
    <>
      <h1>
        {blog.author}: {blog.title}
      </h1>
      <a href={blog.url}>{blog.url}</a>
      <div>
        likes {blog.likes} <button onClick={handleLike}>like</button>
      </div>
      {blog.user && <div>Added by {blog.user.name}</div>}
      {user && user.username === blog.user?.username && (
        <button onClick={handleRemove}>remove</button>
      )}
    </>
  );
};

export default Blog;
