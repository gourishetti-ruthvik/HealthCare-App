// src/pages/DoctorSchedulePage.jsx
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getAppointmentsForUser, createAppointment } from '../services/appointmentService';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import Modal from 'react-modal';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import Button from '../components/Common/Button';

const localizer = momentLocalizer(moment);

const customModalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    minWidth: '300px',
    maxWidth: '500px',
    padding: '20px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
};

const DoctorSchedulePage = () => {
  const { currentUser } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedSlotInfo, setSelectedSlotInfo] = useState(null);
  const [formData, setFormData] = useState({ patientName: '', reason: '', dateTime: null });
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAppointments = useCallback(async () => {
    if (!currentUser || currentUser.role !== 'doctor') {
      setError('You must be logged in as a doctor to view this page.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const fetchedAppointments = await getAppointmentsForUser(currentUser.id, currentUser.role);
      setAppointments(fetchedAppointments || []);
    } catch (err) {
      console.error('Failed to fetch appointments:', err);
      setError('Failed to load appointments. Please try again later.');
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    Modal.setAppElement('#root');
    fetchAppointments();
  }, [fetchAppointments]);

  const calendarEvents = useMemo(() => {
    return appointments
      .filter((appt) => appt && appt.status !== 'Cancelled')
      .map((appointment) => {
        const start = new Date(appointment.dateTime);
        const duration = appointment.duration || 30;
        const end = moment(start).add(duration, 'minutes').toDate();

        return {
          id: appointment.id,
          title: `Appt with ${appointment.patientName || 'N/A'} (${appointment.reason || 'No reason'})`,
          start: start,
          end: end,
          allDay: false,
          resource: appointment,
        };
      });
  }, [appointments]);

  const openViewModal = (event) => {
    setSelectedEvent(event);
    setFormData({
      patientName: event.resource.patientName || '',
      reason: event.resource.reason || '',
      dateTime: event.start,
    });
    setFormError('');
    setIsViewModalOpen(true);
  };

  const openAddModal = (slotInfo) => {
    setSelectedSlotInfo(slotInfo);
    setFormData({
      patientName: '',
      reason: '',
      dateTime: slotInfo.start,
    });
    setFormError('');
    setIsAddModalOpen(true);
  };

  const closeModal = () => {
    setIsViewModalOpen(false);
    setIsAddModalOpen(false);
    setSelectedEvent(null);
    setSelectedSlotInfo(null);
    setFormData({ patientName: '', reason: '', dateTime: null });
    setFormError('');
    setIsSubmitting(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    if (!formData.patientName || !selectedSlotInfo) {
      setFormError('Patient name is required.');
      return;
    }
    setFormError('');
    setIsSubmitting(true);

    const appointmentData = {
      patientId: null,
      patientName: formData.patientName,
      doctorId: currentUser.id,
      doctorName: currentUser.name,
      dateTime: selectedSlotInfo.start.toISOString(),
      reason: formData.reason,
      status: 'Scheduled',
    };

    try {
      await createAppointment(appointmentData);
      alert('Appointment added successfully!');
      closeModal();
      fetchAppointments();
    } catch (err) {
      console.error('Failed to add appointment:', err);
      setFormError(err.message || 'Failed to add appointment. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 font-sans max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">Manage Your Schedule</h1>
      <p className="mb-6 text-gray-600">
        Welcome, Dr. {currentUser?.name || currentUser?.username}. View your booked appointments
        below. Click an appointment to view details, or click/drag an empty slot to add a manual
        appointment.
      </p>

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {!loading && !error && currentUser?.role === 'doctor' && (
        <div className="bg-white p-4 rounded shadow relative" style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'day', 'agenda']}
            selectable={true}
            onSelectEvent={openViewModal}
            onSelectSlot={openAddModal}
          />
        </div>
      )}

      {selectedEvent && (
        <Modal
          isOpen={isViewModalOpen}
          onRequestClose={closeModal}
          style={customModalStyles}
          contentLabel="Appointment Details"
        >
          <h2 className="text-xl font-semibold mb-4">Appointment Details</h2>
          {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
          <form>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Time:</label>
              <p>{moment(selectedEvent.start).format('llll')}</p>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Patient Name:</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Reason:</label>
              <textarea
                name="reason"
                rows="3"
                value={formData.reason}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" onClick={closeModal} variant="outline">
                Close
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="solid">
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        </Modal>
      )}

      {selectedSlotInfo && (
        <Modal
          isOpen={isAddModalOpen}
          onRequestClose={closeModal}
          style={customModalStyles}
          contentLabel="Add Manual Appointment"
        >
          <h2 className="text-xl font-semibold mb-4">Add Manual Appointment</h2>
          {formError && <p className="text-red-500 text-sm mb-3">{formError}</p>}
          <form onSubmit={handleAddAppointment}>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Time:</label>
              <p>
                {moment(selectedSlotInfo.start).format('llll')} -{' '}
                {moment(selectedSlotInfo.end).format('LT')}
              </p>
            </div>
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700">Patient Name:</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Enter patient's full name"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Reason (Optional):</label>
              <textarea
                name="reason"
                rows="3"
                value={formData.reason}
                onChange={handleInputChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="e.g., Follow-up, Consultation"
              ></textarea>
            </div>
            <div className="flex justify-end space-x-3">
              <Button type="button" onClick={closeModal} variant="outline">
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} variant="solid">
                {isSubmitting ? 'Adding...' : 'Add Appointment'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default DoctorSchedulePage;
