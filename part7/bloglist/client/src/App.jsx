import { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom';
import { ErrorBoundary, getErrorMessage } from 'react-error-boundary';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Login from './components/Login';
import Blogs from './components/Blogs';
import Blog from './components/Blog';
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Alert,
} from '@mui/material';

const App = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      blogService.setToken(user.token);
      setUser(user);
    }
  }, []);

  const notify = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogin = async (username, password) => {
    try {
      const user = await loginService.login({ username, password });
      window.localStorage.setItem('loggedBloglistUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      notify('Logged in successfully', 'success');
      navigate('/');
      return true;
    } catch (error) {
      console.error(error.response?.data?.error);
      notify(error.response?.data?.error ?? 'Something went wrong', 'error');
      return false;
    }
  };

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser');
    setUser(null);
    blogService.setToken(null);
    notify('Logged out', 'success');
    navigate('/');
  };

  const handleCreateBlog = async (blogInfo) => {
    try {
      const createdBlog = await blogService.create(blogInfo);
      setBlogs([...blogs, createdBlog]);

      const label = createdBlog.author
        ? `${createdBlog.title} by ${createdBlog.author}`
        : createdBlog.title;
      notify(`a new blog ${label} added`, 'success');
      navigate('/');
      return true;
    } catch (error) {
      console.error(error.response?.data?.error);
      notify(error.response?.data?.error ?? 'Something went wrong', 'error');
      return false;
    }
  };

  const handleLike = async (id, blogInfo) => {
    try {
      const updatedBlog = await blogService.update(id, blogInfo);
      setBlogs(blogs.map((blog) => (blog.id === id ? updatedBlog : blog)));
    } catch (error) {
      console.error(error.response?.data?.error);
      notify(error.response?.data?.error ?? 'Something went wrong', 'error');
    }
  };

  const handleRemove = async (id) => {
    try {
      await blogService.remove(id);
      setBlogs(blogs.filter((blog) => blog.id !== id));
      navigate('/');
      return true;
    } catch (error) {
      console.error(error.response?.data?.error);
      notify(error.response?.data?.error ?? 'Something went wrong', 'error');
      return false;
    }
  };

  const match = useMatch('/blogs/:id');
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const navBtn = {
    '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.3)' },
    color: 'white',
  };

  return (
    <Container>
      <AppBar position="static">
        <Toolbar>
          <Typography component="span" sx={{ flex: 1 }}>
            Blog App
          </Typography>
          <Button component={Link} to="/" sx={navBtn}>
            blogs
          </Button>
          {!user && (
            <Button component={Link} to="/login" sx={navBtn}>
              login
            </Button>
          )}
          {user && (
            <>
              <Button component={Link} to="/blogs/create" sx={navBtn}>
                new blog
              </Button>
              <Button onClick={handleLogout} sx={navBtn}>
                logout
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div role="alert">
            <Alert severity="error">
              Something went wrong:
              <pre>{getErrorMessage(error)}</pre>
            </Alert>
            <Button
              variant="contained"
              onClick={resetErrorBoundary}
              sx={{ mt: 1 }}
            >
              Try again
            </Button>
          </div>
        )}
      >
        <Notification notification={notification} />

        <Routes>
          <Route path="/" element={<Blogs blogs={blogs} />} />
          <Route
            path="/blogs/:id"
            element={
              <Blog
                blog={blog}
                onLike={handleLike}
                user={user}
                onRemove={handleRemove}
              />
            }
          />
          <Route
            path="/blogs/create"
            element={<BlogForm onCreate={handleCreateBlog} />}
          />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route
            path="*"
            element={
              <Typography variant="h5" component="h1" sx={{ mt: 1 }}>
                404 - Page not found
              </Typography>
            }
          />
        </Routes>
      </ErrorBoundary>
    </Container>
  );
};

export default App;
