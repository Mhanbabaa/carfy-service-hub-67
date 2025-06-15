
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { Toaster } from './components/ui/toaster';
import Layout from './components/layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Vehicles from './pages/Vehicles';
import Customers from './pages/Customers';
import Services from './pages/Services';
import ServiceDetail from './pages/ServiceDetail';
import Parts from './pages/Parts';
import Personnel from './pages/Personnel';
import Brands from './pages/Brands';
import AdminPanel from './pages/AdminPanel';
import ChangePassword from './pages/ChangePassword';
import Profile from './pages/Profile';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import Signup from './pages/Signup';
import Debug from './pages/Debug';
import TechnicianPerformance from './pages/TechnicianPerformance';

// Initialize the query client
const queryClient = new QueryClient();

// Auth check middleware to force password change on first login
const AuthRedirect: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && isAuthenticated() && user?.user_metadata?.must_change_password === true) {
      navigate('/change-password');
    }
  }, [loading, isAuthenticated, user, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return <>{children}</>;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="carfy-theme-preference">
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              <Route path="/change-password" element={<ChangePassword />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AuthRedirect><Layout /></AuthRedirect>}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/vehicles" element={<Vehicles />} />
                  <Route path="/customers" element={<Customers />} />
                  <Route path="/services" element={<Services />} />
                  <Route path="/services/:id" element={<ServiceDetail />} />
                  <Route path="/parts" element={<Parts />} />
                  <Route path="/personnel" element={<Personnel />} />
                  <Route path="/technician-performance" element={<TechnicianPerformance />} />
                  <Route path="/brands" element={<Brands />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/debug" element={<Debug />} />
                </Route>
              </Route>
              
              {/* Admin routes - sadece superadmin erişebilir */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminRoute />}>
                  <Route element={<AuthRedirect><Layout /></AuthRedirect>}>
                    <Route path="/admin" element={<AdminPanel />} />
                  </Route>
                </Route>
              </Route>
              
              {/* 404 Not Found */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
