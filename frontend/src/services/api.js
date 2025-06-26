import axios from 'axios';

// --- THIS IS THE DYNAMIC URL LOGIC THAT WAS MISSING ---
// It checks for the VITE_API_URL environment variable we set on Vercel.
// If it doesn't find it (like in local development), it uses the localhost URL as a fallback.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Now, we use this dynamic API_URL to create the Axios instance.
const api = axios.create({
  baseURL: API_URL,
});

// The rest of your file is perfect and does not need to change.
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --- Auth Routes ---
export const register = (userData) => api.post('/users/register', userData);
export const login = (userData) => api.post('/users/login', userData);
export const forgotPassword = (email) => api.post('/users/forgotpassword', { email });
export const resetPassword = (token, password) => api.put(`/users/resetpassword/${token}`, { password });

// --- USER PROFILE ROUTES ---
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (userData) => api.put('/users/profile', userData);
export const updatePassword = (password) => api.put('/users/password', { password });

// --- Task Routes ---
export const getTasks = (query = '') => api.get(`/tasks${query}`);
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

export default api;