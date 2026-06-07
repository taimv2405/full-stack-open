import { Link } from 'react-router-dom';
import { useBlogs } from '../hooks/useBlogs';
import { Typography } from '@mui/material';

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
    <div>
      <h1>blogs</h1>
      <ul>
        {sortedBlogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blogs/${blog.id}`}>
              {blog.title}
              {blog.author && <span> by {blog.author}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Blogs;
