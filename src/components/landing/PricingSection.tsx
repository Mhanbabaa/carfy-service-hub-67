
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

export const PricingSection = () => {
  const navigate = useNavigate();
  const [isYearly, setIsYearly] = useState(false);

  return (
    <section id="pricing" className="py-12 sm:py-16 md:py-20 bg-muted/50">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-poppins mb-3 sm:mb-4">
            Size Uygun Planı Seçin
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
            Her büyüklükteki servis işletmesi için uygun fiyatlandırma seçenekleri
          </p>
          <div className="inline-flex items-center rounded-full border p-1 mt-6 sm:mt-8">
            <button 
              className={`rounded-full px-3 sm:px-4 py-2 text-sm font-medium transition-colors ${
                !isYearly ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
              onClick={() => setIsYearly(false)}
            >
              Aylık
            </button>
            <button 
              className={`rounded-full px-3 sm:px-4 py-2 text-sm font-medium transition-colors ${
                isYearly ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
              }`}
              onClick={() => setIsYearly(true)}
            >
              Yıllık 
              <span className="text-xs ml-1 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 rounded-full px-2 py-0.5">
                %20 indirim
              </span>
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <div className="bg-background rounded-xl border shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow">
            <h3 className="text-xl sm:text-2xl font-semibold font-poppins mb-3 sm:mb-4">
              Ücretsiz Plan
            </h3>
            <div className="flex items-baseline mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-bold font-poppins">₺0</span>
              <span className="text-muted-foreground ml-1 text-sm">/{isYearly ? 'yıl' : 'ay'}</span>
            </div>
            <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              {[
                "Temel araç ve müşteri takibi", 
                "Servis işlemleri görüntüleme", 
                "Sınırlı raporlar", 
                "7 günlük deneme süresi"
              ].map((feature, i) => (
                <li key={i} className="flex items-start text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              variant="outline" 
              className="w-full h-11 sm:h-10" 
              onClick={() => navigate("/login")}
            >
              Ücretsiz Deneyin
            </Button>
          </div>

          {/* Standard Plan */}
          <div className="bg-background rounded-xl border shadow-md p-6 sm:p-8 hover:shadow-lg transition-shadow relative">
            <div className="absolute top-0 right-0 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-tr-xl rounded-bl-xl">
              Önerilen
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold font-poppins mb-3 sm:mb-4">
              Standart Plan
            </h3>
            <div className="flex items-baseline mb-4 sm:mb-6">
              <span className="text-3xl sm:text-4xl font-bold font-poppins">
                ₺{isYearly ? '4,799' : '499'}
              </span>
              <span className="text-muted-foreground ml-1 text-sm">/{isYearly ? 'yıl' : 'ay'}</span>
              {isYearly && (
                <span className="ml-2 text-xs sm:text-sm text-green-600 dark:text-green-400 font-medium">
                  (%20 indirim)
                </span>
              )}
            </div>
            {isYearly && (
              <div className="mb-3 sm:mb-4 text-xs sm:text-sm text-muted-foreground">
                <span className="line-through">₺5,988</span>
                <span className="ml-2 text-green-600 dark:text-green-400">₺1,189 tasarruf</span>
              </div>
            )}
            <ul className="space-y-2 sm:space-y-3 mb-6 sm:mb-8">
              {[
                "Tam araç ve müşteri takibi",
                "Servis işlemleri yönetimi",
                "Temel raporlar ve analizler",
                "E-posta ve SMS bildirimleri",
                "Sınırsız kullanıcı"
              ].map((feature, i) => (
                <li key={i} className="flex items-start text-sm sm:text-base">
                  <Check className="h-4 w-4 sm:h-5 sm:w-5 text-primary shrink-0 mr-2 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <Button 
              className="w-full h-11 sm:h-10" 
              onClick={() => navigate("/login")}
            >
              Hemen Başlayın
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
