
import React, { useState, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Footer } from "@/components/ui/footer";
import { ModeToggle } from "@/components/mode-toggle";
import { Loader2 } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Layout = () => {
  const { userProfile, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isMobile = useIsMobile();
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

  // Guard clause for authentication and tenant verification
  if (!loading && !isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  if (loading || tenantVerificationLoading) {
    return (
      <div className="flex items-center justify-center h-screen p-4">
        <div className="flex flex-col items-center">
          <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground text-sm sm:text-base">Yükleniyor...</p>
        </div>
      </div>
    );
  }

  if (!isTenantVerified) {
    return <Navigate to="/unauthorized" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <SidebarInset className="flex flex-col w-full min-w-0">
          <header className="flex h-14 sm:h-16 shrink-0 items-center gap-2 border-b px-3 sm:px-4 lg:px-6">
            <SidebarTrigger className="-ml-1" />
            <div className="ml-auto flex items-center gap-2">
              <ModeToggle />
            </div>
          </header>
          <main className="flex-1 overflow-auto w-full">
            <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-6 lg:px-8 max-w-full">
              <Outlet />
            </div>
          </main>
          <Footer />
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
