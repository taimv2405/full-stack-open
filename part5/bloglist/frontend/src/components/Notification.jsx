const Notification = ({ notification }) => {
  if (!notification) return null;

  const { message, type } = notification;
  return <p className={`notification ${type}`}>{message}</p>;
};

export default Notification;
