'use client';

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
      // For now, use mock data from the FlightService
      // This allows for easy transition when the API key is ready
      const { FlightService } = await import('./flightService');
      return await FlightService.searchFlights(params);
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
      // Mock implementation for now
      return {
        success: true,
        data: {
          prices: []
        }
      };
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
      // Mock implementation for now
      return {
        places: [
          {
            entityId: 'SKY_123',
            name: query + ' International Airport',
            iata: query.substring(0, 3).toUpperCase(),
            type: 'AIRPORT'
          },
          {
            entityId: 'SKY_456',
            name: query + ' City',
            type: 'CITY'
          }
        ]
      };
    } catch (error) {
      console.error('Error autocompleting places:', error);
      throw error;
    }
  }
} 