// src/components/Auth/RegisterForm.jsx
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import Input from '../Common/Input';
import Button from '../Common/Button';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('patient'); // Default role to 'patient'
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (!role) {
      setError('Please select a role (Patient or Doctor).');
      return;
    }

    setLoading(true);
    try {
      await register(username, password, name, role);
      setSuccess('Registration successful! You can now log in.');
      setUsername('');
      setPassword('');
      setConfirmPassword('');
      setName('');
      setRole('patient'); // Reset role selection
    } catch (err) {
      setError(err.message || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && <p className="text-red-500 text-sm text-center">{error}</p>}
      {success && <p className="text-green-500 text-sm text-center">{success}</p>}

      {/* Input Fields */}
      <Input
        label="Full Name"
        type="text"
        id="register-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="John Doe"
        required
      />
      <Input
        label="Email (Username)"
        type="email"
        id="register-username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <Input
        label="Password"
        type="password"
        id="register-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="•••••••• (min 6 chars)"
        required
      />
      <Input
        label="Confirm Password"
        type="password"
        id="register-confirm-password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      {/* Role Selection */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Register as:</label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="patient"
              checked={role === 'patient'}
              onChange={(e) => setRole(e.target.value)}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Patient</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="role"
              value="doctor"
              checked={role === 'doctor'}
              onChange={(e) => setRole(e.target.value)}
              className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300"
            />
            <span className="ml-2 text-sm text-gray-700">Doctor</span>
          </label>
        </div>
      </div>

      {/* Submit Button */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegisterForm;
