
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CarFront, ChevronRight } from "lucide-react";

export const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 md:py-28 container animate-fade-in">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-8">
          <h1 className="text-4xl md:text-5xl font-bold font-poppins leading-tight">
            Araç Servisiniz için Eksiksiz Yönetim Çözümü
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground">
            Servis süreçlerinizi dijitalleştirin, müşteri memnuniyetini artırın ve işlerinizi daha verimli yönetin
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button size="lg" className="text-base" onClick={() => navigate("/signup")}>
              Hemen Başlayın
            </Button>
            <Button size="lg" variant="outline" className="text-base">
              Nasıl Çalışır
              <ChevronRight className="ml-1 h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="relative">
          <div className="rounded-xl overflow-hidden shadow-2xl border">
            <img
              src="/placeholder.svg"
              alt="Carfy Dashboard"
              className="w-full h-auto"
            />
          </div>
          <div className="absolute -bottom-4 -right-4 bg-primary/10 rounded-full p-4 hidden md:block">
            <CarFront className="h-10 w-10 text-primary" />
          </div>
        </div>
      </div>
    </section>
  );
};
