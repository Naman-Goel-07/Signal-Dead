import { useState, useEffect } from 'react';
import { ForecastService } from '@/services/ForecastService';
import { useLocationStore } from '@/store/locationStore';
import type { ForecastWindow } from '@/types';

export function useForecast() {
  const { location } = useLocationStore();
  const [data, setData] = useState<ForecastWindow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchForecast = async () => {
      if (!location) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await ForecastService.get24hForecast(location);
        if (isMounted) {
          setData(response.data);
          setError(response.error);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to fetch forecast');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchForecast();

    return () => {
      isMounted = false;
    };
  }, [location]);

  return { data, loading, error };
}
