const Notification = ({ notification }) => {
  if (!notification) return null;

  const { text, type } = notification;

  return <div className={`notification ${type}`}>{text}</div>;
};

export default Notification;
