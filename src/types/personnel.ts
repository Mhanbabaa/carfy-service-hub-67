
export type PersonnelRole = 'admin' | 'technician' | 'consultant' | 'accountant';
export type PersonnelStatus = 'active' | 'inactive';

export interface Personnel {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  phone: string;
  role: PersonnelRole;
  status: PersonnelStatus;
  createdAt: Date;
}

export const getRoleLabel = (role: PersonnelRole): string => {
  switch (role) {
    case "admin": return "Yönetici";
    case "technician": return "Teknisyen";
    case "consultant": return "Danışman";
    case "accountant": return "Muhasebe";
    default: return "Bilinmiyor";
  }
};

export const getRoleColor = (role: PersonnelRole): string => {
  switch (role) {
    case "admin": return "bg-purple-500";
    case "technician": return "bg-blue-500";
    case "consultant": return "bg-green-500";
    case "accountant": return "bg-orange-500";
    default: return "bg-gray-500";
  }
};

export const getStatusLabel = (status: PersonnelStatus): string => {
  switch (status) {
    case "active": return "Aktif";
    case "inactive": return "Pasif";
    default: return "Bilinmiyor";
  }
};

export const getStatusColor = (status: PersonnelStatus): string => {
  switch (status) {
    case "active": return "bg-green-500";
    case "inactive": return "bg-gray-400";
    default: return "bg-gray-500";
  }
};
