
export const IntegrationsSection = () => {
  return (
    <section className="py-20">
      <div className="container text-center">
        <h2 className="text-3xl font-semibold font-poppins mb-6">Entegre Çalışan Sistemler</h2>
        <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
          Carfy, kullandığınız diğer sistemlerle sorunsuz entegre olur.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted/30 rounded-lg p-6 flex items-center justify-center h-24">
              <div className="text-xl font-medium text-muted-foreground">Logo {i}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
