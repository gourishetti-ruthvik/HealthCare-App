// src/components/BookingForm.jsx (Adapt this example)

import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import { createAppointment } from '../services/appointmentService';
import { getDoctorAvailability } from '../services/availabilityService';
import { getCurrentUser } from '../services/authService';

const customModalStyles = {
  content: {
    padding: '25px',
    borderRadius: '8px',
    textAlign: 'center',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
};

function BookingForm() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const showPopup = useCallback((title, message) => {
    setModalContent({ title, message });
    setIsModalOpen(true);
  }, []);

  const closePopup = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  useEffect(() => {
    const user = getCurrentUser();
    setCurrentUser(user);
    Modal.setAppElement('#root');
  }, []);

  useEffect(() => {
    const fetchAvailability = async () => {
      if (selectedDoctor && selectedDate) {
        setIsLoading(true);
        try {
          const slots = await getDoctorAvailability(selectedDoctor, selectedDate);
          setAvailableSlots(slots);
          setSelectedSlot('');
        } catch (error) {
          console.error('Error fetching availability:', error);
          showPopup('Error', 'Could not fetch available slots.');
          setAvailableSlots([]);
        } finally {
          setIsLoading(false);
        }
      } else {
        setAvailableSlots([]);
      }
    };
    fetchAvailability();
  }, [selectedDoctor, selectedDate, showPopup]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!currentUser) {
      showPopup('Error', 'You must be logged in to book.');
      return;
    }
    if (!selectedDoctor || !selectedDate || !selectedSlot || !reason) {
      showPopup('Warning', 'Please fill in all fields.');
      return;
    }

    const dateTimeString = `${selectedDate}T${selectedSlot}:00.000Z`;

    const appointmentData = {
      patientId: currentUser.id,
      doctorId: selectedDoctor,
      dateTime: dateTimeString,
      reason: reason,
    };

    setIsLoading(true);
    try {
      const newAppointment = await createAppointment(appointmentData);
      showPopup(
        'Success',
        `Appointment booked successfully for ${new Date(newAppointment.dateTime).toLocaleString()}.`
      );
      setSelectedDoctor('');
      setSelectedDate('');
      setSelectedSlot('');
      setReason('');
      setAvailableSlots([]);
    } catch (error) {
      console.error('Booking error:', error);
      showPopup('Error', `Failed to book appointment: ${error.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 font-sans max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book an Appointment</h1>
      {!currentUser && <p className="text-red-500">Please log in to book an appointment.</p>}
      {currentUser && (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Doctor:</label>
            <select
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Doctor</option>
              <option value="user2">Dr. Alice Smith (Cardiology)</option>
              <option value="user3">Dr. Bob Johnson (Dermatology)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date:</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Slot:</label>
            <select
              value={selectedSlot}
              onChange={(e) => setSelectedSlot(e.target.value)}
              required
              disabled={isLoading || availableSlots.length === 0}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
            >
              <option value="">
                {isLoading ? 'Loading...' : availableSlots.length > 0 ? 'Select Time' : 'No slots available'}
              </option>
              {availableSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Visit:</label>
            <textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={isLoading || !selectedSlot}
            className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Booking...' : 'Book Appointment'}
          </button>
        </form>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closePopup}
        style={customModalStyles}
        contentLabel="Booking Status Popup"
        closeTimeoutMS={300}
      >
        <h2 className="text-xl font-bold mb-4">{modalContent.title}</h2>
        <p>{modalContent.message}</p>
        <button
          onClick={closePopup}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500"
        >
          Close
        </button>
      </Modal>
    </div>
  );
}

export default BookingForm;
