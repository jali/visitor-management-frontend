import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import ResidentDashboard from './components/ResidentDashboard';
import VisitDetails from './components/VisitDetails';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { user } = useAuth();

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
            <ProtectedRoute allowedRoles={['security']}>
              <VisitDetails />
            </ProtectedRoute>
          }
        />
        <Route path="/" element={<Navigate to={user ? (user.role === 'admin' ? '/admin' : user.role === 'resident' ? '/dashboard' : '/visit/someid') : '/login'} />} />
      </Routes>
    </Router>
  );
}

export default App;
