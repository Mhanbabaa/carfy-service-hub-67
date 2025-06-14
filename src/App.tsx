
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
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import GlassmorphismLayout from "@/components/glassmorphism-layout";

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

                {/* Protected routes with glassmorphism layout */}
                <Route path="/" element={
                  <ProtectedRoute>
                    <GlassmorphismLayout />
                  </ProtectedRoute>
                }>
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="vehicles" element={<Vehicles />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="services" element={<Services />} />
                  <Route path="services/:id" element={<ServiceDetail />} />
                  <Route path="parts" element={<Parts />} />
                  <Route path="personnel" element={<Personnel />} />
                  <Route path="brands" element={<Brands />} />
                  <Route path="debug" element={<Debug />} />
                  
                  {/* Admin routes */}
                  <Route path="admin" element={
                    <AdminRoute>
                      <AdminPanel />
                    </AdminRoute>
                  } />
                </Route>

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
