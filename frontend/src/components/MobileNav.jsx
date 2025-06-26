import React from 'react';
import { Menu } from 'lucide-react'; // Import the hamburger icon

const MobileNav = ({ setSidebarOpen }) => {
  return (
    // This navbar is fixed to the top and only visible on screens smaller than 'md'
    <header className="md:hidden sticky top-0 z-40 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between p-4">
        <div className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          TaskFlow
        </div>
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 text-slate-600"
        >
          <Menu size={28} />
        </button>
      </div>
    </header>
  );
};

export default MobileNav;