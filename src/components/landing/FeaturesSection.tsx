
export const FeaturesSection = () => {
  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 bg-muted/50">
      <div className="container px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 sm:mb-20 lg:mb-24">
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-poppins">
              Tüm Servis Süreçlerinizi Tek Platformda Yönetin
            </h2>
            <div className="h-1 w-16 sm:w-20 bg-primary rounded-full mx-auto lg:mx-0"></div>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              Araç kabulünden teslime kadar tüm servis süreçlerinizi dijital ortamda takip edin. Müşteri bilgileri, araç detayları, servis geçmişi ve daha fazlası tek bir platformda.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg border mx-auto max-w-md lg:max-w-none">
            <img
              src="/lovable-uploads/798dc57e-8d0e-482a-bb63-7a932a2e2fbc.png"
              alt="Servis Analitikleri - Mobil Dashboard Görünümü"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 sm:mb-20 lg:mb-24">
          <div className="rounded-xl overflow-hidden shadow-lg border lg:order-1 order-2 mx-auto max-w-md lg:max-w-none">
            <img
              src="/lovable-uploads/315684ae-3c8c-4737-9fea-3d6f8e250541.png"
              alt="Araç Servis Yönetimi - Tablet Kullanımı"
              className="w-full h-auto"
            />
          </div>
          <div className="space-y-4 sm:space-y-6 lg:order-2 order-1 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-poppins">
              Araç ve Müşteri Takibi
            </h2>
            <div className="h-1 w-16 sm:w-20 bg-primary rounded-full mx-auto lg:mx-0"></div>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              Müşteri ve araç bilgilerini kolayca kaydedin, güncelleyin ve yönetin. Araç geçmişini anında görüntüleyin, müşteri iletişimini güçlendirin.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mb-16 sm:mb-20 lg:mb-24">
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold font-poppins">
              Servis İşlemleri ve Parça Yönetimi
            </h2>
            <div className="h-1 w-16 sm:w-20 bg-primary rounded-full mx-auto lg:mx-0"></div>
            <p className="text-muted-foreground text-sm sm:text-base lg:text-lg">
              Servis işlemlerini detaylı olarak kaydedin, parça kullanımını takip edin. Teknisyen atamaları, durum güncellemeleri ve fiyatlandırma tek bir ekranda.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg border mx-auto max-w-md lg:max-w-none">
            <img
              src="/lovable-uploads/60675309-8e5e-4ac3-9e41-43248daa6415.png"
              alt="Servis Yönetim Dashboard - Araç ve Gelir Takibi"
              className="w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
