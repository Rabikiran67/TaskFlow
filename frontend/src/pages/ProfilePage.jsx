import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, updatePassword } from '../services/api';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const [user, setUser] = useState(null); // Store the whole user object
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Fetch the current user's data when the component mounts
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getProfile();
        setUser(data);
        setName(data.name);
      } catch (error) {
        toast.error("Could not fetch profile information.");
      }
    };
    fetchUser();
  }, []);

  // Handler for updating the user's name
  const handleUpdateDetails = async (e) => {
    e.preventDefault();
    const toastId = toast.loading('Updating details...');
    try {
      await updateProfile({ name });
      toast.success("Details updated successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to update details.", { id: toastId });
    }
  };

  // Handler for updating the user's password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match!");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    const toastId = toast.loading('Updating password...');
    try {
      await updatePassword(password);
      toast.success("Password updated successfully!", { id: toastId });
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error("Failed to update password.", { id: toastId });
    }
  };

  if (!user) {
    return <div>Loading profile...</div>; // Show a loading state
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-800">My Profile</h1>
        <p className="mt-1 text-slate-500">Manage your personal information.</p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        
        {/* Card 1: Profile Information */}
        <div className="p-8 bg-white shadow-lg rounded-xl">
          <h2 className="mb-6 text-2xl font-semibold text-gray-700">Profile Information</h2>
          <form onSubmit={handleUpdateDetails} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" value={user.email} disabled className="w-full px-3 py-2 mt-1 bg-gray-100 border border-gray-300 rounded-lg shadow-sm cursor-not-allowed" />
            </div>
            <div>
              <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-blue-500 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">Save Details</button>
            </div>
          </form>
        </div>

        {/* --- MODIFIED: Conditionally render the password form --- */}
        {/* If the user has a googleId, they are a Google user, so we don't show this form */}
        {!user.googleId && (
          <div className="p-8 bg-white shadow-lg rounded-xl">
            <h2 className="mb-6 text-2xl font-semibold text-gray-700">Change Password</h2>
            <form onSubmit={handleUpdatePassword} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                <input type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <button type="submit" className="w-full px-4 py-3 font-semibold text-white bg-slate-700 rounded-lg hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-700">Update Password</button>
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProfilePage;