import { useState, useEffect } from 'react';
import { TelemetryService } from '@/services/TelemetryService';
import { useLocationStore } from '@/store/locationStore';
import type { TelemetrySnapshot } from '@/types';

export function useTelemetry() {
  const { location } = useLocationStore();
  const [data, setData] = useState<TelemetrySnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchTelemetry = async () => {
      if (!location) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await TelemetryService.getTelemetry(location);
        if (isMounted) {
          setData(response.data);
          setError(response.error);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to fetch telemetry');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchTelemetry();

    return () => {
      isMounted = false;
    };
  }, [location]);

  return { data, loading, error };
}
