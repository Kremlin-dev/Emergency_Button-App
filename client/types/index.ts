

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
type WorkNotes = {
  note: string;
}

export type Emergency = {
  id: string;
  category: string;
  companyName: string;
  createdAt: string;
  emergencyId: string;
  employeeId: string;
  location: Location;
  work_notes: WorkNotes[];
  phone: string;
  status: string;
  _id: string;
};
