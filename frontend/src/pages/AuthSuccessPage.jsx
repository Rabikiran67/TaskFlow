import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const AuthSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleOAuthSuccess } = useAuth();

  useEffect(() => {
    // Create a URLSearchParams object from the current URL's search string
    const params = new URLSearchParams(location.search);
    const token = params.get('token'); // Extract the token from the query parameter

    if (token) {
      toast.success('Logged in successfully!');
      handleOAuthSuccess(token); // Save the token using our context function
      navigate('/'); // Redirect to the dashboard
    } else {
      toast.error('Authentication failed. Please try again.');
      navigate('/login'); // Redirect back to login on failure
    }
  }, [location, navigate, handleOAuthSuccess]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">Authenticating...</h1>
        <p className="text-gray-600">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default AuthSuccessPage;