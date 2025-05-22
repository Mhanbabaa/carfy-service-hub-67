
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
  tenant?: {
    id: string;
    name: string;
    address?: string;
    phone?: string;
    email?: string;
    logo_url?: string;
    created_at?: string;
    updated_at?: string;
  };
  
  // Return the user's full name
  fullName: string;
};

// Helper function to get full name from user data
export function getFullName(user: Pick<User, 'first_name' | 'last_name' | 'email'>): string {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  } else if (user.first_name) {
    return user.first_name;
  } else if (user.last_name) {
    return user.last_name;
  } else {
    return user.email;
  }
}
