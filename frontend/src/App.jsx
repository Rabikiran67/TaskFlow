import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Import all components and pages
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AuthSuccessPage from './pages/AuthSuccessPage';

// This component defines the layout for authenticated users
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-100">
      {/* On desktop, the sidebar is a sibling. On mobile, it's a toggled overlay. */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MobileNav setSidebarOpen={setSidebarOpen} />
      
      {/* The main content area with responsive left-padding for the desktop sidebar */}
      <main className="md:pl-72">
        {/* Top-padding to prevent content from hiding under the mobile nav */}
        <div className="p-4 pt-20 md:pt-8 md:p-8">
            <Outlet /> 
        </div>
      </main>
    </div>
  );
};

// This component acts as a gatekeeper for all private routes
const PrivateRoutes = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />
          
          {/* Protected Routes */}
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;