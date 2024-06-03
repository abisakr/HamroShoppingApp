import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const location = useLocation();
  const auth = localStorage.getItem('token'); // Check if the token exists in storage

  if (!auth) {
    // Redirect them to the /login page, but save the current location they were trying to go to
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children; // If authenticated, render the children
};
export default RequireAuth;
