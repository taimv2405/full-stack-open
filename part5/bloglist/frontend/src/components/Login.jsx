import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    const success = await onLogin(username, password);
    if (success) {
      setUsername('');
      setPassword('');
      navigate('/');
    }
  };

  return (
    <>
      <h1>login to the application</h1>

      <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
    </>
  );
};

export default Login;
