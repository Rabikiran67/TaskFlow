import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

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

// --- Task Routes (Unchanged) ---
export const getTasks = (query = '') => api.get(`/tasks${query}`);
export const createTask = (taskData) => api.post('/tasks', taskData);
export const updateTask = (id, taskData) => api.put(`/tasks/${id}`, taskData);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

// --- UPDATED USER PROFILE ROUTES ---
export const getProfile = () => api.get('/users/profile');
export const updateProfile = (userData) => api.put('/users/profile', userData);
export const updatePassword = (password) => api.put('/users/password', { password });

export default api;