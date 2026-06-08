import { Link as RouterLink } from 'react-router-dom';
import { useUsers } from '../hooks/useUsers';
import {
  Typography,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';

const Users = () => {
  const { users, isPending, isError } = useUsers();
  if (isPending) {
    return <Typography>Loading users...</Typography>;
  }
  if (isError) {
    return <Typography>Could not load users</Typography>;
  }
  const sortedUsers = [...users].sort(
    (a, b) => b.blogs.length - a.blogs.length,
  );

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
        Users
      </Typography>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow sx={{ '& th': { fontWeight: 'bold' } }}>
              <TableCell>Name</TableCell>
              <TableCell>Username</TableCell>
              <TableCell>Blogs created</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <Link component={RouterLink} to={`/users/${user.id}`}>
                    {user.name}
                  </Link>
                </TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.blogs.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default Users;
