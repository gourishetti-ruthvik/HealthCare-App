// src/services/doctorService.js
import { getUsers } from './authService'; // Assuming getUsers is exported from authService

// Function to get all registered users with the 'doctor' role
export const getAllDoctors = () => {
  return new Promise((resolve) => {
    // Simulate network delay
    setTimeout(() => {
      const allUsers = getUsers(); // Get all users from localStorage
      const doctors = allUsers.filter(user => user.role === 'doctor');

      // We should probably remove sensitive info like password hashes if they were stored
      // (though in our mock, we removed password in login, not here)
      const safeDoctors = doctors.map(({ password, ...doctor }) => doctor);

      console.log("Fetched Doctors:", safeDoctors); // For debugging
      resolve(safeDoctors);
    }, 500); // Simulate 0.5 second delay
  });
};

// --- Add this new function ---
/**
 * Fetches a single doctor by their ID.
 * @param {string} doctorId - The ID of the doctor to fetch.
 * @returns {Promise<object|null>} - A promise resolving to the doctor object or null if not found.
 */
export const getDoctorById = (doctorId) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const allUsers = getUsers();
      const doctor = allUsers.find(user => user.id === doctorId && user.role === 'doctor');

      if (doctor) {
        const { password, ...safeDoctor } = doctor; // Remove password
        console.log("Fetched Doctor By ID:", safeDoctor);
        resolve(safeDoctor);
      } else {
        console.error(`Doctor with ID ${doctorId} not found.`);
        // Resolve with null or reject, depending on how you want to handle not found
        // reject(new Error(`Doctor with ID ${doctorId} not found.`));
         resolve(null); // Or return null if that's preferred in the calling component
      }
    }, 300); // Simulate delay
  });
};
// --- End of new function ---
