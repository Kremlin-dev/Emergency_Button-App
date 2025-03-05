"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { emergencyData } from "@/data";
import L from "leaflet";

// Fix Leaflet marker issue with Next.js
const customIcon = new L.Icon({
  iconUrl: "/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const EmergencyId = () => {
  const [incident, setIncident] = useState<any | null>(null);
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) return;

    const incidentId = parseInt(id as string, 10);
    const selectedIncident = emergencyData.find(
      (item) => item.id === incidentId
    );

    if (!selectedIncident) {
      router.push("/404");
    } else {
      setIncident(selectedIncident);
    }
  }, [id, router]);

  if (!incident) return <p>Loading...</p>;

  return (
    <main className="flex justify-center">
      <h1 className="text-2xl font-bold text-gray-900 px-3 mt-4">
        Emergency ID: {incident.id} - {incident.name}
      </h1>

      <div className="w-full md:w-2/3 mt-4">
        <iframe
          src={`https://www.google.com/maps?q=${incident.lat},${incident.lng}&hl=es;z=14&output=embed`}
          width="100%"
          height="450"
          style={{ border: "0" }}
          allowFullScreen
          loading="lazy"
        ></iframe>
      </div>
    </main>
  );
};

export default EmergencyId;
