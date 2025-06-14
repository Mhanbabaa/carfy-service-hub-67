
export const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 bg-muted/50">
      <div className="container">
        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold font-poppins">Tüm Servis Süreçlerinizi Tek Platformda Yönetin</h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
            <p className="text-muted-foreground">
              Araç kabulünden teslime kadar tüm servis süreçlerinizi dijital ortamda takip edin. Müşteri bilgileri, araç detayları, servis geçmişi ve daha fazlası tek bir platformda.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg border">
            <img
              src="/placeholder.svg"
              alt="Servis Yönetim Ekranı"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="rounded-xl overflow-hidden shadow-lg border md:order-1 order-2">
            <img
              src="/placeholder.svg"
              alt="Araç Takip Ekranı"
              className="w-full h-auto"
            />
          </div>
          <div className="space-y-6 md:order-2 order-1">
            <h2 className="text-3xl font-semibold font-poppins">Araç ve Müşteri Takibi</h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
            <p className="text-muted-foreground">
              Müşteri ve araç bilgilerini kolayca kaydedin, güncelleyin ve yönetin. Araç geçmişini anında görüntüleyin, müşteri iletişimini güçlendirin.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
          <div className="space-y-6">
            <h2 className="text-3xl font-semibold font-poppins">Servis İşlemleri ve Parça Yönetimi</h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
            <p className="text-muted-foreground">
              Servis işlemlerini detaylı olarak kaydedin, parça kullanımını takip edin. Teknisyen atamaları, durum güncellemeleri ve fiyatlandırma tek bir ekranda.
            </p>
          </div>
          <div className="rounded-xl overflow-hidden shadow-lg border">
            <img
              src="/placeholder.svg"
              alt="Servis İşlemleri Ekranı"
              className="w-full h-auto"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="rounded-xl overflow-hidden shadow-lg border md:order-1 order-2">
            <img
              src="/placeholder.svg"
              alt="Raporlar Ekranı"
              className="w-full h-auto"
            />
          </div>
          <div className="space-y-6 md:order-2 order-1">
            <h2 className="text-3xl font-semibold font-poppins">Detaylı Raporlar ve Analizler</h2>
            <div className="h-1 w-20 bg-primary rounded-full"></div>
            <p className="text-muted-foreground">
              İşletmenizin performansını gerçek zamanlı olarak izleyin. Gelir takibi, servis istatistikleri ve müşteri analizleri ile daha bilinçli kararlar alın.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
