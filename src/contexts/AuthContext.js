import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import api from '../api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        jwtDecode(storedToken);
        return storedToken;
      } catch (err) {
        console.error('Invalid stored token on load:', err);
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const userData = { id: decoded._id, name: decoded.name, role: decoded.role };
        setUser(userData);
      } catch (err) {
        console.error('Failed to decode token:', err);
        logout();
      }
    }
    setLoading(false);
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const token = res.data.token;
      try {
        const decoded = jwtDecode(token);
        const userData = { id: decoded._id, name: decoded.name, role: decoded.role };
        localStorage.setItem('token', token);
        setToken(token);
        setUser(userData);
        return userData.role;
      } catch (decodeErr) {
        
        console.error('Failed to decode new token:', decodeErr);
        throw new Error('Invalid token received from server');
      }
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    // delete axios.defaults.headers.common['x-auth-token'];
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => React.useContext(AuthContext);
