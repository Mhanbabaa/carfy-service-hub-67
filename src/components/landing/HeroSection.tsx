
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CarFront, ChevronRight } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-28 container animate-fade-in">
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="space-y-6 sm:space-y-8 text-center lg:text-left order-2 lg:order-1">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-poppins leading-tight">
            Araç Servisiniz için 
            <span className="block text-primary">Eksiksiz Yönetim</span>
            <span className="block">Çözümü</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
            Servis süreçlerinizi dijitalleştirin, müşteri memnuniyetini artırın ve işlerinizi daha verimli yönetin
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 justify-center lg:justify-start">
            <Button 
              size="lg" 
              className="text-base h-12 sm:h-11 px-6 sm:px-8" 
              onClick={() => navigate("/signup")}
            >
              Hemen Başlayın
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="text-base h-12 sm:h-11 px-6 sm:px-8"
            >
              Nasıl Çalışır
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative order-1 lg:order-2">
          <div className="rounded-xl overflow-hidden shadow-2xl border mx-auto max-w-lg lg:max-w-none">
            <img
              src="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80"
              alt="Carfy Dashboard"
              className="w-full h-auto"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 sm:-bottom-4 sm:-right-4 bg-primary/10 rounded-full p-3 sm:p-4 hidden sm:block">
            <CarFront className="h-6 w-6 sm:h-8 sm:w-8 lg:h-10 lg:w-10 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};
