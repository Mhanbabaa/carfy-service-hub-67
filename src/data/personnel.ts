
import { Personnel } from "@/types/personnel";
import { v4 as uuidv4 } from 'uuid';

// Mock data for personnel
export const mockPersonnel: Personnel[] = [
  {
    id: uuidv4(),
    firstName: "Ahmet",
    lastName: "Yılmaz",
    username: "ahmet.yilmaz",
    email: "ahmet.yilmaz@example.com",
    phone: "0532 123 4567",
    role: "admin",
    status: "active",
    createdAt: new Date(2023, 1, 15)
  },
  {
    id: uuidv4(),
    firstName: "Mehmet",
    lastName: "Kaya",
    username: "mehmet.kaya",
    email: "mehmet.kaya@example.com",
    phone: "0533 234 5678",
    role: "technician",
    status: "active",
    createdAt: new Date(2023, 3, 20)
  },
  {
    id: uuidv4(),
    firstName: "Ayşe",
    lastName: "Demir",
    username: "ayse.demir",
    email: "ayse.demir@example.com",
    phone: "0535 345 6789",
    role: "consultant",
    status: "active",
    createdAt: new Date(2023, 5, 10)
  },
  {
    id: uuidv4(),
    firstName: "Fatma",
    lastName: "Çelik",
    username: "fatma.celik",
    email: "fatma.celik@example.com",
    phone: "0536 456 7890",
    role: "accountant",
    status: "active",
    createdAt: new Date(2023, 7, 5)
  },
  {
    id: uuidv4(),
    firstName: "Ali",
    lastName: "Öztürk",
    username: "ali.ozturk",
    email: "ali.ozturk@example.com",
    phone: "0537 567 8901",
    role: "technician",
    status: "inactive",
    createdAt: new Date(2023, 2, 25)
  },
  {
    id: uuidv4(),
    firstName: "Zeynep",
    lastName: "Yıldız",
    username: "zeynep.yildiz",
    email: "zeynep.yildiz@example.com",
    phone: "0538 678 9012",
    role: "consultant",
    status: "active",
    createdAt: new Date(2023, 4, 15)
  },
  {
    id: uuidv4(),
    firstName: "Mustafa",
    lastName: "Şahin",
    username: "mustafa.sahin",
    email: "mustafa.sahin@example.com",
    phone: "0539 789 0123",
    role: "technician",
    status: "active",
    createdAt: new Date(2023, 6, 1)
  },
  {
    id: uuidv4(),
    firstName: "Hüseyin",
    lastName: "Arslan",
    username: "huseyin.arslan",
    email: "huseyin.arslan@example.com",
    phone: "0530 890 1234",
    role: "accountant",
    status: "inactive",
    createdAt: new Date(2023, 8, 12)
  }
];

export const getPersonnelById = (id: string): Personnel | undefined => {
  return mockPersonnel.find(person => person.id === id);
};
