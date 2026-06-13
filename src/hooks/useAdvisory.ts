import { useState, useEffect } from 'react';
import { AdvisoryService } from '@/services/AdvisoryService';
import { useLocationStore } from '@/store/locationStore';
import type { AdvisoryCard } from '@/types';

export function useAdvisory() {
  const { location } = useLocationStore();
  const [data, setData] = useState<AdvisoryCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchAdvisories = async () => {
      if (!location) return;
      
      setLoading(true);
      setError(null);
      
      try {
        const response = await AdvisoryService.getAdvisories(location);
        if (isMounted) {
          setData(response.data || []);
          setError(response.error);
        }
      } catch (err: any) {
        if (isMounted) setError(err.message || 'Failed to fetch advisories');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchAdvisories();

    return () => {
      isMounted = false;
    };
  }, [location]);

  return { data, loading, error };
}
