import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav style={{
      backgroundColor: '#007bff',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      color: 'white'
    }}>
      <h1 style={{ margin: 0 }}>هلاوين</h1>
      <div>
        {user ? (
          <>
            <span style={{ marginRight: '10px' }}>Welcome, {user.name}</span>
            <button onClick={logout} style={{
              backgroundColor: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}>Logout</button>
          </>
        ) : (
          <button onClick={() => navigate('/login')} style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '5px 10px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>Login</button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
