import { TextField, Button, Box } from '@mui/material';
import loginService from '../services/login';
import { useUserActions } from '../stores/userStore';
import { useNotificationActions } from '../stores/notificationStore';
import { useNavigate } from 'react-router-dom';
import { useField } from '../hooks/useField';
import { Typography } from '@mui/material';

const Login = () => {
  const username = useField('text');
  const password = useField('password');
  const { login } = useUserActions();
  const { notify, notifyError } = useNotificationActions();
  const navigate = useNavigate();

  const resetFields = () => {
    username.reset();
    password.reset();
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const loggedUser = await loginService.login({
        username: username.inputProps.value,
        password: password.inputProps.value,
      });
      login(loggedUser);
      resetFields();
      notify('Logged in successfully', 'success');
      navigate('/');
    } catch (error) {
      notifyError(error);
    }
  };

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ mt: 1, mb: 1 }}>
        Login
      </Typography>

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
        <TextField label="username" {...username.inputProps} />
        <TextField label="password" {...password.inputProps} />
        <Button type="submit" variant="contained">
          login
        </Button>
      </Box>
    </>
  );
};

export default Login;
