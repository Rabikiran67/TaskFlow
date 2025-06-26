import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor (unchanged)
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- NEW: AXIOS RESPONSE INTERCEPTOR ---
// This function runs after every response is received from the backend.
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // If the error is a 401 Unauthorized (e.g., bad or expired token)
    if (error.response && error.response.status === 401) {
      // Remove the bad token
      localStorage.removeItem('token');
      // Redirect to login page
      window.location.href = '/login';
    }
    // For all other errors, just pass them along
    return Promise.reject(error);
  }
);
// --- END OF NEW INTERCEPTOR ---

// --- All endpoint exports remain the same ---
export const register = (userData) => api.post('/users/register', userData);
export const login = (userData) => api.post('/users/login', userData);
// ... and so on for all your other API functions ...

export default api;