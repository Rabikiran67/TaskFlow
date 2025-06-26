import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getRandomQuote } from '../utils/quotes';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const randomQuote = useMemo(() => getRandomQuote(), []);

  // --- UPDATED HANDLESUBMIT FUNCTION ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Please enter both email and password.");
    }

    const toastId = toast.loading('Logging in...');
    try {
      // 1. Call the login function
      const success = await login(email, password);
      
      // 2. Only navigate if the login function returns true
      if (success) {
        toast.success('Logged in successfully!', { id: toastId });
        navigate('/');
      } else {
        // This case handles unexpected issues where no token is returned
        toast.error('Login failed. Please try again.', { id: toastId });
      }
    } catch (error) {
      // This catches API errors (like wrong password)
      const errorMessage = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(errorMessage, { id: toastId });
    }
  };
  // --- END OF UPDATE ---
  
  const googleAuthUrl = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/users/auth/google`
    : 'http://localhost:5000/api/users/auth/google';

  return (
    // ... The rest of your JSX form remains exactly the same ...
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      {/* ... The two-panel layout JSX is unchanged ... */}
    </div>
  );
};

export default LoginPage;