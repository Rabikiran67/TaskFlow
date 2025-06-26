import React, { createContext, useState, useContext } from 'react';
import { login as loginService, register as registerService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // The login function's only job is to get a token and set it.
  const login = async (email, password) => {
    const response = await loginService({ email, password });
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // The register function does the same.
  const register = async (name, email, password) => {
    const response = await registerService({ name, email, password });
    const newToken = response.data.token;
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  // The handleOAuthSuccess function's only job is to set the token.
  const handleOAuthSuccess = (newToken) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };
  
  // The logout function's only job is to clear the token.
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  // We pass `isAuthenticated` directly, derived from the token state.
  return (
    <AuthContext.Provider value={{ token, login, logout, register, isAuthenticated: !!token, handleOAuthSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);