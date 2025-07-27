import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <p>Loading...</p>; // Show loader while auth is initializing
  }

  if (!user) {
    return <Navigate to="/login" replace/>;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace/>;
  }

  return children;
};

export default ProtectedRoute;
