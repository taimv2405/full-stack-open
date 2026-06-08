import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  Link,
} from '@mui/material';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';

const User = () => {
  const { users, isPending, isError } = useUsers();
  const { id } = useParams();

  if (isPending) {
    return <Typography>Loading users...</Typography>;
  }

  if (isError) {
    return <Typography>Could not load users</Typography>;
  }

  const user = users.find((user) => user.id === id);

  if (!user) {
    return <Typography>404 - User not found</Typography>;
  }

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 1,
        padding: 2,
        marginTop: 2,
      }}
    >
      <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
        {user.name}
      </Typography>
      <Typography>added blogs</Typography>
      <List>
        {user.blogs.map((blog) => (
          <ListItem key={blog.id} disablePadding>
            <ListItemText
              primary={
                <Link component={RouterLink} to={`/blogs/${blog.id}`}>
                  {blog.title}
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
    </Card>
  );
};

export default User;
