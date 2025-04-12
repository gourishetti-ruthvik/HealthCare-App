// src/pages/BookingPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDoctorById } from '../services/doctorService';
import { getDoctorAvailability } from '../services/availabilityService';
import { createAppointment } from '../services/appointmentService';
import Button from '../components/Common/Button';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const BookingPage = () => {
  const { doctorId } = useParams();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [doctor, setDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [reason, setReason] = useState('');
  const [loadingDoctor, setLoadingDoctor] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState('');
  const [bookingError, setBookingError] = useState('');
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchDoctor = async () => {
      setLoadingDoctor(true);
      setError('');
      try {
        const fetchedDoctor = await getDoctorById(doctorId);
        setDoctor(fetchedDoctor);
      } catch (err) {
        console.error("Failed to fetch doctor details:", err);
        setError('Failed to load doctor details. Please try again.');
      } finally {
        setLoadingDoctor(false);
      }
    };

    if (doctorId) {
      fetchDoctor();
    } else {
      setError("No doctor specified.");
      setLoadingDoctor(false);
    }
  }, [doctorId]);

  const fetchAvailability = useCallback(async (date) => {
    if (!doctor || !date) return;

    setLoadingSlots(true);
    setAvailableSlots([]);
    setSelectedSlot('');
    setBookingError('');

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}-${month}-${day}`;

    try {
      const slots = await getDoctorAvailability(doctor.id, formattedDate);
      setAvailableSlots(slots);
      if (slots.length === 0) {
        setBookingError('No available slots for the selected date.');
      }
    } catch (err) {
      console.error("Failed to fetch availability:", err);
      setBookingError('Could not load available slots. Please try another date.');
    } finally {
      setLoadingSlots(false);
    }
  }, [doctor]);

  useEffect(() => {
    if (doctor) {
      fetchAvailability(selectedDate);
    }
  }, [selectedDate, doctor, fetchAvailability]);

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setBookingError('');
    setIsBooking(true);

    if (!currentUser || !doctor) {
      setBookingError("User or Doctor information is missing.");
      setIsBooking(false);
      return;
    }
    if (!selectedSlot) {
      setBookingError("Please select an available time slot.");
      setIsBooking(false);
      return;
    }

    const [hours, minutes] = selectedSlot.split(':');
    const appointmentDateTime = new Date(selectedDate);
    appointmentDateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);

    const appointmentData = {
      patientId: currentUser.id,
      patientName: currentUser.name,
      doctorId: doctor.id,
      doctorName: doctor.name,
      dateTime: appointmentDateTime.toISOString(),
      reason: reason,
      status: 'Scheduled',
    };

    try {
      await createAppointment(appointmentData);
      alert(`Appointment with Dr. ${doctor.name} booked successfully for ${appointmentDateTime.toLocaleString()}!`);
      navigate('/appointments');
    } catch (err) {
      console.error("Failed to book appointment:", err);
      if (err.response?.status === 409) {
        setBookingError("Sorry, this time slot was just booked. Please select another.");
        fetchAvailability(selectedDate);
      } else {
        setBookingError(err.message || "Could not book appointment. Please try again.");
      }
    } finally {
      setIsBooking(false);
    }
  };

  if (loadingDoctor) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!doctor) return <p className="text-gray-600 text-center">Doctor details not available.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-semibold text-gray-800 mb-2">
        Book Appointment with Dr. {doctor.name}
      </h1>
      <p className="text-gray-600 mb-6">{doctor.specialty || 'General Practice'}</p>

      <form onSubmit={handleBookingSubmit} className="max-w-lg mx-auto bg-white p-6 rounded shadow-md">
        {bookingError && <p className="text-red-500 text-sm mb-4 text-center">{bookingError}</p>}

        <div className="mb-4">
          <label htmlFor="appointment-date" className="block text-sm font-medium text-gray-700 mb-1">
            Select Date
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            minDate={new Date()}
            dateFormat="MMMM d, yyyy"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            id="appointment-date"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Available Time Slot
          </label>
          {loadingSlots ? (
            <LoadingSpinner size="sm" />
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 mt-2">
              {availableSlots.length > 0 ? (
                availableSlots.map((slot) => (
                  <Button
                    key={slot}
                    type="button"
                    onClick={() => setSelectedSlot(slot)}
                    variant={selectedSlot === slot ? 'solid' : 'outline'}
                    className="text-sm py-1 px-2"
                  >
                    {slot}
                  </Button>
                ))
              ) : (
                !bookingError && <p className="text-sm text-gray-500 col-span-full">No slots available for this date.</p>
              )}
            </div>
          )}
        </div>

        <div className="mt-4">
          <label htmlFor="appointment-reason" className="block text-sm font-medium text-gray-700 mb-1">
            Reason for Appointment (Optional)
          </label>
          <textarea
            id="appointment-reason"
            rows="3"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g., Annual checkup, consultation..."
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          ></textarea>
        </div>

        <div className="mt-6">
          <Button
            type="submit"
            disabled={isBooking || loadingSlots || !selectedSlot}
            className="w-full"
          >
            {isBooking ? 'Booking...' : 'Confirm Booking'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default BookingPage;
