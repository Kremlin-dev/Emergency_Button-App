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