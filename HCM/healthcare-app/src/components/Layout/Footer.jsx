// src/components/Layout/Footer.jsx
import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300 mt-auto">
      {/* mt-auto pushes footer to the bottom */}
      <div className="container mx-auto px-4 py-4 text-center text-sm">
        &copy; {currentYear} HealthAppoint. All rights reserved.
        {/* Add more links or information here if needed */}
      </div>
    </footer>
  );
};

export default Footer;
