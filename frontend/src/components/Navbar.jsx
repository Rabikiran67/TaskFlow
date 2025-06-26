import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("You've been logged out.");
    navigate('/login');
  };

  return (
    <header className="bg-white/70 backdrop-blur-lg shadow-sm sticky top-0 z-50">
      <nav className="container mx-auto flex items-center justify-between p-4">
        {/* --- UPDATED: Gradient Text for Logo --- */}
        <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TaskFlow
        </Link>
        <ul className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              <li><Link to="/profile" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Profile</Link></li>
              <li>
                {/* --- UPDATED: Gradient Button --- */}
                <button 
                  onClick={handleLogout} 
                  className="px-4 py-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-500 to-indigo-500 rounded-md hover:shadow-lg hover:opacity-90 transition-all"
                >
                  Logout
                </button>
              </li>
            </>
          ) : (
            <>
              <li><Link to="/login" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Login</Link></li>
              <li><Link to="/register" className="px-4 py-2 text-sm font-semibold text-indigo-600 bg-indigo-100 rounded-md hover:bg-indigo-200 transition-colors">Sign Up</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;