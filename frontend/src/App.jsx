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

// This is the main layout for authenticated users, including the sidebar and mobile nav
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MobileNav setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <main className="flex-grow p-4 pt-20 md:p-8 md:pl-72">
          {/* Outlet renders the specific nested page (e.g., DashboardPage) */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

// This component acts as a gatekeeper for all private/protected routes
const PrivateRoutes = () => {
  const { isAuthenticated } = useAuth();
  
  // If the user is authenticated, render the main app layout (which contains the Outlet for pages).
  // If not, redirect them to the login page.
  return isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />;
};


function App() {
  return (
    <AuthProvider>
      <Toaster position="top-center" reverseOrder={false} />
      <Router>
        <Routes>
          {/* --- PUBLIC ROUTES --- */}
          {/* These routes are accessible to everyone and do not have the sidebar layout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />

          {/* --- PROTECTED ROUTES --- */}
          {/* All routes inside here will first pass through the PrivateRoutes gatekeeper.
              If successful, they will be rendered inside the AppLayout's <Outlet>. */}
          <Route element={<PrivateRoutes />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* A catch-all for any other path. It will be evaluated by PrivateRoutes. */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;