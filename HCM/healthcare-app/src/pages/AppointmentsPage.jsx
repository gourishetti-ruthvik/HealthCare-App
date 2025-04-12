// src/pages/AppointmentsPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAppointmentsForUser } from '../services/appointmentService';
import AppointmentList from '../components/Appointments/AppointmentList';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const AppointmentsPage = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch appointments for the current user
  const fetchAppointments = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError('');
    try {
      const userAppointments = await getAppointmentsForUser(currentUser.id, currentUser.role);
      setAppointments(userAppointments);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  // Handler to refresh the list when an appointment is updated
  const handleAppointmentUpdate = () => {
    fetchAppointments();
  };

  return (
    <div className="p-6 font-sans max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">
        {currentUser?.role === 'doctor' ? 'Your Scheduled Appointments' : 'My Appointments'}
      </h1>

      {loading && (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        <AppointmentList
          appointments={appointments}
          onAppointmentUpdate={handleAppointmentUpdate}
        />
      )}
    </div>
  );
};

export default AppointmentsPage;
