import React, { useState, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getRandomQuote } from '../utils/quotes';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const randomQuote = useMemo(() => getRandomQuote(), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    const toastId = toast.loading('Creating your account...');
    try {
      await register(name, email, password);
      toast.success('Account created successfully! Welcome!', { id: toastId });
      navigate('/');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed.';
      toast.error(errorMessage, { id: toastId });
    }
  };

  const googleAuthUrl = import.meta.env.VITE_API_URL
    ? `${import.meta.env.VITE_API_URL}/users/auth/google`
    : 'http://localhost:5000/api/users/auth/google';

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
          <h2 className="mb-3 text-3xl font-bold text-gray-800">Get Started</h2>
          <p className="mb-6 font-light text-gray-500">Create an account to start managing your tasks.</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" placeholder="e.g., Ada Lovelace" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700">Password</label>
              <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Create Account</button>
            </div>
          </form>
          <div className="flex items-center my-4">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="mx-4 text-sm font-semibold text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
          <a href={googleAuthUrl} className="flex items-center justify-center w-full px-4 py-2 font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
            <img className="w-6 h-6 mr-3" src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google icon" />
            Sign Up with Google
          </a>
          <div className="pt-4 mt-4 text-sm text-center text-gray-600 border-t border-gray-200">
            Already have an account?{' '}
            <Link to="/login" className="font-bold text-blue-600 hover:text-blue-500">Log in here</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;