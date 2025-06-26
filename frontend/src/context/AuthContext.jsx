import React, { createContext, useState, useContext } from 'react';
import { login as loginService, register as registerService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // login, register, and handleOAuthSuccess functions remain unchanged
  const login = async (email, password) => { /* ... */ };
  const register = async (name, email, password) => { /* ... */ };
  const handleOAuthSuccess = (newToken) => { /* ... */ };

  // --- UPDATED, SIMPLIFIED LOGOUT FUNCTION ---
  const logout = () => {
    // This function's only responsibility is to clear the authentication state.
    localStorage.removeItem('token');
    setToken(null);
  };
  // --- END OF UPDATE ---

  return (
    <AuthContext.Provider value={{ token, login, logout, register, isAuthenticated: !!token, handleOAuthSuccess }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);