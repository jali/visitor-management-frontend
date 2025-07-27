import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const SecurityHome = () => {
  const { user } = useAuth();

  if (!user) {
    return <p>Loading user information...</p>; // Fallback, though ProtectedRoute should handle
  }

  return (
    <div>
      <h2>Welcome, {user.name}!</h2>
      <p>Your User ID: {user.id}</p>
      <p>Your Role: {user.role.charAt(0).toUpperCase() + user.role.slice(1)}</p>
      <p>Depending on your role, navigate to your dashboard or other pages.</p>
      {/* Add more user-specific info or links if needed, e.g., based on role */}
      {user.role === 'security' && (
        <p>As security, scan a QR code to view visit details at /visit/:id.</p>
      )}
      {user.role === 'resident' && (
        <a href="/dashboard">Go to Resident Dashboard</a>
      )}
      {user.role === 'admin' && (
        <a href="/admin">Go to Admin Panel</a>
      )}
    </div>
  );
};

export default SecurityHome;