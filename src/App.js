import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import AdminPanel from './components/AdminPanel';
import ResidentDashboard from './components/ResidentDashboard';
import VisitDetails from './components/VisitDetails';
import ProtectedRoute from './components/ProtectedRoute';
import SecurityHome from './components/SecurityHome';
import Navbar from './components/Navbar';
import { useAuth } from './contexts/AuthContext';
import './App.css'; 

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }
  return (
    <Router>
      <Navbar />
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
        <Route
          path="/"
          element={
            user ? (
              user.role === "admin" ? (
                <Navigate to="/admin" />
              ) : user.role === "resident" ? (
                <Navigate to="/dashboard" />
              ) : (
                <SecurityHome />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
