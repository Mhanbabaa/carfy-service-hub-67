
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, userProfile, loading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [tenantVerified, setTenantVerified] = useState<boolean | null>(null);

  // Handle password change requirement
  useEffect(() => {
    if (!loading && isAuthenticated() && user?.user_metadata?.must_change_password === true) {
      if (location.pathname !== '/change-password') {
        navigate('/change-password');
      }
    }
  }, [loading, isAuthenticated, user, location.pathname, navigate]);

  useEffect(() => {
    // Verify tenant access
    if (!loading && userProfile) {
      // Check if user has a valid tenant ID
      setTenantVerified(!!userProfile.tenant_id);
    }
  }, [loading, userProfile]);

  if (loading || tenantVerified === null) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!tenantVerified) {
    return <Navigate to="/unauthorized" replace />;
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

  return children ? <>{children}</> : <Outlet />;
};
