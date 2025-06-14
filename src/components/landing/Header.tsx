
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CarFront, Menu, X } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";

export const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const navigationItems = [
    { href: "#features", label: "Özellikler" },
    { href: "#product", label: "Ürün" },
    { href: "#pricing", label: "Fiyatlar" },
    { href: "#contact", label: "İletişim" },
  ];

  const MobileMenu = () => (
    <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <DrawerTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="flex items-center justify-center text-primary">
            <CarFront className="h-6 w-6 mr-2" />
            Carfy
          </DrawerTitle>
        </DrawerHeader>
        <div className="px-4 pb-6 space-y-4">
          <nav className="flex flex-col space-y-4">
            {navigationItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-lg font-medium text-center py-3 px-4 rounded-lg hover:bg-accent transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="flex flex-col gap-3 pt-4">
            <Button
              variant="outline"
              className="w-full h-12 text-base"
              onClick={() => {
                navigate("/login");
                setMobileMenuOpen(false);
              }}
            >
              Giriş Yap
            </Button>
            <Button
              className="w-full h-12 text-base"
              onClick={() => {
                navigate("/signup");
                setMobileMenuOpen(false);
              }}
            >
              Kaydol
            </Button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 sm:h-16 items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <div className="flex items-center text-primary">
            <CarFront className="h-6 w-6 sm:h-8 sm:w-8" />
            <span className="ml-2 text-lg sm:text-xl font-bold font-poppins">Carfy</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navigationItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium transition-colors hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle />
          <Button
            variant="outline"
            className="hidden md:flex"
            onClick={() => navigate("/login")}
          >
            Giriş Yap
          </Button>
          <Button
            className="hidden md:flex"
            onClick={() => navigate("/signup")}
          >
            Kaydol
          </Button>

          {/* Mobile menu */}
          <MobileMenu />
        </div>
      </div>
    </header>
  );
};
