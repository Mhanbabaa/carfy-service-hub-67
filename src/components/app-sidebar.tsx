
import { Link } from "react-router-dom";
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
  Car,
  Home,
  Settings,
  Users,
  Wrench,
  Package,
  UserCog,
  CarFront,
} from "lucide-react";

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
  // We'd typically get the current path from useLocation() to determine active link
  const currentPath = window.location.pathname;
  
  return (
    <Sidebar>
      <SidebarHeader className="py-6">
        <Link to="/" className="flex items-center px-3">
          <div className="flex items-center gap-2">
            <CarFront className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold text-primary">Carfy</h1>
          </div>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Genel</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarLink 
                to="/" 
                icon={Home} 
                label="Panel" 
                isActive={currentPath === "/"} 
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
                to="/staff" 
                icon={UserCog} 
                label="Personel" 
                isActive={currentPath.startsWith("/staff")} 
              />
              <SidebarLink 
                to="/vehicle-models" 
                icon={Car} 
                label="Araç Marka-Model" 
                isActive={currentPath.startsWith("/vehicle-models")} 
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
        <div className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Carfy Otomotiv
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
