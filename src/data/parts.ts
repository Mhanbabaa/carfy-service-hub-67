
import { Part } from "@/types/part";
import { v4 as uuidv4 } from 'uuid';
import { mockServices } from "./services";

// Mock data for parts
export const mockParts: Part[] = [
  {
    id: uuidv4(),
    name: "Yağ Filtresi",
    code: "YF-123",
    quantity: 1,
    unitPrice: 120,
    serviceId: mockServices[0].id,
    serviceReference: `${mockServices[0].plateNumber} - ${mockServices[0].make} ${mockServices[0].model}`
  },
  {
    id: uuidv4(),
    name: "Motor Yağı (4L)",
    code: "MY-456",
    quantity: 1,
    unitPrice: 450,
    serviceId: mockServices[0].id,
    serviceReference: `${mockServices[0].plateNumber} - ${mockServices[0].make} ${mockServices[0].model}`
  },
  {
    id: uuidv4(),
    name: "Ön Fren Balatası",
    code: "FB-789",
    quantity: 2,
    unitPrice: 350,
    serviceId: mockServices[1].id,
    serviceReference: `${mockServices[1].plateNumber} - ${mockServices[1].make} ${mockServices[1].model}`
  },
  {
    id: uuidv4(),
    name: "Arka Fren Diski",
    code: "FD-101",
    quantity: 2,
    unitPrice: 650,
    serviceId: mockServices[1].id,
    serviceReference: `${mockServices[1].plateNumber} - ${mockServices[1].make} ${mockServices[1].model}`
  },
  {
    id: uuidv4(),
    name: "Klima Gazı",
    code: "KG-202",
    quantity: 1,
    unitPrice: 250,
    serviceId: mockServices[2].id,
    serviceReference: `${mockServices[2].plateNumber} - ${mockServices[2].make} ${mockServices[2].model}`
  },
  {
    id: uuidv4(),
    name: "Polen Filtresi",
    code: "PF-303",
    quantity: 1,
    unitPrice: 180,
    serviceId: mockServices[2].id,
    serviceReference: `${mockServices[2].plateNumber} - ${mockServices[2].make} ${mockServices[2].model}`
  },
  {
    id: uuidv4(),
    name: "Alternatör",
    code: "AL-404",
    quantity: 1,
    unitPrice: 2500,
    serviceId: mockServices[3].id,
    serviceReference: `${mockServices[3].plateNumber} - ${mockServices[3].make} ${mockServices[3].model}`
  },
  {
    id: uuidv4(),
    name: "Direksiyon Pompası",
    code: "DP-505",
    quantity: 1,
    unitPrice: 1750,
    serviceId: mockServices[4].id,
    serviceReference: `${mockServices[4].plateNumber} - ${mockServices[4].make} ${mockServices[4].model}`
  },
  {
    id: uuidv4(),
    name: "Radyatör",
    code: null,
    quantity: 1,
    unitPrice: 1200,
    serviceId: mockServices[5].id,
    serviceReference: `${mockServices[5].plateNumber} - ${mockServices[5].make} ${mockServices[5].model}`
  },
  {
    id: uuidv4(),
    name: "Antifriz",
    code: "AF-606",
    quantity: 2,
    unitPrice: 120,
    serviceId: mockServices[5].id,
    serviceReference: `${mockServices[5].plateNumber} - ${mockServices[5].make} ${mockServices[5].model}`
  }
];
