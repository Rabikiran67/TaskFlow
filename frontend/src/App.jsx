import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';

import Sidebar from './components/Sidebar';
import MobileNav from './components/MobileNav';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import AuthSuccessPage from './pages/AuthSuccessPage';

const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <MobileNav setSidebarOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col">
        <main className="flex-grow p-4 pt-20 md:p-8 md:pl-72">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/resetpassword/:token" element={<ResetPasswordPage />} />
          <Route path="/auth/success" element={<AuthSuccessPage />} />
          
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