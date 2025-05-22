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
  const location = useLocation();
  const currentPath = location.pathname;
  
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
        <div className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} Carfy Otomotiv
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
