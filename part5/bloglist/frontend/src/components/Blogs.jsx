import Blog from './Blog';

const Blogs = ({ blogs, onLike, onRemove, user }) => {
  const sortedBlogs = [...blogs].sort((a, b) => b.likes - a.likes);

  return (
    <div>
      <h1>blogs</h1>
      {user && <p>{user.name} logged in</p>}
      {sortedBlogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          onLike={onLike}
          user={user}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
};

export default Blogs;
