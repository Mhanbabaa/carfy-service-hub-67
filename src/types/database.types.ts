
export interface Tenant {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  tenant_id: string;
  first_name: string | null;
  last_name: string | null;
  email: string;
  phone: string | null;
  role: 'admin' | 'technician' | 'consultant' | 'accounting';
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  tenant?: Tenant;
}

export interface Brand {
  id: string;
  tenant_id: string;
  name: string;
  logo_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Model {
  id: string;
  tenant_id: string;
  brand_id: string;
  name: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  tenant_id: string;
  first_name: string;
  last_name: string;
  phone: string;
  email: string | null;
  address: string | null;
  created_at: string;
  updated_at: string;
}

export interface Vehicle {
  id: string;
  tenant_id: string;
  customer_id: string;
  brand_id: string;
  model_id: string;
  plate_number: string;
  chassis_number: string | null;
  year: number | null;
  mileage: number | null;
  under_warranty: boolean;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  tenant_id: string;
  vehicle_id: string;
  technician_id: string | null;
  status: 'waiting' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';
  complaint: string | null;
  work_done: string | null;
  mileage: number | null;
  labor_cost: number;
  parts_cost: number;
  total_cost: number;
  arrival_date: string;
  delivery_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServicePart {
  id: string;
  tenant_id: string;
  service_id: string;
  part_name: string;
  part_code: string | null;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  updated_at: string;
}

export interface ServiceHistory {
  id: string;
  tenant_id: string;
  service_id: string;
  user_id: string;
  action: string;
  description: string | null;
  created_at: string;
}

export interface VehicleDetails {
  id: string;
  tenant_id: string;
  plate_number: string;
  chassis_number: string | null;
  year: number | null;
  mileage: number | null;
  under_warranty: boolean;
  brand_name: string;
  model_name: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  service_count: number;
  last_service_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface ServiceDetails {
  id: string;
  tenant_id: string;
  status: 'waiting' | 'in_progress' | 'completed' | 'delivered' | 'cancelled';
  complaint: string | null;
  work_done: string | null;
  mileage: number | null;
  labor_cost: number;
  parts_cost: number;
  total_cost: number;
  arrival_date: string;
  delivery_date: string | null;
  plate_number: string;
  brand_name: string;
  model_name: string;
  year: number | null;
  customer_name: string;
  customer_phone: string;
  technician_name: string | null;
  parts_count: number;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  tenant_id: string;
  active_vehicles: number;
  delivered_this_month: number;
  monthly_revenue: number;
  yearly_revenue: number;
}
