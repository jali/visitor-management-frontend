import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect if already logged in
      if (user.role === 'admin') navigate('/admin');
      else if (user.role === 'resident') navigate('/dashboard');
      else if (user.role === 'security') navigate('/'); // or security dashboard
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const role = await login(email, password);
      if (role === 'admin') navigate('/admin');
      else if (role === 'resident') navigate('/dashboard');
      else if (role === 'security') navigate('/');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default Login;
