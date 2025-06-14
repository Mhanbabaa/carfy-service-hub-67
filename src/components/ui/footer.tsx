
export const Footer = () => {
  return (
    <footer className="border-t bg-background/80 backdrop-blur-sm py-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <h3 className="text-xl font-semibold text-primary mb-1 tracking-wide">CARFY</h3>
            <p className="text-sm text-muted-foreground font-light">
              Otomotiv Servis Yönetim Sistemi
            </p>
          </div>
          <div className="text-center md:text-right">
            <p className="text-sm text-muted-foreground font-light mb-1">
              &copy; {new Date().getFullYear()} CARFY Otomotiv. Tüm hakları saklıdır.
            </p>
            <p className="text-xs text-muted-foreground/80 font-light">
              Güvenilir ve profesyonel servis hizmetleri
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};
