import { useState } from 'react';
import { LocationService } from '@/services/LocationService';
import { useLocationStore } from '@/store/locationStore';
import type { NominatimResult } from '@/types';

export function useLocation() {
  const { location, setLocation } = useLocationStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const autoDetectLocation = async () => {
    setLoading(true);
    setError(null);
    try {
      const position = await LocationService.getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      const result = await LocationService.reverseGeocode(latitude, longitude);
      const name = result ? result.display_name : 'Auto-detected Location';
      
      setLocation({
        latitude,
        longitude,
        locationName: name,
      });
    } catch (err: any) {
      setError(err.message || 'Failed to auto-detect location');
    } finally {
      setLoading(false);
    }
  };

  const searchLocation = async (query: string): Promise<NominatimResult[]> => {
    setLoading(true);
    setError(null);
    try {
      return await LocationService.searchByName(query);
    } catch (err: any) {
      setError(err.message || 'Search failed');
      return [];
    } finally {
      setLoading(false);
    }
  };

  const selectManualLocation = (result: NominatimResult) => {
    setLocation({
      latitude: parseFloat(result.lat),
      longitude: parseFloat(result.lon),
      locationName: result.display_name,
    });
  };

  return {
    location,
    loading,
    error,
    autoDetectLocation,
    searchLocation,
    selectManualLocation,
  };
}
