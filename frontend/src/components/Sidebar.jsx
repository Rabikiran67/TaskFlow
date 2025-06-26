import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { LayoutDashboard, User, LogOut, X } from 'lucide-react';

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    toast.success("You have been logged out.");
    logout(); // 1. Call the context function to clear the auth state.
    navigate('/login'); // 2. Use React Router to navigate to the login page.
  };

  // A helper function to close the sidebar, used by the overlay and nav links
  const closeSidebar = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  // This function determines the styling for active/inactive links
  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors ${
      isActive ? 'bg-slate-700 text-white font-semibold' : ''
    }`;

  return (
    <>
      {/* Mobile-only overlay that closes the sidebar when clicked */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-50 md:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
      ></div>
      
      {/* The Sidebar itself, with responsive positioning */}
      <aside
        className={`w-72 flex-shrink-0 h-screen bg-slate-800 text-white flex flex-col p-4 fixed top-0 left-0 z-50 
                   transition-transform transform md:translate-x-0 
                   ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between py-4 border-b border-slate-700">
          <div className="text-2xl font-bold text-center">TaskFlow</div>
          {/* Mobile-only close button */}
          <button onClick={closeSidebar} className="p-2 text-slate-400 md:hidden">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow mt-6 space-y-2">
          {/* Clicking a nav link now also closes the mobile sidebar */}
          <NavLink to="/" className={navLinkClasses} onClick={closeSidebar}>
            <LayoutDashboard />
            <span className="ml-3">Dashboard</span>
          </NavLink>
          <NavLink to="/profile" className={navLinkClasses} onClick={closeSidebar}>
            <User />
            <span className="ml-3">Profile</span>
          </NavLink>
        </nav>

        <div className="mt-auto">
          <button 
            onClick={handleLogout} 
            className="flex items-center w-full px-4 py-3 text-gray-300 rounded-lg hover:bg-red-500 hover:text-white transition-colors"
          >
            <LogOut />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;