// src/components/Auth/LoginForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Input from '../Common/Input'; // Assuming this component handles its internal styling
import Button from '../Common/Button'; // Assuming this component handles its internal styling

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient'); // Default role to 'patient'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(username, password, role);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Failed to login. Please check your credentials and selected role.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-sm"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {/* Input Fields */}
      <Input
        label="Email (Username)"
        type="email"
        id="login-username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="you@example.com"
        required
      />
      <Input
        label="Password"
        type="password"
        id="login-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="••••••••"
        required
      />

      {/* Role Selection */}
      <fieldset className="space-y-2 pt-2">
        <legend className="block text-sm font-medium text-gray-800 mb-2">Login as:</legend>
        <div className="flex items-center space-x-6">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="role"
              value="patient"
              checked={role === 'patient'}
              onChange={(e) => setRole(e.target.value)}
              className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-400"
            />
            <span className="ml-3 text-sm font-medium text-gray-800">Patient</span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="role"
              value="doctor"
              checked={role === 'doctor'}
              onChange={(e) => setRole(e.target.value)}
              className="focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-400"
            />
            <span className="ml-3 text-sm font-medium text-gray-800">Doctor</span>
          </label>
        </div>
      </fieldset>

      {/* Submit Button */}
      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Logging in...' : 'Login'}
      </Button>

      {/* Mock Logins Info */}
      <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-600 text-center space-y-1">
        <p className="font-semibold text-gray-700">Mock Logins (Select Role Above):</p>
        <p>
          <span className="font-medium">Patient:</span> patient1@test.com / password123
        </p>
        <p>
          <span className="font-medium">Doctor:</span> doctor1@test.com / password123
        </p>
      </div>
    </form>
  );
};

export default LoginForm;
