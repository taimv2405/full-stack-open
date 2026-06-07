import { Button, Box, Card, Typography } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlogs, useBlogMutations } from '../hooks/useBlogs';
import { useNotification } from '../contexts/NotificationContext';

const Blog = ({ user }) => {
  const navigate = useNavigate();
  const { notify, notifyError } = useNotification();
  const { blogs, isPending, isError } = useBlogs();
  const { updateBlog, removeBlog } = useBlogMutations();
  const { id } = useParams();

  if (isPending) {
    return <Typography>Loading blogs...</Typography>;
  }

  if (isError) {
    return <Typography>Could not load blogs</Typography>;
  }

  const blog = blogs.find((blog) => blog.id === id);

  if (!blog) {
    return <Typography>404 - Blog not found</Typography>;
  }

  const handleLike = async () => {
    try {
      const updatePayload = {
        id: blog.id,
        likes: blog.likes + 1,
      };
      await updateBlog(updatePayload);
    } catch (error) {
      notifyError(error);
    }
  };

  const handleRemove = async () => {
    const message = blog.author
      ? `${blog.title} by ${blog.author}`
      : blog.title;
    if (window.confirm(`Remove blog ${message}`)) {
      try {
        await removeBlog(blog.id);
        notify(`blog ${message} removed`, 'success');
        navigate('/');
      } catch (error) {
        notifyError(error);
      }
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
