// src/services/apiClient.js  <-- Make sure this file exists

import axios from 'axios';

// Configure your base URL and any other default settings
const apiClient = axios.create({
  baseURL: '/api', // Or your actual API base URL (e.g., 'http://localhost:5000/api')
  headers: {
    'Content-Type': 'application/json',
    // You might add authorization headers here later
  },
  // Add other configurations like timeouts if needed
});

// --- Crucial part: Export it as default ---
export default apiClient;
