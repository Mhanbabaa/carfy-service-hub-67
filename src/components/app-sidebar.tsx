import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Car,
  Home,
  Settings,
  Users,
  Wrench,
  Package,
  UserCog,
  CarFront,
  ChevronUp,
  LogOut,
  User,
  Lock,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

interface SidebarLinkProps {
  to: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
}

function SidebarLink({ to, icon: Icon, label, isActive }: SidebarLinkProps) {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className={cn(isActive && "bg-sidebar-accent")}>
        <Link to={to} className="flex items-center gap-3">
          <Icon className="h-5 w-5" />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function AppSidebar() {
  const location = useLocation();
  const currentPath = location.pathname;
  const { userProfile, signOut } = useAuth();
  const navigate = useNavigate();
  
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const getInitials = (firstName?: string | null, lastName?: string | null, email?: string) => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
    } else if (firstName) {
      return firstName.charAt(0).toUpperCase();
    } else if (lastName) {
      return lastName.charAt(0).toUpperCase();
    } else if (email) {
      return email.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getUserDisplayName = () => {
    if (userProfile?.first_name && userProfile?.last_name) {
      return `${userProfile.first_name} ${userProfile.last_name}`;
    } else if (userProfile?.first_name) {
      return userProfile.first_name;
    } else if (userProfile?.last_name) {
      return userProfile.last_name;
    } else {
      return userProfile?.email || "Kullanıcı";
    }
  };
  
  return (
    <Sidebar className="border-r">
      <SidebarHeader className="border-b py-4">
        <div className="px-4 font-semibold text-lg">
          Carfy Servis Hub
        </div>
      </SidebarHeader>
      
      <SidebarContent className="py-3">
        <SidebarGroup>
          <SidebarGroupLabel>Ana Menü</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink 
                to="/dashboard" 
                icon={Home} 
                label="Kontrol Paneli" 
                isActive={currentPath === "/dashboard"} 
              />
              <SidebarLink 
                to="/vehicles" 
                icon={Car} 
                label="Araçlar" 
                isActive={currentPath.startsWith("/vehicles")} 
              />
              <SidebarLink 
                to="/customers" 
                icon={Users} 
                label="Müşteriler" 
                isActive={currentPath.startsWith("/customers")} 
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        
        <SidebarGroup>
          <SidebarGroupLabel>Servis</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink 
                to="/services" 
                icon={Wrench} 
                label="Servis İşlemleri" 
                isActive={currentPath.startsWith("/services")} 
              />
              <SidebarLink 
                to="/parts" 
                icon={Package} 
                label="Servis Parçaları" 
                isActive={currentPath.startsWith("/parts")} 
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Yönetim</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink 
                to="/personnel" 
                icon={UserCog} 
                label="Personel" 
                isActive={currentPath.startsWith("/personnel")} 
              />
              <SidebarLink 
                to="/brands" 
                icon={CarFront} 
                label="Marka ve Modeller" 
                isActive={currentPath.startsWith("/brands")} 
              />
              <SidebarLink 
                to="/settings" 
                icon={Settings} 
                label="Ayarlar" 
                isActive={currentPath.startsWith("/settings")} 
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="px-3 py-4 border-t border-sidebar-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start h-auto p-2 hover:bg-sidebar-accent"
            >
              <div className="flex items-center gap-3 w-full">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {getInitials(userProfile?.first_name, userProfile?.last_name, userProfile?.email)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col items-start text-sm flex-1">
                  <span className="font-medium truncate max-w-[120px]">
                    {getUserDisplayName()}
                  </span>
                  <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                    {userProfile?.email}
                  </span>
                </div>
                <ChevronUp className="h-4 w-4 text-muted-foreground" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Hesap Ayarları</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate('/profile')}>
              <User className="mr-2 h-4 w-4" />
              <span>Profil Bilgileri</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate('/change-password')}>
              <Lock className="mr-2 h-4 w-4" />
              <span>Şifre Değiştir</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Çıkış Yap</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <div className="text-xs text-muted-foreground mt-2">
          &copy; {new Date().getFullYear()} Carfy Otomotiv
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
