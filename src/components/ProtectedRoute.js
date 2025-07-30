import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import api from '../api';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    const validate = async () => {
      const token = localStorage.getItem('token');
      if (!token || !user) {
        setValidated(false); // Reset validated if checks fail
        navigate('/login', { state: { from: location.pathname } });
        return;
      }
      try {
        await api.get('/visit'); // Validates token; 401 triggers interceptor redirect
        setValidated(true);
      } catch (err) {
        console.error('Validation error:', err);
        setValidated(false); // Reset on error, though interceptor should handle
        // No need to navigate here if interceptor does it
      }
    };
    validate();
  }, [navigate, location.pathname, user]);

  if (loading || !validated) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
