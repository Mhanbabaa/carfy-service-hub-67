export type ServiceStatus = 
  | "waiting" 
  | "in_progress" 
  | "completed" 
  | "delivered" 
  | "cancelled";

export interface ServicePart {
  id: string;
  name: string;
  code?: string;
  quantity: number;
  unitPrice: number;
}

export interface ServiceHistory {
  id: string;
  date: Date;
  action: string;
  user: string;
  description: string;
}

export interface ServiceHistoryItem {
  id: string;
  date: Date;
  action: string;
  user: string;
  description: string;
}

export interface ServiceDB {
  id: string;
  tenant_id: string;
  vehicle_id: string;
  status: ServiceStatus;
  labor_cost: number;
  parts_cost: number;
  total_cost: number;
  complaint: string;
  work_done: string;
  arrival_date: string;
  delivery_date?: string;
  created_at: string;
  updated_at: string;
  technician_id?: string;
  
  // Fields from service_details view
  plate_number?: string;
  brand_name?: string;
  model_name?: string;
  year?: number;
  mileage?: number;
  customer_name?: string;
  technician_name?: string;
}

export interface Service {
  id: string;
  vehicleId?: string;
  plateNumber: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
  customerName: string;
  status: ServiceStatus;
  laborCost: number;
  partsCost: number;
  totalCost: number;
  technician: string;
  complaint: string;
  servicePerformed: string;
  parts: ServicePart[];
  history: ServiceHistory[];
  arrivalDate: Date;
  deliveryDate?: Date;
}

export const getStatusLabel = (status: ServiceStatus): string => {
  switch (status) {
    case "waiting": return "Bekliyor";
    case "in_progress": return "Devam Ediyor";
    case "completed": return "Tamamlandı";
    case "delivered": return "Teslim Edildi";
    case "cancelled": return "İptal Edildi";
    default: return "Bilinmiyor";
  }
};

export const getStatusColor = (status: ServiceStatus): string => {
  switch (status) {
    case "waiting": return "bg-amber-500";
    case "in_progress": return "bg-blue-500";
    case "completed": return "bg-green-500";
    case "delivered": return "bg-purple-500";
    case "cancelled": return "bg-red-500";
    default: return "bg-gray-500";
  }
};

export const mapServiceFromDB = (dbService: ServiceDB, parts: ServicePart[] = []): Service => {
  return {
    id: dbService.id,
    vehicleId: dbService.vehicle_id,
    plateNumber: dbService.plate_number || 'Bilinmiyor',
    make: dbService.brand_name || 'Bilinmiyor',
    model: dbService.model_name || 'Bilinmiyor',
    year: dbService.year || 0,
    mileage: dbService.mileage || 0,
    customerName: dbService.customer_name || 'Bilinmiyor',
    status: dbService.status as ServiceStatus,
    laborCost: Number(dbService.labor_cost) || 0,
    partsCost: Number(dbService.parts_cost) || 0,
    totalCost: Number(dbService.total_cost) || 0,
    technician: dbService.technician_name || 'Atanmadı',
    complaint: dbService.complaint || '',
    servicePerformed: dbService.work_done || '',
    parts: parts,
    history: generateMockHistory(dbService.id, new Date(dbService.created_at), dbService.status),
    arrivalDate: new Date(dbService.arrival_date),
    deliveryDate: dbService.delivery_date ? new Date(dbService.delivery_date) : undefined
  };
};

// Helper function to generate mock history for services from the database
// This will be replaced with real history data when available
const generateMockHistory = (serviceId: string, createdDate: Date, status: ServiceStatus): ServiceHistory[] => {
  const history: ServiceHistory[] = [];
  
  history.push({
    id: `history-${serviceId}-1`,
    date: createdDate,
    action: "Servis Kaydı Oluşturuldu",
    user: "Sistem",
    description: "Araç servise kabul edildi."
  });
  
  if (status !== "waiting") {
    const inProgressDate = new Date(createdDate);
    inProgressDate.setHours(createdDate.getHours() + 2);
    
    history.push({
      id: `history-${serviceId}-2`,
      date: inProgressDate,
      action: "Servis Başladı",
      user: "Sistem",
      description: "Araç kontrolü ve onarıma başlandı."
    });
  }
  
  if (status === "completed" || status === "delivered") {
    const completedDate = new Date(createdDate);
    completedDate.setHours(createdDate.getHours() + 8);
    
    history.push({
      id: `history-${serviceId}-3`,
      date: completedDate,
      action: "Servis Tamamlandı",
      user: "Sistem",
      description: "Araca yapılan işlemler tamamlandı, test edildi."
    });
  }
  
  if (status === "delivered") {
    const deliveredDate = new Date(createdDate);
    deliveredDate.setHours(createdDate.getHours() + 10);
    
    history.push({
      id: `history-${serviceId}-4`,
      date: deliveredDate,
      action: "Araç Teslim Edildi",
      user: "Sistem",
      description: "Araç müşteriye teslim edildi."
    });
  }
  
  if (status === "cancelled") {
    const cancelDate = new Date(createdDate);
    cancelDate.setDate(createdDate.getDate() + 1);
    
    history.push({
      id: `history-${serviceId}-2`,
      date: cancelDate,
      action: "Servis İptal Edildi",
      user: "Sistem",
      description: "İptal nedeni: Müşteri talebi."
    });
  }
  
  return history;
};
