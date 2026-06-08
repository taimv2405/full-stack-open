import { Link as RouterLink } from 'react-router-dom';
import { useBlogs } from '../hooks/useBlogs';
import { Typography, List, ListItem, ListItemText, Link } from '@mui/material';

const Blogs = () => {
  const { blogs, isPending, isError } = useBlogs();
  if (isPending) {
    return <Typography>Loading blogs...</Typography>;
  }
  if (isError) {
    return <Typography>Could not load blogs</Typography>;
  }
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <>
      <Typography component="h1" variant="h5" sx={{ mt: 1 }}>
        Blogs
      </Typography>
      <List>
        {sortedBlogs.map((blog) => (
          <ListItem key={blog.id} disablePadding>
            <ListItemText
              primary={
                <Link component={RouterLink} to={`/blogs/${blog.id}`}>
                  {blog.title}
                  {blog.author && ` by ${blog.author}`}
                </Link>
              }
            />
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default Blogs;
