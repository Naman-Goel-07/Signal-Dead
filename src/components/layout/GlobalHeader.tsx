import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocationStore } from '@/store/locationStore';

export const GlobalHeader: React.FC = () => {
  const { location, clearLocation } = useLocationStore();
  const navigate = useNavigate();

  if (!location) return null;

  const handleChangeLocation = () => {
    clearLocation();
    navigate('/');
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between p-4 md:px-8 border-b border-white/5 bg-surface-0/50 backdrop-blur-md">
      <div className="flex items-center space-x-3">
        <svg className="w-4 h-4 text-neon-cyan" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <div>
          <p className="text-xs font-heading tracking-widest text-white/50 uppercase leading-none mb-1">Current Location</p>
          <p className="text-sm font-body text-white/90 leading-none">{location.locationName}</p>
        </div>
      </div>
      
      <button
        onClick={handleChangeLocation}
        className="text-xs font-heading font-bold tracking-widest uppercase text-white/50 hover:text-white border border-white/10 hover:border-white/30 rounded px-3 py-1.5 transition-all focus:outline-none"
      >
        Change Location
      </button>
    </div>
  );
};
