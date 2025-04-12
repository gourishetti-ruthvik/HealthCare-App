// src/services/availabilityService.js
import { getAppointments } from './appointmentService'; // Ensure this path is correct

/**
 * Fetches available appointment slots for a specific doctor on a given date.
 * Filters out slots that are already booked (Scheduled status).
 * @param {string} doctorId - The ID of the doctor.
 * @param {string} date - The date in 'YYYY-MM-DD' format.
 * @returns {Promise<Array<string>>} - A promise that resolves to an array of available time slots.
 */
export const getDoctorAvailability = async (doctorId, date) => {
    // Input Validation
    if (!doctorId || !date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        console.error("Invalid input to getDoctorAvailability:", { doctorId, date });
        return Promise.resolve([]);
    }

    console.log(`AVAILABILITY CHECK: Fetching for doctor ${doctorId} on ${date}`);

    return new Promise((resolve) => {
        setTimeout(() => {
            // Base potential slots for a standard day
            const potentialSlots = [
                "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
                "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"
            ];

            // Check for weekends (using UTC to avoid timezone issues with date string)
            try {
                // Ensure date string is treated as UTC for day calculation
                const dayOfWeek = new Date(date + 'T00:00:00Z').getUTCDay(); // 0 = Sunday, 6 = Saturday
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                   console.log(`AVAILABILITY CHECK: ${date} is a weekend. No slots.`);
                   resolve([]);
                   return;
                }
            } catch (e) {
                console.error("Error checking day of week for date:", date, e);
                resolve([]);
                return;
            }

            // --- Check existing appointments ---
            let allAppointments = [];
            try {
                allAppointments = getAppointments(); // Fetch all appointments
                console.log(`AVAILABILITY CHECK: Found ${allAppointments.length} total appointments.`);
            } catch (error) {
                console.error("AVAILABILITY CHECK: Error fetching appointments:", error);
                // Decide fallback: return all potential slots or none? Returning none is safer.
                resolve([]);
                return;
            }

            const relevantAppointments = allAppointments.filter(appt =>
                appt.doctorId === doctorId &&
                appt.dateTime &&
                typeof appt.dateTime === 'string' &&
                appt.dateTime.startsWith(date) && // Check if the appointment is on the requested date
                appt.status === 'Scheduled' // *** Only consider 'Scheduled' appointments as booked ***
            );

            console.log(`AVAILABILITY CHECK: Found ${relevantAppointments.length} relevant scheduled appointments for doctor ${doctorId} on ${date}.`);

            const bookedTimes = relevantAppointments
                .map(appt => {
                    try {
                        const appointmentDate = new Date(appt.dateTime);
                        if (isNaN(appointmentDate.getTime())) {
                            throw new Error(`Invalid date string: ${appt.dateTime}`);
                        }
                        // Extract HH:mm in 24hr format, assuming stored time is UTC or consistently local
                        // Using UTC is generally safer if dateTime strings include timezone info (like 'Z')
                        const timeString = appointmentDate.toLocaleTimeString('en-GB', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false,
                            timeZone: 'UTC' // Adjust if times are stored/interpreted differently
                        });
                        // console.log(`AVAILABILITY CHECK: Parsed dateTime ${appt.dateTime} to time ${timeString}`);
                        return timeString;
                    } catch (e) {
                        console.error(`AVAILABILITY CHECK: Error parsing appointment dateTime: "${appt.dateTime}"`, e);
                        return null;
                    }
                })
                .filter(time => time !== null);

            const bookedTimesSet = new Set(bookedTimes);
            console.log(`AVAILABILITY CHECK: Booked times set for ${doctorId} on ${date}:`, bookedTimesSet);

            // Filter potential slots, removing those that are already booked
            const availableSlots = potentialSlots.filter(slot => !bookedTimesSet.has(slot));

            console.log(`AVAILABILITY CHECK: Final available slots for ${doctorId} on ${date}:`, availableSlots);
            resolve(availableSlots);

        }, 400); // Simulate delay
    });
};
