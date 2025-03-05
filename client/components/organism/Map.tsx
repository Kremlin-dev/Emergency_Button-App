"use client"; 

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";
import { emergencyData } from "@/data";
import L from "leaflet";

// Custom Leaflet Icon Fix
const customIcon = new L.Icon({
  iconUrl: "/location.jpg", 
  iconSize: [25, 41], 
  iconAnchor: [12, 41], 
  popupAnchor: [1, -34],
  shadowUrl: "/marker-shadow.png", 
  shadowSize: [41, 41], 
});

export default function EmergencyMap() {
  const router = useRouter();

  return (
    <div className="h-screen w-full">
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
            icon={customIcon} 
            eventHandlers={{
              click: () => router.push(`/emergencies/${incident.id}`),
            }}
          >
            <Popup>{incident.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
