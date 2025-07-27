import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import ResidentDashboard from './components/ResidentDashboard';
import VisitDetails from './components/VisitDetails';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './components/Home';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>; // Prevent render until auth is ready
  }

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['resident']}>
              <ResidentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visit/:id"
          element={
            <ProtectedRoute allowedRoles={['security', 'admin']}> 
              <VisitDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={user ? (user.role === 'admin' ? <Navigate to="/admin" /> : user.role === 'resident' ? <Navigate to="/dashboard" /> : <div><h2>Welcome, Security User</h2><p>You can access visit details by opening QR links (e.g., /visit/:id).</p></div>) : <Navigate to="/login" />} />
        
      </Routes>
    </Router>
  );
}

export default App;
