
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
  
  // Return the user's full name
  get fullName(): string {
    if (this.first_name && this.last_name) {
      return `${this.first_name} ${this.last_name}`;
    } else if (this.first_name) {
      return this.first_name;
    } else if (this.last_name) {
      return this.last_name;
    } else {
      return this.email;
    }
  }
};
