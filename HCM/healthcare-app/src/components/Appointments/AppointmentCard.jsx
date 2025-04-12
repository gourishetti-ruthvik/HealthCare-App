// src/components/Appointments/AppointmentCard.jsx
import React from 'react';
import Button from '../Common/Button'; // Assuming this Button component is styled appropriately
import { useAuth } from '../../hooks/useAuth';
import { cancelAppointment } from '../../services/appointmentService';

const AppointmentCard = ({ appointment, onAppointmentUpdate }) => {
  const { currentUser, isPatient } = useAuth();
  const { id, patientName, doctorName, dateTime, reason, status } = appointment;

  const isPast = new Date(dateTime) < new Date();
  const canCancel = status === 'Scheduled' && !isPast;

  const handleCancel = async () => {
    if (!window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }
    try {
      if (!currentUser) throw new Error("User not logged in.");
      await cancelAppointment(id, currentUser.id);
      alert('Appointment cancelled successfully.');
      if (onAppointmentUpdate) {
        onAppointmentUpdate();
      }
    } catch (error) {
      console.error("Failed to cancel appointment:", error);
      alert(`Error cancelling appointment: ${error.message || 'Please try again.'}`);
    }
  };

  const formattedDate = new Date(dateTime).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const formattedTime = new Date(dateTime).toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  let statusStyles = 'text-gray-700 bg-gray-100';
  if (status === 'Scheduled') statusStyles = 'text-blue-700 bg-blue-100 font-semibold';
  if (status === 'Completed') statusStyles = 'text-green-700 bg-green-100 font-semibold';
  if (status === 'Cancelled') statusStyles = 'text-red-700 bg-red-100 font-semibold line-through';

  const baseCardClasses =
    'bg-white p-5 rounded-xl shadow-md border transition-all duration-200 ease-in-out';
  const conditionalCardClasses =
    status === 'Cancelled'
      ? 'border-red-300 opacity-75 hover:shadow-md'
      : 'border-gray-200 hover:shadow-lg hover:border-gray-300';

  return (
    <div className={`${baseCardClasses} ${conditionalCardClasses}`}>
      {/* Header Section */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold text-gray-800 truncate pr-2">
          {isPatient ? `Dr. ${doctorName}` : patientName}
        </h3>
        <span className={`text-xs px-3 py-1 rounded-full ${statusStyles} whitespace-nowrap`}>
          {status}
        </span>
      </div>

      {/* Details Section */}
      <div className="space-y-2 mb-5">
        <p className="text-sm text-gray-700 flex items-center">
          <span className="font-semibold text-gray-900 w-16 inline-block flex-shrink-0">Date:</span>
          <span>{formattedDate}</span>
        </p>
        <p className="text-sm text-gray-700 flex items-center">
          <span className="font-semibold text-gray-900 w-16 inline-block flex-shrink-0">Time:</span>
          <span>{formattedTime}</span>
        </p>
        <p className="text-sm text-gray-700 flex items-start">
          <span className="font-semibold text-gray-900 w-16 inline-block flex-shrink-0">Reason:</span>
          <span className="break-words">
            {reason || <span className="italic text-gray-500">Not specified</span>}
          </span>
        </p>
      </div>

      {/* Action Buttons */}
      {(canCancel || (status === 'Scheduled' && isPast)) && (
        <div className="flex justify-end items-center space-x-3 pt-4 border-t border-gray-200 mt-auto">
          {status === 'Scheduled' && isPast && (
            <span className="text-xs text-gray-500 italic mr-auto pr-2">
              Appointment time has passed
            </span>
          )}
          {canCancel && (
            <Button variant="danger" size="sm" onClick={handleCancel}>
              Cancel
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default AppointmentCard;
