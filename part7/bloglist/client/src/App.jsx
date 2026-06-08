import { Routes, Route, Link } from 'react-router-dom';
import { ErrorBoundary, getErrorMessage } from 'react-error-boundary';
import Notification from './components/Notification';
import BlogForm from './components/BlogForm';
import Login from './components/Login';
import Blogs from './components/Blogs';
import Blog from './components/Blog';
import Logout from './components/Logout';
import {
  Container,
  AppBar,
  Toolbar,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import { useUser } from './stores/userStore';
import Users from './components/Users';
import User from './components/User';

const App = () => {
  const user = useUser();

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
          <Button component={Link} to="/users" sx={navBtn}>
            users
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
              <Logout buttonStyle={navBtn} />
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
        <Notification />

        <Routes>
          <Route path="/" element={<Blogs />} />
          <Route path="/blogs/:id" element={<Blog />} />
          <Route path="/blogs/create" element={<BlogForm />} />
          <Route path="/login" element={<Login />} />
          <Route path="/users" element={<Users />} />
          <Route path="/users/:id" element={<User />} />
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
