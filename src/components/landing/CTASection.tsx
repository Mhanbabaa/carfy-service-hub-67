
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section id="contact" className="py-20 bg-primary/10">
      <div className="container text-center">
        <h2 className="text-3xl font-semibold font-poppins mb-6">Hemen Başlayın</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
          Carfy ile servis süreçlerinizi dijitalleştirin ve işletmenizi bir adım öne taşıyın.
        </p>
        <Button size="lg" className="text-base" onClick={() => navigate("/login")}>
          Ücretsiz Deneyin
        </Button>
      </div>
    </section>
  );
};
