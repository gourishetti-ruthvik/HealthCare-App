// src/components/Common/LoadingSpinner.jsx
import React from 'react';

const LoadingSpinner = ({ message = 'Loading...', size = '12', color = 'blue-500' }) => {
  return (
    <div className="flex justify-center items-center py-10">
      <div
        className={`animate-spin rounded-full h-${size} w-${size} border-t-2 border-b-2 border-${color}`}
      ></div>
      {message && <p className="ml-3 text-gray-600">{message}</p>}
    </div>
  );
};

export default LoadingSpinner;
