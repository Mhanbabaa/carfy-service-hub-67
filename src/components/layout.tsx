import React, { useState, useEffect } from "react";
import { Link, Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/mode-toggle";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { 
  Menu, 
  Car, 
  Users, 
  Wrench, 
  Package, 
  User, 
  LogOut, 
  Settings, 
  Home, 
  ChevronDown, 
  Loader2 
} from "lucide-react";

// Navigation items configuration
const navItems = [
  { path: "/dashboard", label: "Kontrol Paneli", icon: <Home className="h-5 w-5" /> },
  { path: "/vehicles", label: "Araçlar", icon: <Car className="h-5 w-5" /> },
  { path: "/customers", label: "Müşteriler", icon: <Users className="h-5 w-5" /> },
  { path: "/services", label: "Servis İşlemleri", icon: <Wrench className="h-5 w-5" /> },
  { path: "/parts", label: "Servis Parçaları", icon: <Package className="h-5 w-5" /> },
  { path: "/personnel", label: "Personel", icon: <User className="h-5 w-5" /> },
];

const Layout = () => {
  const { user, userProfile, signOut, isAuthenticated, loading } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex h-full w-64 flex-col border-r bg-background">
        <div className="flex h-14 items-center gap-2 border-b px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Wrench className="h-5 w-5 text-primary" />
            <span>Carfy Servis</span>
          </div>
        </div>
        <nav className="flex-1 overflow-auto py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
              Servis Merkezi
            </h2>
            <div className="px-4 mb-4">
              <div className="font-medium">{userProfile?.tenant?.name || 'Servis Merkezi'}</div>
              <div className="text-xs text-muted-foreground">{user?.email}</div>
            </div>
            <Separator className="mb-4" />
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.path || pathname === item.path + "/"
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {userProfile?.role === "admin" && (
            <div className="px-3 py-2">
              <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
                Yönetici Araçları
              </h2>
              <div className="space-y-1">
                <Link
                  to="/admin"
                  className={cn(
                    "flex items-center gap-3 rounded-md px-4 py-2 text-sm font-medium transition-colors",
                    pathname === "/admin" || pathname === "/admin/"
                      ? "bg-primary text-primary-foreground"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  <Settings className="h-5 w-5" />
                  Yönetim Paneli
                </Link>
              </div>
            </div>
          )}
        </nav>
        <div className="sticky bottom-0 border-t bg-background p-4">
          <div className="flex items-center justify-between">
            <ModeToggle />
            <Button
              variant="outline"
              size="icon"
              onClick={handleSignOut}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </aside>

      {/* Mobile Navigation */}
      <div className="flex min-h-screen flex-col lg:hidden">
        <header className="sticky top-0 flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px]">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] sm:w-[300px]">
              <nav className="flex flex-col gap-5 h-full pb-12">
                <div className="flex h-14 items-center gap-2 font-semibold">
                  <Wrench className="h-5 w-5 text-primary" />
                  <span>Carfy Servis</span>
                </div>
                <div className="px-2">
                  <div className="mb-2">
                    <div className="font-medium">{userProfile?.tenant?.name || 'Servis Merkezi'}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                  <Separator className="mb-4" />
                  <div className="space-y-1">
                    {navItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          pathname === item.path || pathname === item.path + "/"
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
                {userProfile?.role === "admin" && (
                  <div className="px-2">
                    <h2 className="mb-2 px-2 text-xs font-semibold tracking-tight text-muted-foreground">
                      Yönetici Araçları
                    </h2>
                    <div className="space-y-1">
                      <Link
                        to="/admin"
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                          pathname === "/admin" || pathname === "/admin/"
                            ? "bg-primary text-primary-foreground"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        <Settings className="h-5 w-5" />
                        Yönetim Paneli
                      </Link>
                    </div>
                  </div>
                )}

                <div className="mt-auto flex items-center justify-between px-2">
                  <ModeToggle />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={handleSignOut}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="flex items-center gap-2 font-semibold">
            <Wrench className="h-5 w-5 text-primary" />
            <span>Carfy Servis</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <div className="flex items-center cursor-pointer">
              <div className="mr-2 text-sm hidden sm:block">{userProfile?.tenant?.name || 'Servis Merkezi'}</div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
            <ModeToggle />
          </div>
        </header>

        <div className="px-4 md:px-6 lg:px-8 py-6 flex-1">
          <Outlet />
        </div>
      </div>

      {/* Main Content for Desktop */}
      <main className="hidden lg:block flex-1 overflow-y-auto">
        <div className="px-8 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
