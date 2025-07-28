import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const SecurityHome = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading user information...</p>; // Fallback, though ProtectedRoute should handle
  }

  return (
   <div className="security-home-container">
      <div className="security-home-card">
        <h2>Security Landing Page</h2>
        <p>You are logged in as security.</p>
        <p className="security-home-instructions">Open a QR code link to view visit details (e.g., /visit/:id).</p>
      </div>
    </div>
  );
};

export default SecurityHome;