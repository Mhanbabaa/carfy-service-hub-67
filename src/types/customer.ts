import { Customer as DatabaseCustomer } from "@/types/database.types";

// Vehicle information interface
export interface VehicleData {
  id?: string;
  licensePlate: string;
  chassisNumber?: string | null;
  brand: string;
  brandId?: string;
  model: string;
  modelId?: string;
  year: string;
  mileage: string;
  underWarranty: boolean;
}

// Extended Customer interface with backward compatibility fields
export interface Customer extends Omit<DatabaseCustomer, 'tenant_id'> {
  tenant_id?: string; // Make tenant_id optional to fix type mismatch
  // Legacy fields for backward compatibility
  firstName?: string;
  lastName?: string;
  vehicleCount?: number;
  // Vehicle data
  vehicle?: VehicleData;
}

// Function to convert between naming conventions
export const normalizeCustomer = (customer: any): Customer => {
  return {
    ...customer,
    // Legacy fields for backward compatibility with UI components
    firstName: customer.first_name || customer.firstName,
    lastName: customer.last_name || customer.lastName,
    // Ensure primary fields are set correctly
    first_name: customer.first_name || customer.firstName,
    last_name: customer.last_name || customer.lastName,
  };
};
