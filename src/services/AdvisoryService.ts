import type { AdvisoryCard, ApiResponse } from '@/types';
import type { Location } from '@/types';

/**
 * Service for fetching human-readable mission advisories.
 */
export class AdvisoryService {
  /**
   * Fetch active advisories for a given location.
   * TODO: Implement actual API call to the backend.
   */
  static async getAdvisories(location: Location): Promise<ApiResponse<AdvisoryCard[]>> {
    console.log(`[Architecture] Fetching advisories for ${location.locationName}`);
    
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    // Architecture only: returning empty state to trigger UI skeletons/loading
    return {
      data: [],
      error: null,
      loading: false,
      timestamp: new Date().toISOString()
    };
  }
}
