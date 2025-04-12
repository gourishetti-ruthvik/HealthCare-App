// src/pages/FindDoctorPage.jsx
import React, { useState, useEffect } from 'react';
import { getAllDoctors } from '../services/doctorService'; // Import the service function
import DoctorCard from '../components/Doctors/DoctorCard'; // We'll create this next
import LoadingSpinner from '../components/Common/LoadingSpinner'; // Assuming you have this

const FindDoctorPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      setError('');
      try {
        const fetchedDoctors = await getAllDoctors();
        setDoctors(fetchedDoctors);
      } catch (err) {
        console.error('Failed to fetch doctors:', err);
        setError('Failed to load doctors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="p-6 font-sans max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Find a Doctor</h1>

      {/* Add search/filter controls here later */}
      {/* <div className="mb-6"> Search Bar Placeholder </div> */}

      {loading && (
        <div className="flex justify-center items-center">
          <LoadingSpinner />
        </div>
      )}
      {error && <p className="text-red-500 text-center">{error}</p>}

      {!loading && !error && (
        doctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {doctors.map((doctor) => (
              // Use a DoctorCard component to display each doctor
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600 text-center">
            No doctors found matching your criteria.
          </p>
        )
      )}

      {!loading && !error && doctors.length === 0 && (
        <p className="text-gray-600 text-center">
          There are currently no doctors registered on the platform.
        </p>
      )}
    </div>
  );
};

export default FindDoctorPage;
