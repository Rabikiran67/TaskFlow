import React, { useState } from 'react'; // Import useState
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

// Import all components and pages
import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav'; // <-- Import new component
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AuthSuccessPage from './pages/AuthSuccessPage';

// This component remains the same
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

// --- UPDATED AppShell ---
// This layout component now manages the state for the mobile sidebar
const AppShell = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MobileNav setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        {/* The main content area with responsive padding */}
        <main className="flex-grow p-4 pt-20 md:p-8 md:pl-72">
          {children}
        </main>
      </div>
    </div>
  );
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
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <AppShell>
                  <DashboardPage />
                </AppShell>
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AppShell>
                  <ProfilePage />
                </AppShell>
              </ProtectedRoute>
            }
          />

          {/* A catch-all route to redirect any invalid URL to the homepage */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;