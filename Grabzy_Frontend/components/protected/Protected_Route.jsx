import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // If no token, redirect to signin page
  if (!token) {
    return <Navigate to="/signin" replace />;
  }

  // Otherwise, render child routes
  return <Outlet />;
};

export default ProtectedRoute;
