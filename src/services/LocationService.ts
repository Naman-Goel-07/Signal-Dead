import type { NominatimResult } from '@/types';

/**
 * Service for interacting with geocoding APIs and the browser geolocation API.
 */
export class LocationService {
  private static NOMINATIM_URL = import.meta.env.VITE_NOMINATIM_URL || 'https://nominatim.openstreetmap.org';

  /**
   * Search for a location by name using Nominatim API.
   * TODO: Handle rate limiting (Nominatim requires 1s delay between requests).
   */
  static async searchByName(query: string): Promise<NominatimResult[]> {
    if (!query) return [];
    
    try {
      const response = await fetch(`${this.NOMINATIM_URL}/search?format=json&q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error in LocationService.searchByName:', error);
      return [];
    }
  }

  /**
   * Get location details from latitude and longitude using Nominatim reverse geocoding.
   */
  static async reverseGeocode(lat: number, lon: number): Promise<NominatimResult | null> {
    try {
      const response = await fetch(`${this.NOMINATIM_URL}/reverse?format=json&lat=${lat}&lon=${lon}`);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (error) {
      console.error('Error in LocationService.reverseGeocode:', error);
      return null;
    }
  }

  /**
   * Wrapper for the browser's Geolocation API.
   */
  static getCurrentPosition(): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by your browser'));
      } else {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        });
      }
    });
  }
}
