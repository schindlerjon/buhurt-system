import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default marker icons not resolving correctly when bundled
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function MapPage() {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    // Guard: don't create a second map if one already exists on this element
    if (mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current).setView([31.0, -99.0], 6);
    mapInstanceRef.current = map;

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    fetch("/api/teams")
      .then((response) => response.json())
      .then((teams) => {
        teams.forEach((team) => {
          L.marker([team.latitude, team.longitude])
            .addTo(map)
            .bindPopup(`<strong>${team.name}</strong><br>${team.city}, ${team.state}`);
        });
      })
      .catch((error) => console.error("Failed to load teams:", error));

    // Cleanup function: runs if this component ever unmounts (e.g., navigating away)
    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  return (
    <div>
      <h1>Team Locations</h1>
      <div ref={mapContainerRef} className="map-container"></div>
    </div>
  );
}

export default MapPage;