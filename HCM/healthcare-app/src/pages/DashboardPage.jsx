// src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getAppointmentsForUser } from '../services/appointmentService';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Button from '../components/Common/Button';

const DashboardPage = () => {
  const { currentUser, isPatient, isDoctor } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!currentUser?.id || !currentUser?.role) {
        return;
      }

      setLoading(true);
      setError('');
      try {
        const fetchedAppointments = await getAppointmentsForUser(currentUser.id, currentUser.role);
        const now = new Date();
        const upcoming = fetchedAppointments
          .filter((app) => app.startTime && new Date(app.startTime) >= now)
          .sort((a, b) => new Date(a.startTime) - new Date(b.startTime));

        setAppointments(upcoming.slice(0, 5));
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError(err.message || 'Failed to load upcoming appointments.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [currentUser?.id, currentUser?.role]);

  const formatDate = (dateString) => {
    try {
      if (!dateString) return 'Date not specified';
      return new Date(dateString).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });
    } catch (e) {
      console.error('Error formatting date:', dateString, e);
      return 'Invalid Date';
    }
  };

  return (
    <div className="space-y-6 p-6 font-sans max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
      <p className="text-lg text-gray-600">
        Welcome back, {currentUser?.name || currentUser?.username}!
      </p>

      {/* Role-Specific Sections */}
      {isPatient && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/find-doctor">
              <Button variant="primary">Find a Doctor</Button>
            </Link>
            <Link to="/appointments">
              <Button variant="secondary">View All Appointments</Button>
            </Link>
          </div>
        </div>
      )}

      {isDoctor && (
        <div className="bg-white p-6 rounded-lg shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Quick Actions</h2>
          <div className="flex flex-wrap gap-4">
            <Link to="/doctor-schedule">
              <Button variant="primary">Manage Schedule</Button>
            </Link>
            <Link to="/appointments">
              <Button variant="secondary">View All Appointments</Button>
            </Link>
          </div>
        </div>
      )}

      {/* Upcoming Appointments Section */}
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <h2 className="text-xl font-semibold text-gray-700">Upcoming Appointments</h2>
        {loading && <LoadingSpinner />}
        {error && <p className="text-red-500">{error}</p>}
        {!loading && !error && appointments.length === 0 && (
          <p className="text-gray-500">You have no upcoming appointments.</p>
        )}
        {!loading && !error && appointments.length > 0 && (
          <ul className="space-y-3">
            {appointments.map((app) => (
              <li
                key={app.id}
                className="border p-3 rounded-md bg-gray-50 flex flex-col sm:flex-row justify-between sm:items-center space-y-2 sm:space-y-0"
              >
                <div>
                  <p className="font-medium">
                    {isPatient
                      ? `Dr. ${app.doctorName || 'N/A'}`
                      : `Patient: ${app.patientName || 'N/A'}`}
                  </p>
                  <p className="text-sm text-gray-600">{formatDate(app.startTime)}</p>
                  <p className="text-sm text-gray-500">{app.reason || 'General Checkup'}</p>
                </div>
              </li>
            ))}
            {appointments.length > 0 && (
              <li className="text-center mt-2">
                <Link to="/appointments" className="text-blue-600 hover:underline text-sm">
                  View all appointments...
                </Link>
              </li>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
