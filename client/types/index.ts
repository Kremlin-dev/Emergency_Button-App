export interface EmergenciesProps {
  emergencyId: number;
  employeeId: string;
  category: string;
  status: "Resolved" | "Pending" | "Ongoing"
  dateCreated: string;
}

export interface EmployeeProps {
  employeeId: string;
  name: string;
  department: string
  email: string;
}

type Location = {
  accuracy: number;
  lat: number;
  lng: number;
};

export type Emergency = {
  id: string;
  category: string;
  companyName: string;
  createdAt: string;
  emergencyId: string;
  employeeId: string;
  location: Location;
  phone: string;
  status: string;
  _id: string;
};
