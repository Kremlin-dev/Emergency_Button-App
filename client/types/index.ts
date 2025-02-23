export interface EmergenciesProps {
  emergencyId: number;
  employeeId: number;
  category: string;
  status: "Resolved" | "Pending" | "Ongoing"
  dateCreated: string;
}
