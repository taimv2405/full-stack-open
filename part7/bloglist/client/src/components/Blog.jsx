import { Button, Box, Card, Typography, Link } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useBlog, useBlogMutations } from '../hooks/useBlogs';
import { useNotificationActions } from '../stores/notificationStore';
import { useUser } from '../stores/userStore';
import { Comments } from './Comments';

const Blog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { notify, notifyError } = useNotificationActions();
  const user = useUser();
  const { blog, isPending, isError } = useBlog(id);
  const { updateBlog, removeBlog } = useBlogMutations();

  if (isPending) {
    return <Typography>Loading blog...</Typography>;
  }

  if (isError) {
    return <Typography>Could not load blog</Typography>;
  }

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
      <Typography component="h1" variant="h5">
        {blog.title}
      </Typography>
      {blog.author && <Typography>by {blog.author}</Typography>}
      <Link href={blog.url}>{blog.url}</Link>
      {blog.user && <Typography>Added by {blog.user.name}</Typography>}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography component="span">{blog.likes} likes</Typography>
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
      <Comments />
    </Card>
  );
};

export default Blog;
