import axios from 'axios';

// Dynamic API URL for deployment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Request Interceptor: Attaches JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response Interceptor: Handles 401 Unauthorized errors by logging the user out
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


// --- AUTHENTICATION ENDPOINTS ---
export const register = (userData) => api.post('/users/register', userData);
export const login = (userData) => api.post('/users/login', userData);
export const forgotPassword = (email) => api.post('/users/forgotpassword', { email });
export const resetPassword = (token, password) => api.put(`/users/resetpassword/${token}`, { password });


// --- USER PROFILE ENDPOINTS ---
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (userData) => api.put('/users/profile', userData);
export const updatePassword = (password) => api.put('/users/password', { password });


// --- TASK ENDPOINTS (THE FIX IS HERE) ---
export const getTasks = (query = '') => api.get(`/tasks${query}`);
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);


export default api;