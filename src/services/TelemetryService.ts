import type { TelemetrySnapshot, ApiResponse } from '@/types';
import type { Location } from '@/types';

/**
 * Service for fetching real-time GNSS telemetry data.
 */
export class TelemetryService {
  /**
   * Fetch current telemetry snapshot for a given location.
   * TODO: Implement actual API call to the backend.
   */
  static async getTelemetry(location: Location): Promise<ApiResponse<TelemetrySnapshot>> {
    console.log(`[Architecture] Fetching telemetry for ${location.locationName}`);
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Architecture only: returning empty state to trigger UI skeletons/loading
    return {
      data: null,
      error: null,
      loading: false,
      timestamp: new Date().toISOString()
    };
  }
}
