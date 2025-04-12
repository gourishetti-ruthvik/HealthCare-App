// src/components/Doctors/DoctorCard.jsx
import React from 'react';
import Button from '../Common/Button';
import { Link } from 'react-router-dom'; // Ensure Link is imported

const DoctorCard = ({ doctor }) => {
  const { name, specialty = 'General Practice', id } = doctor; // Get doctor ID

  return (
    <div className="bg-white p-5 rounded-lg shadow-md border border-gray-200 flex flex-col justify-between transition-all duration-200 hover:shadow-lg hover:border-gray-300">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
        <p className="text-sm text-gray-600 mb-4">{specialty}</p>
      </div>
      <div className="mt-auto pt-4 border-t border-gray-100">
        <Link to={`/book-appointment/${id}`}>
          <Button variant="primary" size="sm" className="w-full">
            Book Appointment
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DoctorCard;
