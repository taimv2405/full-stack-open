import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const BlogForm = ({ onCreate }) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const handleCreateBlog = async (event) => {
    event.preventDefault();
    const success = await onCreate({ title, author, url });
    if (success) {
      setTitle('');
      setAuthor('');
      setUrl('');
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
