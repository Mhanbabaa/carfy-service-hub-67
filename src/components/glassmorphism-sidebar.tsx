
import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  CarFront,
  Cpu
} from "lucide-react";

// Navigation items configuration
const navItems = [
  { path: "/dashboard", label: "Kontrol Paneli", icon: Home },
  { path: "/vehicles", label: "Araçlar", icon: Car },
  { path: "/customers", label: "Müşteriler", icon: Users },
  { path: "/services", label: "Servis İşlemleri", icon: Wrench },
  { path: "/parts", label: "Servis Parçaları", icon: Package },
  { path: "/brands", label: "Marka ve Modeller", icon: CarFront },
  { path: "/personnel", label: "Personel", icon: User },
];

// Debug items (only visible to superadmin)
const debugItems = [
  { path: "/debug", label: "Hata Ayıklama", icon: Cpu }
];

interface GlassmorphismSidebarProps {
  userProfile: any;
  user: any;
  onSignOut: () => void;
}

export function GlassmorphismSidebar({ userProfile, user, onSignOut }: GlassmorphismSidebarProps) {
  const { pathname } = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && systemDark);
    
    setIsDarkMode(shouldBeDark);
    document.body.classList.toggle('dark-mode', shouldBeDark);
  }, []);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleTheme = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  const isSuperAdmin = userProfile?.role === "superadmin";

  return (
    <aside 
      className={cn(
        "glassmorphism-sidebar flex flex-col transition-all duration-300 ease-in-out",
        isCollapsed ? "w-20" : "w-64"
      )}
      style={{
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        background: "var(--sidebar-bg)",
        backdropFilter: "blur(15px)",
        border: "1px solid var(--sidebar-border)",
        borderRadius: "0 16px 16px 0"
      }}
    >
      {/* Üst Bölüm - Servis Bilgisi */}
      <div className="sidebar-header p-4 border-b border-sidebar-border">
        {!isCollapsed ? (
          <div>
            <h2 className="text-lg font-semibold text-sidebar-text">
              {userProfile?.tenant?.name || 'Aydeniz Oto'}
            </h2>
            <p className="text-sm text-sidebar-text-muted">Carfy Servis</p>
            <p className="text-xs text-sidebar-text-muted">{user?.email}</p>
          </div>
        ) : (
          <div className="flex justify-center">
            <Wrench className="h-6 w-6 text-sidebar-text" />
          </div>
        )}
      </div>

      {/* Orta Bölüm - Navigasyon Menüsü */}
      <nav className="flex-1 p-3 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
          const Icon = item.icon;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "nav-item flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-white text-primary shadow-md" 
                  : "text-sidebar-text hover:bg-sidebar-hover",
                isCollapsed && "justify-center"
              )}
            >
              <Icon className="h-5 w-5 flex-shrink-0" />
              {!isCollapsed && (
                <span className="font-medium">{item.label}</span>
              )}
            </Link>
          );
        })}

        {isSuperAdmin && (
          <>
            <div className={cn(
              "mt-6 pt-4 border-t border-sidebar-border",
              isCollapsed && "border-transparent"
            )}>
              {!isCollapsed && (
                <p className="text-xs font-semibold text-sidebar-text-muted mb-2 px-3">
                  YÖNETİCİ ARAÇLARI
                </p>
              )}
              
              <Link
                to="/admin"
                className={cn(
                  "nav-item flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                  pathname === "/admin" || pathname.startsWith("/admin/")
                    ? "bg-white text-primary shadow-md" 
                    : "text-sidebar-text hover:bg-sidebar-hover",
                  isCollapsed && "justify-center"
                )}
              >
                <Settings className="h-5 w-5 flex-shrink-0" />
                {!isCollapsed && (
                  <span className="font-medium">Yönetim Paneli</span>
                )}
              </Link>

              {debugItems.map((item) => {
                const isActive = pathname === item.path || pathname.startsWith(item.path + "/");
                const Icon = item.icon;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={cn(
                      "nav-item flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200",
                      isActive 
                        ? "bg-white text-primary shadow-md" 
                        : "text-sidebar-text hover:bg-sidebar-hover",
                      isCollapsed && "justify-center"
                    )}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && (
                      <span className="font-medium">{item.label}</span>
                    )}
                  </Link>
                );
              })}
            </div>
          </>
        )}
      </nav>

      {/* Alt Bölüm - Aksiyon Düğmeleri */}
      <div className="sidebar-footer p-3 border-t border-sidebar-border space-y-2">
        {/* Tema Değiştirme Düğmesi */}
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          onClick={toggleTheme}
          className={cn(
            "w-full justify-start text-sidebar-text hover:bg-sidebar-hover",
            isCollapsed && "justify-center"
          )}
        >
          {isDarkMode ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
          {!isCollapsed && (
            <span className="ml-2">
              {isDarkMode ? "Aydınlık Mod" : "Karanlık Mod"}
            </span>
          )}
        </Button>

        {/* Çıkış Düğmesi */}
        <Button
          variant="ghost"
          size={isCollapsed ? "icon" : "default"}
          onClick={onSignOut}
          className={cn(
            "w-full justify-start text-sidebar-text hover:bg-sidebar-hover",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {!isCollapsed && <span className="ml-2">Çıkış</span>}
        </Button>

        {/* Genişlet/Daralt Düğmesi */}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleCollapse}
          className="w-full text-sidebar-text hover:bg-sidebar-hover"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
    </aside>
  );
}
