import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from './LoadingSpinner'; // Import the spinner

const PublicRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();

    if (loading) {
        // Use the LoadingSpinner component with centered styling
        return (
            <div className="flex justify-center items-center h-screen bg-gray-50">
                <LoadingSpinner message="Loading..." />
            </div>
        );
    }

    // If user is logged in, redirect them away from public-only pages (like login/register)
    if (isLoggedIn) {
        return <Navigate to="/dashboard" replace />;
    }

    // Render the child component if user is not logged in
    return children;
};

export default PublicRoute;
