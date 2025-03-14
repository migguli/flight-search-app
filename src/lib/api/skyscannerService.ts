import { API_BASE_URL, DEFAULT_HEADERS, handleApiResponse } from './config';
import type { Flight, FlightSearchParams, FlightSearchResponse } from '../types/flight';

// Skyscanner API endpoints
const ENDPOINTS = {
  FLIGHTS_SEARCH: '/flights/search',
  FLIGHTS_LIVE_PRICES: '/flights/live-prices',
  AUTOCOMPLETE_PLACES: '/places/autocomplete',
};

/**
 * Service for interacting with the Skyscanner API
 */
export class SkyscannerService {
  /**
   * Search for flights using the Skyscanner API
   */
  static async searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
    try {
      // In a real implementation, we would call the Skyscanner API
      // For now, we'll use mock data from the FlightService
      // This allows for easy transition when the API key is ready
      
      // Replace this with actual API call when ready:
      // const response = await fetch(`${API_BASE_URL}${ENDPOINTS.FLIGHTS_SEARCH}`, {
      //   method: 'POST',
      //   headers: {
      //     ...DEFAULT_HEADERS,
      //     'x-api-key': 'YOUR_API_KEY_HERE', // Replace with actual API key when implementing
      //   },
      //   body: JSON.stringify(params),
      // });
      // return handleApiResponse(response);
      
      // For now, import and use FlightService mock data
      const { FlightService } = await import('./flightService');
      return FlightService.searchFlights(params);
    } catch (error) {
      console.error('Error searching flights:', error);
      throw error;
    }
  }
  
  /**
   * Get live prices for a specific flight search
   */
  static async getLivePrices(sessionToken: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.FLIGHTS_LIVE_PRICES}/${sessionToken}`, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'x-api-key': 'YOUR_API_KEY_HERE', // Replace with actual API key when implementing
        },
      });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Error getting live prices:', error);
      throw error;
    }
  }
  
  /**
   * Autocomplete places for origin/destination fields
   */
  static async autocompletePlaces(query: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE_URL}${ENDPOINTS.AUTOCOMPLETE_PLACES}?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
          ...DEFAULT_HEADERS,
          'x-api-key': 'YOUR_API_KEY_HERE', // Replace with actual API key when implementing
        },
      });
      return handleApiResponse(response);
    } catch (error) {
      console.error('Error autocompleting places:', error);
      throw error;
    }
  }
} 