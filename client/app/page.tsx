"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/molecule/Loader";
import { columns } from "@/components/organism/EmergencyCulomns";
import { database } from "@/config/firebaseConfig";
import { ref, onValue, off } from "firebase/database";
import { Emergency } from "@/types";
import { EmergencyTable } from "@/components/organism/EmergencyTable";

const ResolvedEmergenciesPage = () => {
  const [resolvedEmergencies, setResolvedEmergencies] = useState<Emergency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const emergenciesRef = ref(database, "emergencies");

    const unsubscribe = onValue(emergenciesRef, (snapshot) => {
      if (!snapshot.exists()) {
        setResolvedEmergencies([]);
        setLoading(false);
        return;
      }

      const data = snapshot.val();
      const formattedEmergencies: Emergency[] = Object.entries(data)
        .map(([emergencyId, details]: any) => ({
          id: emergencyId,
          category: details.category,
          companyName: details.companyName,
          createdAt: details.createdAt,
          emergencyId: details.emergencyId,
          employeeId: details.employeeId,
          ...details,
        }))
        .filter((emergency) => emergency.status === "resolved"); 

      setResolvedEmergencies(formattedEmergencies);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Error:", error);
      setError("Failed to fetch emergencies");
      setLoading(false);
    });

    return () => off(emergenciesRef, "value", unsubscribe);
  }, []);

  if (loading) return <Loader />;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <main className="p-4 bg-black/5 min-h-screen">
      <section className="p-4">
        <h2 className="text-xl font-bold mb-4">Resolved Emergencies</h2>
        <EmergencyTable data={resolvedEmergencies} columns={columns} />
      </section>
    </main>
  );
};

export default ResolvedEmergenciesPage;
