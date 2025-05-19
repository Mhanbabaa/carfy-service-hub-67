
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './components/theme-provider';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from './components/ui/toaster';
import Layout from './components/layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';

// Initialize the query client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="light" storageKey="carfy-theme-preference">
        <Router>
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/unauthorized" element={<Unauthorized />} />
              
              {/* Protected routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/" element={<Layout><Dashboard /></Layout>} />
                <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
                {/* Add more routes here as needed */}
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
