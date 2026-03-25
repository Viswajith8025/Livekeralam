import React from 'react';
import { Navigate } from 'react-router-dom';

// This is a simple protected route. 
// In a real app, you'd decode the JWT to check for 'admin' role.
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
