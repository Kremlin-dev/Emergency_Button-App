"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { database } from "@/config/firebaseConfig";
import { ref, onValue, off } from "firebase/database";
import { Emergency } from "@/types";

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

    const unsubscribe = onValue(emergenciesRef, (snapshot) => {
      if (!snapshot.exists()) {
        setEmergencies([]);
        return;
      }

      const data = snapshot.val();

      const formattedEmergencies: Emergency[] = Object.entries(data).map(
        ([emergencyId, details]: any) => ({
          id: emergencyId,
          ...details,
        })
      );

      setEmergencies(formattedEmergencies);
    });

    return () => off(emergenciesRef, "value", unsubscribe);
  }, []);

  console.log("hello", emergencies);

  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={[6.1799848, -1.6776174]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {emergencies.map((incident) => {
          if (!incident.location?.lat || !incident.location?.lng) return null;

          return (
            <div key={incident._id}>
              <Marker
                key={incident.emergencyId}
                position={[incident.location?.lat, incident.location?.lng]}
                icon={createIcon(
                  categoryColors[incident.category.trim()] || "blue"
                )}
              >
                <Popup>
                  <div
                    onClick={() =>
                      router.push(`/emergencies/${incident?.emergencyId}`)
                    }
                    className="text-sm cursor-pointer"
                  >
                    <p className="font-bold">{incident.companyName}</p>
                    <p>Category: {incident.category}</p>
                  </div>
                </Popup>
              </Marker>
            </div>
          );
        })}
      </MapContainer> 

    </div>
  );
}
