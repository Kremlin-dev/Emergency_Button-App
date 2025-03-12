"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { emergencyData } from "@/data";
import L from "leaflet";

// Function to create icons based on category
const createIcon = (color: string) =>
  new L.Icon({
    iconUrl: `/${color}-marker.png`,
    iconSize: [40, 51],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });

const categoryColors: { [key: string]: string } = {
  Fire: "red",
  Medical: "blue",
  Security: "yellow",
  Other: "gray",
};

export default function EmergencyMap() {
  const [hoveredIncident, setHoveredIncident] = useState<any | null>(null);
  const [hoverPosition, setHoverPosition] = useState({ x: 0, y: 0 });
  const router = useRouter();

  return (
    <div className="h-screen w-full relative">
      <MapContainer
        center={[6.6932, -1.622]}
        zoom={13}
        className="h-full w-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {emergencyData.map((incident) => (
          <Marker
            key={incident.id}
            position={[incident.lat, incident.lng]}
            icon={createIcon(categoryColors[incident.category] || "blue")}
            eventHandlers={{
              mouseover: (e) => {
                setHoveredIncident(incident);
                setHoverPosition({
                  x: e.containerPoint.x,
                  y: e.containerPoint.y - 20,
                });
              },
              mouseout: () => setHoveredIncident(null),
            }}
          >
            <Popup>
              <div
                onClick={() =>
                  router.push(`/emergencies/${hoveredIncident.id}`)
                }
                className="text-sm cursor-pointer"
              >
                <p className="font-bold">{incident.name}</p>
                <p>Category: {incident.category}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
