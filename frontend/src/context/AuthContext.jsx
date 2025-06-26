import React, { createContext, useState, useContext } from 'react';
import { login as loginService, register as registerService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('token'));

  const login = async (email, password) => {
    const response = await loginService({ email, password });
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const register = async (name, email, password) => {
    const response = await registerService({ name, email, password });
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const handleOAuthSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, login, logout, register, isAuthenticated: !!token, handleOAuthSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);