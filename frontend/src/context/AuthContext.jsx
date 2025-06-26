import React, { createContext, useState, useContext } from 'react';
import { login as loginService, register as registerService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  const login = async (email, password) => {
    const response = await loginService({ email, password });
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
  };

  const register = async (name, email, password) => {
    const response = await registerService({ name, email, password });
    localStorage.setItem('token', response.data.token);
    setToken(response.data.token);
  };

  const handleOAuthSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // --- UPDATED LOGOUT FUNCTION ---
  const logout = () => {
    // 1. Clear the token from state and storage
    localStorage.removeItem('token');
    setToken(null);
    
    // 2. Force a full page reload to the login page.
    // This clears any in-memory state and ensures all components re-evaluate the auth status.
    window.location.href = '/login'; 
  };
  // --- END OF UPDATE ---

  return (
    <AuthContext.Provider value={{ token, login, logout, register, isAuthenticated: !!token, handleOAuthSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);