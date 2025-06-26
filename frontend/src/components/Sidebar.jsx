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
    logout();
    navigate('/login');
  };

  const closeSidebar = () => setSidebarOpen(false);

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors ${
      isActive ? 'bg-slate-700 text-white font-semibold' : ''
    }`;

  return (
    <>
      {/* Mobile-only overlay that closes the sidebar when clicked */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-[51] md:hidden transition-opacity ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={closeSidebar}
        aria-hidden="true"
      ></div>
      
      {/* The Sidebar itself */}
      <aside
        className={`fixed inset-y-0 left-0 z-[52] flex h-full w-72 flex-col bg-slate-800 p-4 text-white
                   transition-transform duration-300 ease-in-out md:translate-x-0 
                   ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between py-4 border-b border-slate-700">
          <div className="text-2xl font-bold text-center">TaskFlow</div>
          <button onClick={closeSidebar} className="p-2 text-slate-400 md:hidden" aria-label="Close sidebar">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-grow mt-6 space-y-2">
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