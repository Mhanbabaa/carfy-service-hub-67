
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section id="contact" className="py-12 sm:py-16 md:py-20 bg-primary/10">
      <div className="container text-center px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-poppins mb-4 sm:mb-6">
          Hemen Başlayın
        </h2>
        <p className="text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg">
          Carfy ile servis süreçlerinizi dijitalleştirin ve işletmenizi bir adım öne taşıyın.
        </p>
        <Button 
          size="lg" 
          className="text-base h-12 sm:h-11 px-6 sm:px-8" 
          onClick={() => navigate("/login")}
        >
          Ücretsiz Deneyin
        </Button>
      </div>
    </section>
  );
};
