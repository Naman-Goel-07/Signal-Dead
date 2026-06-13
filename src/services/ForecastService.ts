import type { ForecastWindow, ApiResponse } from '@/types';
import type { Location } from '@/types';

/**
 * Service for fetching GNSS degradation forecasts.
 */
export class ForecastService {
  /**
   * Fetch 24-hour forecast window for a given location.
   * TODO: Implement actual API call to the backend.
   */
  static async get24hForecast(location: Location): Promise<ApiResponse<ForecastWindow>> {
    console.log(`[Architecture] Fetching forecast for ${location.locationName}`);
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Architecture only: returning empty state to trigger UI skeletons/loading
    return {
      data: null,
      error: null,
      loading: false,
      timestamp: new Date().toISOString()
    };
  }
}
