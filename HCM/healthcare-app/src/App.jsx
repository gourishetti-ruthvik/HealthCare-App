// src/App.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import Modal from 'react-modal';

// Layout
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';

// Route Components
import ProtectedRoute from './components/Common/ProtectedRoute';
import PublicRoute from './components/Common/PublicRoute';

// Pages
import AuthPage from './pages/AuthPage';
import DashboardPage from './pages/DashboardPage';
import AppointmentsPage from './pages/AppointmentsPage';
import FindDoctorPage from './pages/FindDoctorPage';
import ProfilePage from './pages/ProfilePage';
import DoctorSchedulePage from './pages/DoctorSchedulePage';
import BookingPage from './pages/BookingPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route
            path="/auth"
            element={
              <PublicRoute>
                <AuthPage />
              </PublicRoute>
            }
          />

          {/* --- Protected Routes (Common) --- */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          {/* --- Protected Routes (Patient + Doctor) --- */}
          <Route
            path="/appointments"
            element={
              <ProtectedRoute allowedRoles={['patient', 'doctor']}>
                <AppointmentsPage />
              </ProtectedRoute>
            }
          />

          {/* --- Protected Routes (Patient Only) --- */}
          <Route
            path="/find-doctor"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <FindDoctorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/book-appointment/:doctorId"
            element={
              <ProtectedRoute allowedRoles={['patient']}>
                <BookingPage />
              </ProtectedRoute>
            }
          />

          {/* --- Protected Routes (Doctor Only) --- */}
          <Route
            path="/doctor-schedule"
            element={
              <ProtectedRoute allowedRoles={['doctor']}>
                <DoctorSchedulePage />
              </ProtectedRoute>
            }
          />

          {/* --- Catch All / Not Found --- */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default App;
