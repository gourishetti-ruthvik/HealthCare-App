// src/components/Common/Input.jsx
import React from 'react';

const Input = ({
  label,
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="mb-4">
      {/* Label */}
      <label
        htmlFor={id}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Input Field */}
      <input
        type={type}
        id={id}
        name={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;


