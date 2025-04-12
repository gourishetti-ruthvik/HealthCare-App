// src/services/appointmentService.js
import { v4 as uuidv4 } from 'uuid';

const APPOINTMENTS_KEY = 'appointments';

// *** Ensure 'export' is present ***
export const getAppointments = () => {
    const data = localStorage.getItem(APPOINTMENTS_KEY);
    try {
        return data ? JSON.parse(data) : [];
    } catch (e) {
        console.error("Error parsing appointments from localStorage:", e);
        return [];
    }
};

const saveAppointments = (appointments) => {
    if (!Array.isArray(appointments)) {
        console.error("Attempted to save non-array data as appointments:", appointments);
        return;
    }
    localStorage.setItem(APPOINTMENTS_KEY, JSON.stringify(appointments));
};

export const createAppointment = (appointmentData) => {
  return new Promise((resolve, reject) => { // Added reject
    // Basic validation
    if (!appointmentData.patientId || !appointmentData.doctorId || !appointmentData.dateTime) {
        return reject(new Error("Missing required appointment data (patientId, doctorId, dateTime)."));
    }
    setTimeout(() => {
      try {
        const appointments = getAppointments();
        const newAppointment = {
          ...appointmentData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          status: appointmentData.status || 'Scheduled',
        };
        // Optional: Add a check here to prevent double booking *just before saving*
        // This is a fallback, primary check should be in availabilityService
        const isDoubleBooked = appointments.some(appt =>
            appt.doctorId === newAppointment.doctorId &&
            appt.dateTime === newAppointment.dateTime &&
            appt.status !== 'Cancelled'
        );
        if (isDoubleBooked) {
            throw new Error("This time slot was just booked. Please select another.");
        }

        appointments.push(newAppointment);
        saveAppointments(appointments);
        console.log("Mock Created Appointment:", newAppointment);
        resolve(newAppointment);
      } catch (error) {
          console.error("Error in createAppointment:", error);
          reject(error); // Reject the promise on error
      }
    }, 500);
  });
};

export const getAppointmentsForUser = (userId, userRole) => {
  return new Promise((resolve, reject) => { // Added reject
    if (!userId || !userRole) {
        return reject(new Error("User ID and Role are required."));
    }
    setTimeout(() => {
      try {
        const appointments = getAppointments();
        let userAppointments = [];
        if (userRole === 'patient') {
          userAppointments = appointments.filter(appt => appt.patientId === userId);
        } else if (userRole === 'doctor') {
          userAppointments = appointments.filter(appt => appt.doctorId === userId);
        } else {
            // Handle unknown role if necessary
            console.warn(`Unknown user role: ${userRole}`);
        }
        // Sort appointments by date (most recent first)
        userAppointments.sort((a, b) => {
            const dateA = a.dateTime ? new Date(a.dateTime).getTime() : 0;
            const dateB = b.dateTime ? new Date(b.dateTime).getTime() : 0;
            if (isNaN(dateA) || isNaN(dateB)) return 0;
            return dateB - dateA; // Sort descending
        });
        console.log(`Mock Fetched Appointments for ${userRole} ${userId}:`, userAppointments);
        resolve(userAppointments);
      } catch(error) {
          console.error("Error in getAppointmentsForUser:", error);
          reject(error);
      }
    }, 500);
  });
};

export const updateAppointment = (appointmentId, updateData) => {
  return new Promise((resolve, reject) => {
    if (!appointmentId || !updateData) {
        return reject(new Error("Appointment ID and update data are required."));
    }
    setTimeout(() => {
      try {
        let appointments = getAppointments();
        const index = appointments.findIndex(appt => appt.id === appointmentId);
        if (index !== -1) {
          const currentStatus = appointments[index].status;
          appointments[index] = {
              ...appointments[index],
              ...updateData,
              // Ensure status isn't accidentally overwritten if not provided
              status: updateData.status !== undefined ? updateData.status : currentStatus,
              updatedAt: new Date().toISOString()
          };
          saveAppointments(appointments);
          console.log("Mock Updated Appointment:", appointments[index]);
          resolve(appointments[index]);
        } else {
          console.error(`Mock Update Error: Appointment ${appointmentId} not found.`);
          reject(new Error(`Appointment with ID ${appointmentId} not found.`));
        }
      } catch(error) {
          console.error("Error in updateAppointment:", error);
          reject(error);
      }
    }, 500);
  });
};

// cancelAppointment uses updateAppointment, so it benefits from its error handling
export const cancelAppointment = (appointmentId) => {
    console.log(`Attempting to cancel appointment ${appointmentId}`);
    if (!appointmentId) {
        return Promise.reject(new Error("Appointment ID is required to cancel."));
    }
    return updateAppointment(appointmentId, { status: 'Cancelled' });
};

// deleteAppointment is less common than cancel, but kept for completeness
export const deleteAppointment = (appointmentId) => {
  return new Promise((resolve, reject) => {
    if (!appointmentId) {
        return reject(new Error("Appointment ID is required to delete."));
    }
    setTimeout(() => {
      try {
        let appointments = getAppointments();
        const initialLength = appointments.length;
        appointments = appointments.filter(appt => appt.id !== appointmentId);

        if (appointments.length < initialLength) {
          saveAppointments(appointments);
          console.log(`Mock Deleted Appointment: ${appointmentId}`);
          resolve({ message: `Appointment ${appointmentId} deleted.` }); // Resolve with success message
        } else {
          console.error(`Mock Delete Error: Appointment ${appointmentId} not found.`);
          reject(new Error(`Appointment with ID ${appointmentId} not found.`));
        }
      } catch(error) {
          console.error("Error in deleteAppointment:", error);
          reject(error);
      }
    }, 500);
  });
};
