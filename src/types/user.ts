export type User = {
  id: string;
  tenant_id: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  phone: string | null;
  role: 'admin' | 'technician' | 'consultant' | 'accounting' | 'superadmin';
  status?: string;
  created_at?: string | null;
  updated_at?: string | null;
}; 