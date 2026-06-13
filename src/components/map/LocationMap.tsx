import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useLocationStore } from '@/store/locationStore';

// Fix Leaflet's default icon path issues in React
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Component to dynamically update map center when location changes
const MapUpdater: React.FC<{ lat: number; lon: number }> = ({ lat, lon }) => {
  const map = useMap();
  useEffect(() => {
    map.flyTo([lat, lon], 10, { duration: 1.5 });
  }, [lat, lon, map]);
  return null;
};

export const LocationMap: React.FC = () => {
  const { location } = useLocationStore();

  if (!location) {
    return (
      <div className="w-full h-full min-h-[300px] flex items-center justify-center bg-surface-2 border border-border-dim rounded-lg text-white/50 font-heading tracking-widest text-sm">
        NO COORDINATES ACQUIRED
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[300px] rounded-lg overflow-hidden border border-neon-cyan/20 shadow-glow-cyan relative z-0">
      <MapContainer 
        center={[location.latitude, location.longitude]} 
        zoom={10} 
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={[location.latitude, location.longitude]} />
        <MapUpdater lat={location.latitude} lon={location.longitude} />
      </MapContainer>
      
      {/* Aerospace overlay */}
      <div className="absolute inset-0 pointer-events-none border-2 border-neon-cyan/30 rounded-lg z-[400]" />
      <div className="absolute top-4 right-4 bg-surface-0/80 backdrop-blur-md px-3 py-1 border border-neon-cyan/50 rounded font-mono text-xs text-neon-cyan z-[400]">
        LAT: {location.latitude.toFixed(4)}<br/>
        LON: {location.longitude.toFixed(4)}
      </div>
    </div>
  );
};
