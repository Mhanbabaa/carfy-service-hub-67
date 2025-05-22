
// Database types for Supabase tables

export interface CarBrand {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface CarModel {
  id: string;
  name: string;
  brand_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone: string;
  address?: string;
  tenant_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TenantDetails {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  logo_url?: string;
  created_at?: string;
  updated_at?: string;
}
