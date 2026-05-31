import { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import { Routes, Route, Link, useNavigate, useMatch } from 'react-router-dom';
import blogService from './services/blogs';
import loginService from './services/login';
import Notification from './components/Notification';
import Togglable from './components/Togglable';
import BlogForm from './components/BlogForm';
import Login from './components/Login';
import Blogs from './components/Blogs';

const App = () => {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);
  const [notification, setNotification] = useState(null);
  const blogFormRef = useRef();

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

  const _handleCreateBlog = async (blogInfo) => {
    try {
      const createdBlog = await blogService.create(blogInfo);
      setBlogs([...blogs, createdBlog]);

      const label = createdBlog.author
        ? `${createdBlog.title} by ${createdBlog.author}`
        : createdBlog.title;
      notify(`a new blog ${label} added`, 'success');

      blogFormRef.current.toggleVisibility();
    } catch (error) {
      console.error(error.response?.data?.error);
      notify(error.response?.data?.error ?? 'Something went wrong', 'error');
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
      return true;
    } catch (error) {
      console.error(error.response?.data?.error);
      notify(error.response?.data?.error ?? 'Something went wrong', 'error');
      return false;
    }
  };

  const match = useMatch('/blogs/:id');
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const padding = {
    padding: 5,
  };

  return (
    <>
      <div>
        <Link style={padding} to="/">
          blogs
        </Link>
        {!user && (
          <Link style={padding} to="/login">
            login
          </Link>
        )}
        {user && <button onClick={handleLogout}>log out</button>}
        {user && <p>{user.name} logged in</p>}
      </div>

      <Notification notification={notification} />

      {/* <div>
        <Togglable buttonLabel="create new blog" ref={blogFormRef}>
          <BlogForm onCreate={handleCreateBlog} />
        </Togglable>
      </div> */}

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
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
      </Routes>
    </>
  );
};

export default App;
