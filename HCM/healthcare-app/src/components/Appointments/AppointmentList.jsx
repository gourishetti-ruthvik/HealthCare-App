// src/components/Appointments/AppointmentList.jsx
import React from 'react';
import AppointmentCard from './AppointmentCard'; // Assuming AppointmentCard is already styled

const AppointmentList = ({ appointments, onAppointmentUpdate }) => {
  // Handle the case where there are no appointments
  if (!appointments || appointments.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 bg-gray-50 rounded-lg border border-dashed border-gray-300 mt-6">
        <p className="text-gray-500 text-center text-lg">
          You have no appointments scheduled.
        </p>
      </div>
    );
  }

  // Sort appointments by date (oldest first)
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(a.dateTime) - new Date(b.dateTime)
  );

  return (
    <div className="space-y-6 mt-6">
      {sortedAppointments.map((appointment) => (
        <AppointmentCard
          key={appointment.id}
          appointment={appointment}
          onAppointmentUpdate={onAppointmentUpdate}
        />
      ))}
    </div>
  );
};

export default AppointmentList;
