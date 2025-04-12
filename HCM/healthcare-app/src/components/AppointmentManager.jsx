// src/components/AppointmentManager.jsx

import React, { useState, useEffect, useCallback } from 'react';
import Modal from 'react-modal';
import {
    createAppointment, // Keep if scheduling is also done here, otherwise remove
    cancelAppointment,
    getAppointmentsForUser
} from '../services/appointmentService'; // Adjust path if needed
import { getCurrentUser } from '../services/authService'; // Adjust path if needed

// --- Modal Styling ---
const customModalStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        padding: '25px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        minWidth: '300px',
        maxWidth: '500px',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        textAlign: 'center',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1000,
    }
};

// Ensure Modal app element is set (can be done globally in App.js/index.js)
// Modal.setAppElement('#root');

function AppointmentManager() {
    // --- Modal State ---
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', message: '' });
    const [isLoading, setIsLoading] = useState(false);

    // --- Component State ---
    const [appointments, setAppointments] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);

    // --- Modal Control Functions ---
    const showPopup = useCallback((title, message) => {
        setModalContent({ title, message });
        setIsModalOpen(true);
    }, []);

    const closePopup = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    // --- Data Fetching ---
    const fetchUserAppointments = useCallback(async (userId, userRole) => {
        if (!userId || !userRole) return;
        setIsLoading(true);
        try {
            const fetchedAppointments = await getAppointmentsForUser(userId, userRole);
            setAppointments(fetchedAppointments);
        } catch (error) {
            console.error("Error fetching appointments:", error);
            showPopup('Error', `Could not load appointments: ${error.message || 'Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    }, [showPopup]); // Dependency on showPopup

    // --- Fetch user and appointments on mount ---
    useEffect(() => {
        const user = getCurrentUser();
        setCurrentUser(user);
        if (user) {
            fetchUserAppointments(user.id, user.role);
        } else {
             console.log("No user logged in.");
        }
        // Set app element here if not done globally
        Modal.setAppElement('#root');
    }, [fetchUserAppointments]); // Dependency on fetchUserAppointments

    // --- Handler for Scheduling (Example - Adapt or remove if booking is separate) ---
    const handleScheduleExample = async () => {
        if (!currentUser) {
            showPopup('Error', 'You must be logged in to schedule.');
            return;
        }
        // --- Replace with actual data from your form ---
        const appointmentData = {
            patientId: currentUser.role === 'patient' ? currentUser.id : 'patient-placeholder-id',
            doctorId: 'doctor-placeholder-id', // Get from selection
            dateTime: new Date().toISOString(), // Get from selection
            reason: 'Example Checkup', // Get from input
        };
        // --- End Replace ---

        setIsLoading(true);
        try {
            const newAppointment = await createAppointment(appointmentData);
            showPopup(
                'Success',
                `Appointment scheduled successfully for ${new Date(newAppointment.dateTime).toLocaleString()}.`
            );
            // Refresh the list
            fetchUserAppointments(currentUser.id, currentUser.role);
        } catch (error) {
            console.error("Scheduling error:", error);
            showPopup('Error', `Failed to schedule appointment: ${error.message || 'Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };
    

    // --- Handler for Cancelling ---
    const handleCancelClick = async (appointmentId) => {
        // Optional: Add confirmation logic here if needed
        // if (!window.confirm('Are you sure?')) return;

        setIsLoading(true);
        try {
            await cancelAppointment(appointmentId);
            // Use the modal popup for success
            showPopup('Success', 'Appointment cancelled successfully.');

            // Refresh the list after successful cancellation
            if (currentUser) {
                fetchUserAppointments(currentUser.id, currentUser.role);
            }
        } catch (error) {
            console.error("Cancellation error:", error);
            // Use the modal popup for error
            showPopup('Error', `Failed to cancel appointment: ${error.message || 'Please try again.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    // --- Render Logic ---
    return (
        <div className="p-6 font-sans">
            <h1 className="text-2xl font-bold mb-4">Manage Appointments</h1>

            {!currentUser && <p className="text-red-500">Please log in to manage appointments.</p>}
            {isLoading && <p className="text-blue-500">Loading...</p>}

            {/* Example Button to trigger scheduling */}
            {currentUser && (
                <button
                    onClick={handleScheduleExample}
                    disabled={isLoading}
                    className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500 disabled:opacity-50"
                >
                    Schedule Example Appointment
                </button>
            )}

            {/* Display Appointments */}
            {currentUser && (
                <>
                    <h2 className="text-xl font-semibold mb-4">Your Appointments</h2>
                    {appointments.length === 0 && !isLoading && (
                        <p className="text-gray-500">You have no appointments scheduled.</p>
                    )}
                    <ul className="space-y-4">
                        {appointments.map((appt) => (
                            <li
                                key={appt.id}
                                className="border border-gray-200 p-4 rounded shadow-sm flex justify-between items-center"
                            >
                                <div>
                                    <p>
                                        <strong>Date:</strong>{' '}
                                        {appt.dateTime ? new Date(appt.dateTime).toLocaleString() : 'Invalid Date'}
                                    </p>
                                    <p>
                                        <strong>Reason:</strong> {appt.reason || 'N/A'}
                                    </p>
                                    <p>
                                        <strong>Status:</strong>{' '}
                                        <span
                                            className={`font-bold ${
                                                appt.status === 'Cancelled' ? 'text-red-500' : 'text-green-500'
                                            }`}
                                        >
                                            {appt.status}
                                        </span>
                                    </p>
                                    {currentUser.role === 'patient' && (
                                        <p>
                                            <strong>Doctor ID:</strong> {appt.doctorId}
                                        </p>
                                    )}
                                    {currentUser.role === 'doctor' && (
                                        <p>
                                            <strong>Patient ID:</strong> {appt.patientId}
                                        </p>
                                    )}
                                </div>
                                {appt.status === 'Scheduled' && (
                                    <button
                                        onClick={() => handleCancelClick(appt.id)}
                                        disabled={isLoading}
                                        className="bg-red-600 text-white px-3 py-2 rounded hover:bg-red-500 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                </>
            )}

            {/* Modal Component */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={closePopup}
                style={{
                    content: {
                        padding: '25px',
                        borderRadius: '8px',
                        textAlign: 'center',
                    },
                    overlay: {
                        backgroundColor: 'rgba(0, 0, 0, 0.6)',
                    },
                }}
                contentLabel="Action Status Popup"
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

export default AppointmentManager;

