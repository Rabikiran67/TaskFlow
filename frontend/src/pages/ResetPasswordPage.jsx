import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { resetPassword } from '../services/api';
import toast from 'react-hot-toast';
import { getRandomQuote } from '../utils/quotes';

const ResetPasswordPage = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { token } = useParams();
  const navigate = useNavigate();

  const randomQuote = useMemo(() => getRandomQuote(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    const toastId = toast.loading('Resetting password...');
    try {
      await resetPassword(token, password);
      toast.success('Password has been reset successfully! Please log in.', { id: toastId });
      navigate('/login');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Invalid or expired token.';
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="relative flex w-full max-w-4xl m-6 overflow-hidden bg-white shadow-2xl rounded-2xl md:flex-row">
        
        <div className="flex-col justify-between w-full p-10 text-white bg-gradient-to-br from-slate-800 to-slate-900 md:w-1/2 hidden md:flex">
          <div className="text-3xl font-bold">TaskFlow</div>
          <div className="text-lg italic">
            <p>"{randomQuote.quote}"</p>
            <p className="mt-4 font-semibold not-italic">- {randomQuote.author}</p>
          </div>
          <div className="text-sm text-slate-400">Made with ❤️ by Gipsy</div>
        </div>

        <div className="flex flex-col justify-center w-full p-10 md:w-1/2">
          <h2 className="mb-3 text-3xl font-bold text-gray-800">Create New Password</h2>
          <p className="mb-6 font-light text-gray-500">Choose a new, secure password to protect your account.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">New Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Confirm New Password</label>
              <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Set New Password</button>
            </div>
          </form>
          <div className="pt-4 mt-4 text-sm text-center text-gray-600 border-t border-gray-200">
            Remembered your password?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;