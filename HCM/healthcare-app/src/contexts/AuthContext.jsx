// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (username, password, role) => {
    try {
      const user = await authService.login(username, password, role);
      setCurrentUser(user);
      return user;
    } catch (error) {
      console.error('Login failed:', error);
      setCurrentUser(null);
      throw error;
    }
  }, []);

  const register = useCallback(async (username, password, name, role) => {
    try {
      const user = await authService.register(username, password, name, role);
      return user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setCurrentUser(null);
  }, []);

  const isPatient = currentUser?.role === 'patient';
  const isDoctor = currentUser?.role === 'doctor';

  const value = {
    currentUser,
    isLoggedIn: !!currentUser,
    loading,
    login,
    register,
    logout,
    isPatient,
    isDoctor,
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
