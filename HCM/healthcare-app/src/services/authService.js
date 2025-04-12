// src/services/authService.js

const USERS_KEY = 'healthcare_users';
const CURRENT_USER_KEY = 'healthcare_current_user';

// Mock Database - Initialize with some test users if empty
const initializeMockUsers = () => {
  if (!localStorage.getItem(USERS_KEY)) {
    const mockUsers = [
      { id: 'user1', username: 'patient1@test.com', password: 'password123', role: 'patient', name: 'John Doe' },
      { id: 'user2', username: 'doctor1@test.com', password: 'password123', role: 'doctor', name: 'Dr. Alice Smith' },
    ];
    localStorage.setItem(USERS_KEY, JSON.stringify(mockUsers));
  }
};

initializeMockUsers(); // Make sure this runs

// --- Add 'export' keyword here ---
export const getUsers = () => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};
// --- End change ---

const saveUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

// --- Updated Register Function ---
export const register = (username, password, name, role) => { // Role is now a required parameter
  // ... (rest of register function)
  return new Promise((resolve, reject) => {
    if (!role || (role !== 'patient' && role !== 'doctor')) {
        return reject(new Error('Invalid role specified. Must be "patient" or "doctor".'));
    }
    setTimeout(() => {
      const users = getUsers(); // This call inside the file is fine
      const existingUser = users.find(user => user.username === username);
      if (existingUser) {
        return reject(new Error('Username already exists'));
      }
      const newUser = { id: `user${Date.now()}`, username, password, name, role };
      users.push(newUser);
      saveUsers(users);
      console.log("Registered User:", newUser);
      resolve(newUser);
    }, 500);
  });
};
// --- End Updated Register Function ---

// --- Updated Login Function ---
export const login = (username, password, role) => { // Add role parameter
  // ... (rest of login function)
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const users = getUsers(); // This call inside the file is fine
      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        if (user.role === role) {
          const { password, ...userWithoutPassword } = user;
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userWithoutPassword));
          console.log("Logged In User:", userWithoutPassword);
          resolve(userWithoutPassword);
        } else {
          reject(new Error(`Credentials are valid, but not for the selected role (${role}).`));
        }
      } else {
        reject(new Error('Invalid username or password.'));
      }
    }, 500);
  });
};
// --- End Updated Login Function ---

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_KEY);
   return Promise.resolve();
};

export const getCurrentUser = () => {
  const user = localStorage.getItem(CURRENT_USER_KEY);
  return user ? JSON.parse(user) : null;
};

