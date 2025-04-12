import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner'; // Import the spinner

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isLoggedIn, loading, currentUser } = useAuth();

  if (loading) {
    // Display the LoadingSpinner while authentication state is loading
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <LoadingSpinner message="Authenticating..." />
      </div>
    );
  }

  if (!isLoggedIn) {
    // Redirect to login if the user is not logged in
    return <Navigate to="/auth" replace />;
  }

  // Check roles if allowedRoles is provided
  if (allowedRoles && !allowedRoles.includes(currentUser?.role)) {
    // User is logged in but doesn't have the required role
    console.warn(
      `Access denied: User role (${currentUser?.role}) not in allowed roles: ${allowedRoles.join(
        ', '
      )}`
    );
    // Redirect to dashboard (or an unauthorized page)
    return <Navigate to="/dashboard" replace />;
  }

  // Render the child component if logged in and role is allowed (or no specific roles required)
  return children;
};

export default ProtectedRoute;
