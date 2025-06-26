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

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // --- NEW FUNCTION ---
  // Handles saving the token received from the OAuth callback
  const handleOAuthSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };
  // --- END NEW FUNCTION ---

  return (
    <AuthContext.Provider value={{ token, login, logout, register, isAuthenticated: !!token, handleOAuthSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);