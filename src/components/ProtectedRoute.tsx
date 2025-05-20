
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, userProfile, loading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle password change requirement
  useEffect(() => {
    if (!loading && isAuthenticated() && user?.user_metadata?.must_change_password === true) {
      if (location.pathname !== '/change-password') {
        navigate('/change-password');
      }
    }
  }, [loading, isAuthenticated, user, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If user must change password, enforce redirect
  if (user?.user_metadata?.must_change_password === true) {
    if (location.pathname !== '/change-password') {
      return <Navigate to="/change-password" replace />;
    }
  }

  // If specific roles are required, check if user has the right role
  if (allowedRoles && allowedRoles.length > 0 && userProfile) {
    const hasRequiredRole = allowedRoles.includes(userProfile.role);
    if (!hasRequiredRole) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <Outlet />;
};
