import React, { createContext, useState, useContext } from 'react';
import { login as loginService, register as registerService } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // --- MODIFIED LOGIN FUNCTION ---
  const login = async (email, password) => {
    try {
      const response = await loginService({ email, password });
      const newToken = response.data.token;
      if (newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        return true; // Return true on success
      }
      return false; // Return false if no token is received
    } catch (error) {
      // Re-throw the error so the component can catch it and show a toast
      throw error; 
    }
  };
  // --- END OF MODIFICATION ---

  // Register function can be similarly updated for consistency
  const register = async (name, email, password) => {
    try {
      const response = await registerService({ name, email, password });
      const newToken = response.data.token;
      if (newToken) {
        localStorage.setItem('token', newToken);
        setToken(newToken);
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
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