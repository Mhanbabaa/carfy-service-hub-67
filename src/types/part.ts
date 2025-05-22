
export interface Part {
  id: string;
  name: string;
  code: string | null;
  quantity: number;
  unitPrice: number;
  serviceId: string;
  serviceReference: string;
  servicePlateNumber?: string;
  serviceVehicleName?: string;
  serviceStatus?: string;
}
