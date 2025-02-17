export interface EmergenciesProps {
    id: number;
    subject: string;
    name: string;
    activities: string;
    status: "Hot Lead" | "Cold Lead" | "Warm Lead"; 
    created: string;
    sources: string;
  }