import { Button, Box, Card } from '@mui/material';

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
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        padding: 2,
        marginTop: 2,
      }}
    >
      <h1 style={{ margin: 0 }}>{blog.title}</h1>
      {blog.author && <p style={{ margin: 0 }}>by {blog.author}</p>}
      <a href={blog.url}>{blog.url}</a>
      {blog.user && <div>Added by {blog.user.name}</div>}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <span>{blog.likes} likes</span>
        {user && (
          <Button onClick={handleLike} variant="outlined" size="small">
            like
          </Button>
        )}
        {user && user.username === blog.user?.username && (
          <Button
            onClick={handleRemove}
            color="error"
            variant="outlined"
            size="small"
          >
            remove
          </Button>
        )}
      </Box>
    </Card>
  );
};

export default Blog;
