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

// --- A NEW, MORE EXPLICIT LAYOUT FOR AUTHENTICATED USERS ---
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MobileNav setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <main className="flex-grow p-4 pt-20 md:p-8 md:pl-72">
          {/* The Outlet component renders the nested child route (e.g., DashboardPage) */}
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

// --- A NEW, EXPLICIT PROTECTED ROUTE ---
// This will protect the entire AppLayout.
const ProtectedRoutes = () => {
  const { isAuthenticated } = useAuth();
  // If the user is authenticated, render the AppLayout which contains all protected pages.
  // If not, redirect them to the login page.
  return isAuthenticated ? <AppLayout /> : <Navigate to="/login" />;
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
          {/* All routes inside here will first pass through the ProtectedRoutes check.
              If successful, they will be rendered inside the AppLayout's <Outlet>. */}
          <Route element={<ProtectedRoutes />}>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>
          
          {/* A catch-all for any other path, redirects to login if not authenticated */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;