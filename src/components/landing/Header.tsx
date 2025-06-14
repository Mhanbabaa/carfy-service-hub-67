
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { CarFront, Menu, X } from "lucide-react";

export const Header = () => {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center text-primary">
              <CarFront className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold font-poppins">Carfy</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-sm font-medium transition-colors hover:text-primary">
              Özellikler
            </a>
            <a href="#product" className="text-sm font-medium transition-colors hover:text-primary">
              Ürün
            </a>
            <a href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
              Fiyatlar
            </a>
            <a href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
              İletişim
            </a>
          </nav>

          <div className="flex items-center gap-4">
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

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="fixed right-0 top-0 h-full w-3/4 max-w-sm bg-background p-6 shadow-lg">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center text-primary">
                <CarFront className="h-6 w-6" />
                <span className="ml-2 text-xl font-bold font-poppins">Carfy</span>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="flex flex-col gap-6">
              <a 
                href="#features" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Özellikler
              </a>
              <a 
                href="#product" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Ürün
              </a>
              <a 
                href="#pricing" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Fiyatlar
              </a>
              <a 
                href="#contact" 
                className="text-base font-medium transition-colors hover:text-primary"
                onClick={() => setMobileMenuOpen(false)}
              >
                İletişim
              </a>
              <div className="flex flex-col gap-2 mt-4">
                <Button variant="outline" className="w-full" onClick={() => navigate("/login")}>
                  Giriş Yap
                </Button>
                <Button className="w-full" onClick={() => navigate("/signup")}>
                  Kaydol
                </Button>
              </div>
            </nav>
          </div>
        </div>
      )}
    </>
  );
};
