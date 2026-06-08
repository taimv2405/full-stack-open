import { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import loginService from '../services/login';
import { useUserActions } from '../stores/userStore';
import { useNotificationActions } from '../stores/notificationStore';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useUserActions();
  const { notify, notifyError } = useNotificationActions();
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({ username, password });
      login(loggedUser);
      setUsername('');
      setPassword('');
      notify('Logged in successfully', 'success');
      navigate('/');
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <>
      <h1>login to the application</h1>

      <Box
        component="form"
        onSubmit={handleLogin}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          alignItems: 'flex-start',
        }}
      >
        <TextField
          label="username"
          type="text"
          value={username}
          onChange={({ target }) => setUsername(target.value)}
        />
        <TextField
          label="password"
          type="password"
          value={password}
          onChange={({ target }) => setPassword(target.value)}
        />
        <Button type="submit" variant="contained">
          login
        </Button>
      </Box>
    </>
  );
};

export default Login;
