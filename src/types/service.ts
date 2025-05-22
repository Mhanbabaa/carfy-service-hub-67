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
