
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const { isAuthenticated, userProfile, loading, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [tenantVerified, setTenantVerified] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Handle password change requirement
  useEffect(() => {
    try {
      if (!loading && isAuthenticated() && user?.user_metadata?.must_change_password === true) {
        if (location.pathname !== '/change-password') {
          navigate('/change-password');
        }
      }
    } catch (err: any) {
      console.error("Error in password change detection:", err);
      setError(err.message);
    }
  }, [loading, isAuthenticated, user, location.pathname, navigate]);

  useEffect(() => {
    // Verify tenant access
    try {
      if (!loading && userProfile) {
        // Check if user has a valid tenant ID
        setTenantVerified(!!userProfile.tenant_id);
      }
    } catch (err: any) {
      console.error("Error in tenant verification:", err);
      setError(err.message);
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

  // Handle specific error cases
  if (error && error.includes("supabase_auth")) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center max-w-md text-center">
          <div className="bg-destructive/20 p-3 rounded-full mb-4">
            <AlertCircle className="h-8 w-8 text-destructive" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Sistem Bakımda</h2>
          <p className="text-muted-foreground mb-4">
            Şu anda sistem bakım çalışmaları nedeniyle erişim kısıtlıdır. Lütfen daha sonra tekrar deneyin veya yöneticinize başvurun.
          </p>
          <Button onClick={() => navigate("/login", { replace: true })}>Giriş Sayfasına Dön</Button>
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
