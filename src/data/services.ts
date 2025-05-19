
import { Service, ServiceStatus } from "@/types/service";

// Generate random dates within a range
const getRandomDate = (start: Date, end: Date): Date => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
};

// Generate a random service status
const getRandomStatus = (): ServiceStatus => {
  const statuses: ServiceStatus[] = ["waiting", "in_progress", "completed", "delivered", "cancelled"];
  return statuses[Math.floor(Math.random() * statuses.length)];
};

// Generate random technician names
const getRandomTechnician = (): string => {
  const technicians = [
    "Ahmet Yılmaz", 
    "Mehmet Kaya", 
    "Ali Öztürk", 
    "Mustafa Demir", 
    "Hüseyin Çelik"
  ];
  return technicians[Math.floor(Math.random() * technicians.length)];
};

// Generate mock service data
export const generateMockServices = (count: number = 50): Service[] => {
  const services: Service[] = [];
  
  const makeModels = [
    { make: "Toyota", model: "Corolla" },
    { make: "Honda", model: "Civic" },
    { make: "Ford", model: "Focus" },
    { make: "Volkswagen", model: "Golf" },
    { make: "BMW", model: "3 Series" },
    { make: "Mercedes", model: "C-Class" },
    { make: "Audi", model: "A4" },
    { make: "Renault", model: "Megane" },
    { make: "Hyundai", model: "i20" },
    { make: "Kia", model: "Ceed" }
  ];
  
  const customers = [
    "Ayşe Yıldız",
    "Fatma Çetin",
    "Zeynep Koç",
    "Murat Aydın",
    "Emre Şahin",
    "Burak Yılmaz",
    "Deniz Kara",
    "Ceren Demir",
    "Serkan Öz",
    "Ece Tan"
  ];
  
  const complaints = [
    "Motor çalışırken anormal ses geliyor",
    "Fren pedalı yumuşak",
    "Klima soğutmuyor",
    "Direksiyonda titreşim var",
    "Vites geçişlerinde zorlanıyor",
    "Motor ısındığında stop ediyor",
    "Araç çalıştığında titriyor",
    "Far ayarı bozuk",
    "Yakıt tüketimi çok fazla",
    "Şanzıman yağı sızıntısı"
  ];
  
  const servicePerformed = [
    "Motor yağı ve filtresi değiştirildi",
    "Fren hidroliği yenilendi, kaliper temizliği yapıldı",
    "Klima gazı değiştirildi, filtre temizlendi",
    "Balans ayarı yapıldı, rotlar kontrol edildi",
    "Şanzıman yağı değiştirildi",
    "Termostat değiştirildi",
    "Motor takozları değiştirildi",
    "Far ayarı yapıldı",
    "Enjektör temizliği yapıldı",
    "Kaçak noktası tespit edilip onarıldı"
  ];
  
  const parts = [
    { name: "Yağ Filtresi", code: "YF-1001", quantity: 1, unitPrice: 120 },
    { name: "Hava Filtresi", code: "HF-2002", quantity: 1, unitPrice: 150 },
    { name: "Polen Filtresi", code: "PF-3003", quantity: 1, unitPrice: 180 },
    { name: "Yakıt Filtresi", code: "YKF-4004", quantity: 1, unitPrice: 200 },
    { name: "Motor Yağı (4L)", code: "MY-5005", quantity: 1, unitPrice: 450 },
    { name: "Fren Balatası (Ön Set)", code: "FB-6006", quantity: 1, unitPrice: 600 },
    { name: "Fren Balatası (Arka Set)", code: "FB-7007", quantity: 1, unitPrice: 500 },
    { name: "Amortisör (Ön)", code: "AM-8008", quantity: 2, unitPrice: 1200 },
    { name: "Amortisör (Arka)", code: "AM-9009", quantity: 2, unitPrice: 1000 },
    { name: "Triger Seti", code: "TS-1010", quantity: 1, unitPrice: 1500 }
  ];
  
  for (let i = 0; i < count; i++) {
    const selectedMakeModel = makeModels[Math.floor(Math.random() * makeModels.length)];
    const randomYear = 2010 + Math.floor(Math.random() * 14); // Years between 2010-2023
    const randomMileage = 10000 + Math.floor(Math.random() * 190000); // Between 10,000 - 200,000 km
    
    const status = getRandomStatus();
    const arrivalDate = getRandomDate(new Date(2023, 0, 1), new Date());
    
    let deliveryDate;
    if (status === "completed" || status === "delivered") {
      deliveryDate = new Date(arrivalDate);
      deliveryDate.setDate(arrivalDate.getDate() + Math.floor(Math.random() * 7) + 1); // 1-7 days after arrival
    }
    
    // Randomly select 1-3 parts
    const selectedParts = [];
    const usedPartIndexes = new Set<number>();
    
    const numParts = Math.floor(Math.random() * 3) + 1;
    for (let j = 0; j < numParts; j++) {
      let partIndex;
      do {
        partIndex = Math.floor(Math.random() * parts.length);
      } while (usedPartIndexes.has(partIndex));
      
      usedPartIndexes.add(partIndex);
      const part = parts[partIndex];
      const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 quantity
      
      selectedParts.push({
        id: `part-${i}-${j}`,
        name: part.name,
        code: part.code,
        quantity: quantity,
        unitPrice: part.unitPrice
      });
    }
    
    // Calculate costs
    const laborCost = 500 + Math.floor(Math.random() * 1500); // Between 500-2000 TL
    const partsCost = selectedParts.reduce((sum, part) => sum + (part.quantity * part.unitPrice), 0);
    
    // Create service history entries
    const history = [];
    history.push({
      id: `history-${i}-1`,
      date: arrivalDate,
      action: "Servis Kaydı Oluşturuldu",
      user: "Recep Kahraman",
      description: "Araç servise kabul edildi."
    });
    
    if (status !== "waiting") {
      const inProgressDate = new Date(arrivalDate);
      inProgressDate.setHours(arrivalDate.getHours() + Math.floor(Math.random() * 24) + 1);
      
      history.push({
        id: `history-${i}-2`,
        date: inProgressDate,
        action: "Servis Başladı",
        user: getRandomTechnician(),
        description: "Araç kontrolü ve onarıma başlandı."
      });
    }
    
    if (status === "completed" || status === "delivered") {
      const completedDate = new Date(deliveryDate!);
      completedDate.setHours(deliveryDate!.getHours() - Math.floor(Math.random() * 48) - 2);
      
      history.push({
        id: `history-${i}-3`,
        date: completedDate,
        action: "Servis Tamamlandı",
        user: getRandomTechnician(),
        description: "Araca yapılan işlemler tamamlandı, test edildi."
      });
    }
    
    if (status === "delivered") {
      history.push({
        id: `history-${i}-4`,
        date: deliveryDate!,
        action: "Araç Teslim Edildi",
        user: "Recep Kahraman",
        description: "Araç müşteriye teslim edildi."
      });
    }
    
    if (status === "cancelled") {
      const cancelDate = new Date(arrivalDate);
      cancelDate.setDate(arrivalDate.getDate() + Math.floor(Math.random() * 3) + 1);
      
      history.push({
        id: `history-${i}-2`,
        date: cancelDate,
        action: "Servis İptal Edildi",
        user: "Recep Kahraman",
        description: "Müşteri talebi üzerine servis iptal edildi."
      });
    }
    
    // Generate plate number
    const cities = ["34", "06", "35", "16", "07", "01", "09", "10", "42", "55"];
    const letters = "ABCDEFGHJKLMNPRSTUVYZ";
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    const randomLetters = letters.charAt(Math.floor(Math.random() * letters.length)) + 
                           letters.charAt(Math.floor(Math.random() * letters.length));
    const randomNumbers = Math.floor(Math.random() * 900) + 100;
    const plateNumber = `${randomCity} ${randomLetters} ${randomNumbers}`;
    
    services.push({
      id: `service-${i}`,
      plateNumber,
      make: selectedMakeModel.make,
      model: selectedMakeModel.model,
      year: randomYear,
      mileage: randomMileage,
      customerName: customers[Math.floor(Math.random() * customers.length)],
      status,
      laborCost,
      partsCost,
      totalCost: laborCost + partsCost,
      technician: getRandomTechnician(),
      complaint: complaints[Math.floor(Math.random() * complaints.length)],
      servicePerformed: servicePerformed[Math.floor(Math.random() * servicePerformed.length)],
      parts: selectedParts,
      history,
      arrivalDate,
      deliveryDate
    });
  }
  
  return services;
};

export const mockServices = generateMockServices();

export const getServiceById = (id: string): Service | undefined => {
  return mockServices.find(service => service.id === id);
};
