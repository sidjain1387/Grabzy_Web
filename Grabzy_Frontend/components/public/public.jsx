import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  const token = localStorage.getItem('token');

  // If token exists, redirect to dashboard (or some page)
  if (token) {
    return <Navigate to="/customer-dashboard" replace />;
  }

  // Otherwise, allow access to public routes
  return <Outlet />;
};

export default PublicRoute;
