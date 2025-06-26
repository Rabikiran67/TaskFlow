import React, { useState } from 'react';
import { forgotPassword } from '../services/api';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
        return toast.error("Please enter your email address.");
    }
    const toastId = toast.loading('Sending reset link...');
    try {
      await forgotPassword(email);
      toast.success('If an account exists, a reset link has been sent.', { id: toastId, duration: 5000 });
    } catch (error) {
      toast.error('An error occurred. Please try again.', { id: toastId });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-2xl rounded-2xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-800">Forgot Password?</h2>
          <p className="mt-2 text-sm text-gray-600">
            No problem! Enter your email below and we'll send you a link to reset it.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full px-4 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Send Reset Link
            </button>
          </div>
        </form>
        <div className="text-sm text-center text-gray-600">
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;