
export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: "Ahmet Yılmaz",
      company: "İzmir Oto Servis",
      comment: "Carfy sayesinde servis süreçlerimiz çok daha düzenli hale geldi. Müşterilerimiz de memnuniyetleri arttı."
    },
    {
      name: "Ayşe Kaya",
      company: "Kaya Otomotiv",
      comment: "Kullanımı çok kolay bir arayüz, tüm servis işlemlerimizi tek bir platformdan yönetebiliyoruz. Kesinlikle tavsiye ederim."
    },
    {
      name: "Mehmet Demir",
      company: "Demir Oto",
      comment: "Parça takibi ve servis planlaması konusunda bize çok yardımcı oluyor. Artık hiçbir işlem gözden kaçmıyor."
    }
  ];

  return (
    <section className="py-20">
      <div className="container">
        <h2 className="text-3xl font-semibold font-poppins mb-12 text-center">Müşterilerimiz Ne Diyor?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, i) => (
            <div key={i} className="bg-muted/30 rounded-xl p-6 shadow">
              <div className="flex items-center mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="#FFCA28" stroke="none">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <p className="italic text-muted-foreground mb-4">{testimonial.comment}</p>
              <div className="font-medium">{testimonial.name}</div>
              <div className="text-sm text-muted-foreground">{testimonial.company}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
