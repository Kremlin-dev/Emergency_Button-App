"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { database } from "@/config/firebaseConfig";
import { ref, onValue } from "firebase/database";
import { Emergency } from "@/types";

// Function to create icons using an online URL
const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `/${color}-marker.png`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30],
  });

const categoryColors: { [key: string]: string } = {
  "Fire Alert": "red",
  "Medical Emergency": "blue",
  "Security Alert": "yellow",
  "Other Emergency": "gray",
};

export default function EmergencyMap() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([]);
  const router = useRouter();

  useEffect(() => {
    const emergenciesRef = ref(database, "emergencies");

    onValue(emergenciesRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const formattedEmergencies: Emergency[] = [];

        for (const employeeId in data) {
          for (const emergencyId in data[employeeId]) {
            formattedEmergencies.push({
              id: emergencyId,
              ...data[employeeId][emergencyId],
            });
          }
        }

        setEmergencies(formattedEmergencies);
      }
    });
  }, []);

  console.log("hello", emergencies);

  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={[6.1872951, -1.6922085]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {emergencies.map((incident) => (
          <Marker
            key={incident._id}
            position={[incident.location?.lat, incident.location?.lng]}
            icon={createIcon(categoryColors[incident.category])}
          >
            <Popup>
              <div
                onClick={() => router.push(`/emergencies/${incident._id}`)}
                className="text-sm"
              >
                <p className="font-bold">{incident.companyName}</p>
                <p>Category: {incident.category}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
