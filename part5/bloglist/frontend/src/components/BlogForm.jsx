import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BlogForm = ({ onCreate }) => {
  const navigate = useNavigate();
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
      navigate('/');
    }
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreateBlog}>
        <div>
          <label>
            title
            <input
              type="text"
              value={title}
              onChange={({ target }) => setTitle(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={author}
              onChange={({ target }) => setAuthor(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={url}
              onChange={({ target }) => setUrl(target.value)}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>
    </>
  );
};

export default BlogForm;
