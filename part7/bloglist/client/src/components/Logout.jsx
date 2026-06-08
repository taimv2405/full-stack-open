import { useNavigate } from 'react-router-dom';
import { useUserActions } from '../stores/userStore';
import { useNotificationActions } from '../stores/notificationStore';
import { Button } from '@mui/material';

const Logout = ({ buttonStyle }) => {
  const { logout } = useUserActions();
  const { notify } = useNotificationActions();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    notify('Logged out', 'success');
    navigate('/');
  };

  return (
    <Button onClick={handleLogout} sx={buttonStyle}>
      logout
    </Button>
  );
};

export default Logout;
