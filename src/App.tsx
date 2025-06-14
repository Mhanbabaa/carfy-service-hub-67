
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

// Import pages
import LandingPage from "@/pages/LandingPage";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import ChangePassword from "@/pages/ChangePassword";
import Dashboard from "@/pages/Dashboard";
import Vehicles from "@/pages/Vehicles";
import Customers from "@/pages/Customers";
import Services from "@/pages/Services";
import ServiceDetail from "@/pages/ServiceDetail";
import Parts from "@/pages/Parts";
import Personnel from "@/pages/Personnel";
import Brands from "@/pages/Brands";
import AdminPanel from "@/pages/AdminPanel";
import Debug from "@/pages/Debug";
import NotFound from "@/pages/NotFound";
import Unauthorized from "@/pages/Unauthorized";

// Import components
import { ProtectedRoute } from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="system" storageKey="ui-theme">
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AuthProvider>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/unauthorized" element={<Unauthorized />} />

                {/* Protected routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/vehicles" element={
                  <ProtectedRoute>
                    <Vehicles />
                  </ProtectedRoute>
                } />
                <Route path="/customers" element={
                  <ProtectedRoute>
                    <Customers />
                  </ProtectedRoute>
                } />
                <Route path="/services" element={
                  <ProtectedRoute>
                    <Services />
                  </ProtectedRoute>
                } />
                <Route path="/services/:id" element={
                  <ProtectedRoute>
                    <ServiceDetail />
                  </ProtectedRoute>
                } />
                <Route path="/parts" element={
                  <ProtectedRoute>
                    <Parts />
                  </ProtectedRoute>
                } />
                <Route path="/personnel" element={
                  <ProtectedRoute>
                    <Personnel />
                  </ProtectedRoute>
                } />
                <Route path="/brands" element={
                  <ProtectedRoute>
                    <Brands />
                  </ProtectedRoute>
                } />
                <Route path="/debug" element={
                  <ProtectedRoute>
                    <Debug />
                  </ProtectedRoute>
                } />
                
                {/* Admin routes */}
                <Route path="/admin" element={
                  <ProtectedRoute>
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  </ProtectedRoute>
                } />

                {/* 404 page */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AuthProvider>
          </BrowserRouter>
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};

export default App;
