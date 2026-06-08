import { Alert } from '@mui/material';
import { useNotification } from '../stores/notificationStore';

const Notification = () => {
  const notification = useNotification();

  if (!notification) return null;

  const { message, type } = notification;
  return <Alert severity={type}>{message}</Alert>;
};

export default Notification;
