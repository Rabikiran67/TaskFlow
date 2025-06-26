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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Please enter both email and password.");
    
    const toastId = toast.loading('Logging in...');
    try {
      await login(email, password); // 1. Call login from context
      toast.success('Logged in successfully!', { id: toastId });
      navigate('/'); // 2. Navigate after success
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed.';
      toast.error(errorMessage, { id: toastId });
    }
  };

  const googleAuthUrl = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/users/auth/google`
    : 'http://localhost:5000/api/users/auth/google';

  return (
    // ...The rest of your two-panel JSX layout remains unchanged...
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="relative flex w-full max-w-4xl m-6 overflow-hidden bg-white shadow-2xl rounded-2xl md:flex-row">
        {/* ... Left Panel ... */}
        {/* ... Right Panel with form ... */}
      </div>
    </div>
  );
};

export default LoginPage;