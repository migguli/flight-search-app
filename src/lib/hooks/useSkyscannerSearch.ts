import { useState } from 'react';
import { SkyscannerService } from '../api/skyscannerService';
import { transformSkyscannerResponse } from '../utils/skyscannerUtils';
import type { Flight, FlightSearchParams } from '../types/flight';
import type { PlaceAutocompleteResponse } from '../types/skyscanner';

/**
 * Hook for searching flights using the Skyscanner API
 */
export const useSkyscannerSearch = () => {
  const [flights, setFlights] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [places, setPlaces] = useState<PlaceAutocompleteResponse | null>(null);
  const [isLoadingPlaces, setIsLoadingPlaces] = useState(false);

  /**
   * Search for flights using the Skyscanner API
   */
  const searchFlights = async (params: FlightSearchParams) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Call the Skyscanner service
      const response = await SkyscannerService.searchFlights(params);
      
      // Parse the response
      // In a real implementation, this would transform from Skyscanner format
      // to our internal format using transformSkyscannerResponse
      setFlights(response.flights);
      
      return response.flights;
    } catch (err) {
      console.error('Error searching flights:', err);
      setError(err instanceof Error ? err.message : 'An error occurred while searching for flights');
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Search for places using the Skyscanner API
   */
  const searchPlaces = async (query: string) => {
    if (!query || query.length < 2) {
      setPlaces(null);
      return [];
    }
    
    setIsLoadingPlaces(true);
    
    try {
      // In a real implementation, this would call the Skyscanner API
      // For now we'll use a mock implementation
      
      // const response = await SkyscannerService.autocompletePlaces(query);
      // setPlaces(response);
      // return response.places;
      
      // Mock implementation
      const mockPlaces = [
        {
          entityId: 'SKY_123',
          name: query + ' International Airport',
          iata: query.substring(0, 3).toUpperCase(),
          type: 'AIRPORT' as const,
          coordinates: {
            latitude: 51.5,
            longitude: -0.12,
          }
        },
        {
          entityId: 'SKY_456',
          name: query + ' City',
          type: 'CITY' as const
        }
      ];
      
      setPlaces({ places: mockPlaces });
      return mockPlaces;
    } catch (err) {
      console.error('Error searching places:', err);
      return [];
    } finally {
      setIsLoadingPlaces(false);
    }
  };

  return {
    flights,
    isLoading,
    error,
    places,
    isLoadingPlaces,
    searchFlights,
    searchPlaces
  };
}; 