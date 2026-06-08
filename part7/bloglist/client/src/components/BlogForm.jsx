import { TextField, Button, Box } from '@mui/material';
import { useBlogMutations } from '../hooks/useBlogs';
import { useNotificationActions } from '../stores/notificationStore';
import { useNavigate } from 'react-router-dom';
import { useField } from '../hooks/useField';
import { Typography } from '@mui/material';

const BlogForm = () => {
  const { notify, notifyError } = useNotificationActions();
  const { createBlog } = useBlogMutations();
  const navigate = useNavigate();
  const title = useField('text');
  const author = useField('text');
  const url = useField('text');

  const resetFields = () => {
    title.reset();
    author.reset();
    url.reset();
  };

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    try {
      const createdBlog = await createBlog({
        title: title.inputProps.value,
        author: author.inputProps.value,
        url: url.inputProps.value,
      });
      const label = createdBlog.author
        ? `${createdBlog.title} by ${createdBlog.author}`
        : createdBlog.title;
      notify(`a new blog ${label} added`, 'success');
      resetFields();
      navigate('/');
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ mt: 1, mb: 1 }}>
        New Blog
      </Typography>
      <Box
        component="form"
        onSubmit={handleCreateBlog}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'flex-start',
        }}
      >
        <TextField label="title" {...title.inputProps} />
        <TextField label="author" {...author.inputProps} />
        <TextField label="url" {...url.inputProps} />
        <Button type="submit" variant="contained">
          create
        </Button>
      </Box>
    </>
  );
};

export default BlogForm;
