
import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { GlassmorphismSidebar } from "./glassmorphism-sidebar";
import { Loader2 } from "lucide-react";

const GlassmorphismLayout = () => {
  const { user, userProfile, signOut, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isTenantVerified, setIsTenantVerified] = useState(false);
  const [tenantVerificationLoading, setTenantVerificationLoading] = useState(true);

  // Verify tenant access
  useEffect(() => {
    const verifyTenantAccess = async () => {
      if (!loading && userProfile) {
        // Check if user has a valid tenant ID
        if (userProfile.tenant_id) {
          setIsTenantVerified(true);
        } else {
          toast({
            variant: "destructive",
            title: "Erişim Hatası",
            description: "Bu hesap bir servis merkezi ile ilişkilendirilmemiş.",
          });
          // Redirect to unauthorized page
          navigate("/unauthorized");
        }
        setTenantVerificationLoading(false);
      }
    };

    verifyTenantAccess();
  }, [loading, userProfile, navigate, toast]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  // Guard clause for authentication and tenant verification
  if (!loading && !isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (loading || tenantVerificationLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isTenantVerified) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <div className="glassmorphism-layout min-h-screen">
      <GlassmorphismSidebar 
        userProfile={userProfile}
        user={user}
        onSignOut={handleSignOut}
      />
      
      {/* Ana İçerik Alanı */}
      <main className="main-content transition-all duration-300 ease-in-out">
        <div className="container mx-auto px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default GlassmorphismLayout;
