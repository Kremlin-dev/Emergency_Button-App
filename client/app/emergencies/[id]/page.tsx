"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { database } from "@/config/firebaseConfig";
import { ref, onValue, off } from "firebase/database";
import { Emergency } from "@/types";
import Loader from "@/components/molecule/Loader";

const EmergencyId = () => {
  const { id } = useParams();
  const router = useRouter();

  const [incident, setIncident] = useState<Emergency | null>(null);
  const [loading, setLoading] = useState(true);
  const [action, setAction] = useState("");
  const [actionsList, setActionsList] = useState<string[]>([]);

  useEffect(() => {
    const savedActions = localStorage.getItem(`actions-${id}`);
    if (savedActions) {
      setActionsList(JSON.parse(savedActions));
    }
  }, [id]);

  useEffect(() => {
    if (!id) return;

    const emergencyRef = ref(database, `emergencies/${id}`);
    const unsubscribe = onValue(emergencyRef, (snapshot) => {
      if (snapshot.exists()) {
        setIncident({ id, ...snapshot.val() });
      } else {
        router.push("/404");
      }
      setLoading(false);
    });

    return () => off(emergencyRef, "value", unsubscribe);
  }, [id, router]);

  const handleAddAction = () => {
    if (action.trim() === "") return;
    const updatedActions = [...actionsList, action];
    setActionsList(updatedActions);
    localStorage.setItem(`actions-${id}`, JSON.stringify(updatedActions));
    setAction("");
  };

  if (loading) return <Loader/>;
  if (!incident) return <p>Emergency not found</p>;

  return (
    <main className="flex flex-col md:flex-row justify-center p-4 gap-6">
      <div className="w-full md:w-1/3 bg-gray-100 p-4 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Emergency Details</h2>

        <label className="block text-sm font-semibold text-gray-500">
          Category:
        </label>
        <input
          type="text"
          value={incident.category || "N/A"}
          readOnly
          className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md bg-gray-200"
        />

        <label className="block text-sm font-semibold text-gray-500">
          Status:
        </label>
        <input
          type="text"
          value={incident.status || "Unknown"}
          readOnly
          className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md bg-gray-200 outline-none"
        />

        <div className="">
          <h2 className="text-lg font-bold mb-2">Actions Taken</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter action taken"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              className="w-full px-2 py-1 border border-gray-300 rounded-md outline-none"
            />
            <button
              onClick={handleAddAction}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>

          <ul className="mt-4 space-y-2">
            {actionsList.map((act, index) => (
              <li key={index} className="">
                {act}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="w-full md:w-2/3">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">
          Emergency ID: {incident.id} - {incident.companyName}
        </h1>

        {incident.location?.lat && incident.location?.lng ? (
          <iframe
            src={`https://www.google.com/maps?q=${incident.location.lat},${incident.location.lng}&hl=en&z=14&output=embed`}
            width="100%"
            height="450"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
          ></iframe>
        ) : (
          <p className="text-red-500">
            No location data available for this emergency.
          </p>
        )}
      </div>
    </main>
  );
};

export default EmergencyId;
