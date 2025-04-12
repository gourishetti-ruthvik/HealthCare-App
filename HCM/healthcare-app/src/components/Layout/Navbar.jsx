// src/components/Layout/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth'; // Use the enhanced context
import Button from '../Common/Button';

const Navbar = () => {
  const { isLoggedIn, currentUser, logout, isPatient, isDoctor } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  return (
    <nav className="relative bg-gradient-to-r from-blue-800 via-blue-600 to-blue-500 text-white shadow-lg top-0 left-0 w-full z-50">
      {/* Background Transition Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900 via-blue-700 to-blue-600 transform scale-x-0 origin-left transition-transform duration-500 ease-in-out hover:scale-x-100"></div>

      <div className="container mx-auto px-4 py-3 flex justify-between items-center relative z-10">
        {/* Logo */}
        <Link
          to={isLoggedIn ? "/dashboard" : "/"}
          className="text-2xl font-bold text-white hover:text-yellow-300 transition-transform duration-300 transform hover:scale-110"
        >
          WellConnect
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-6">
          {isLoggedIn ? (
            <>
              {/* Welcome Message */}
              <span className="text-sm hidden sm:inline text-yellow-200">
                Welcome, {currentUser?.name || currentUser?.username}! ({currentUser?.role})
              </span>

              {/* Common Links */}
              <Link
                to="/dashboard"
                className="relative group text-white"
              >
                Dashboard
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/appointments"
                className="relative group text-white"
              >
                Appointments
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                to="/profile"
                className="relative group text-white"
              >
                Profile
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>

              {/* Patient-Specific Links */}
              {isPatient && (
                <Link
                  to="/find-doctor"
                  className="relative group text-white"
                >
                  Find Doctor
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}

              {/* Doctor-Specific Links */}
              {isDoctor && (
                <Link
                  to="/doctor-schedule"
                  className="relative group text-white"
                >
                  Manage Schedule
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
                </Link>
              )}

              {/* Logout Button */}
              <Button
                onClick={handleLogout}
                variant="secondary"
                size="sm"
                className="bg-yellow-500 text-blue-800 hover:bg-yellow-400 transition-transform duration-300 transform hover:scale-110"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              {/* Login/Register Link */}
              <Link
                to="/auth"
                className="relative group text-white"
              >
                Login / Register
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-yellow-300 transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
