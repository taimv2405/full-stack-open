import { useState } from 'react';

const Blog = ({ blog }) => {
  const [detail, setDetail] = useState(false);

  const blogStyle = {
    border: '1px solid black',
    padding: '8px 16px',
    marginBottom: 5,
  };

  const toggleShowDetail = () => {
    setDetail(!detail);
  };
  return (
    <div style={blogStyle}>
      <div>
        {blog.title} {blog.author}
        <button onClick={toggleShowDetail}>{detail ? 'hide' : 'view'}</button>
      </div>
      {detail && (
        <div>
          <div>{blog.url}</div>
          <div>
            likes {blog.likes} <button>like</button>
          </div>
          <div>{blog.user?.name}</div>
        </div>
      )}
    </div>
  );
};

export default Blog;
