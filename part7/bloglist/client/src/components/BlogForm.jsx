import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import { useBlogMutations } from '../hooks/useBlogs';
import { useNotification } from '../contexts/NotificationContext';
import { useNavigate } from 'react-router-dom';

const BlogForm = () => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');
  const { notify, notifyError } = useNotification();
  const { createBlog } = useBlogMutations();
  const navigate = useNavigate();

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    try {
      const createdBlog = await createBlog({ title, author, url });
      const label = createdBlog.author
        ? `${createdBlog.title} by ${createdBlog.author}`
        : createdBlog.title;
      notify(`a new blog ${label} added`, 'success');
      setTitle('');
      setAuthor('');
      setUrl('');
      navigate('/');
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <>
      <h2>create new</h2>
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
        <TextField
          label="title"
          type="text"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
        />
        <TextField
          label="author"
          type="text"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
        />
        <TextField
          label="url"
          type="text"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
        />
        <Button type="submit" variant="contained">
          create
        </Button>
      </Box>
    </>
  );
};

export default BlogForm;
