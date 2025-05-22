import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const AdminRoute: React.FC = () => {
  const { userProfile, loading } = useAuth();

  // Yükleme sırasında beklet
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  // Sadece superadmin rolüne sahip kullanıcıların erişimine izin ver
  if (userProfile?.role !== 'superadmin') {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default AdminRoute; 