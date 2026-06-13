import { useState, useEffect } from 'react';
import { MissionStatusService } from '@/services/MissionStatusService';
import { useLocationStore } from '@/store/locationStore';
import type { MissionStatus } from '@/types';

export function useMissionStatus() {
  const { location } = useLocationStore();
  const [data, setData] = useState<MissionStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchStatus = async () => {
      if (!location) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await MissionStatusService.getStatus(location);
        if (isMounted) {
          setData(response.data);
          setError(response.error);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to fetch mission status');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStatus();

    return () => {
      isMounted = false;
    };
  }, [location]);

  return { data, loading, error };
}
