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
      // For now we'll use a mock implementation with common cities/airports
      
      // Common cities and airports for autocomplete
      const commonPlaces = [
        { entityId: 'LON_SKY', name: 'London', iata: 'LON', type: 'CITY' as const },
        { entityId: 'LHR_SKY', name: 'London Heathrow Airport', iata: 'LHR', type: 'AIRPORT' as const },
        { entityId: 'LGW_SKY', name: 'London Gatwick Airport', iata: 'LGW', type: 'AIRPORT' as const },
        { entityId: 'NYC_SKY', name: 'New York', iata: 'NYC', type: 'CITY' as const },
        { entityId: 'JFK_SKY', name: 'New York John F. Kennedy Airport', iata: 'JFK', type: 'AIRPORT' as const },
        { entityId: 'LGA_SKY', name: 'New York LaGuardia Airport', iata: 'LGA', type: 'AIRPORT' as const },
        { entityId: 'PAR_SKY', name: 'Paris', iata: 'PAR', type: 'CITY' as const },
        { entityId: 'CDG_SKY', name: 'Paris Charles de Gaulle Airport', iata: 'CDG', type: 'AIRPORT' as const },
        { entityId: 'ORY_SKY', name: 'Paris Orly Airport', iata: 'ORY', type: 'AIRPORT' as const },
        { entityId: 'TYO_SKY', name: 'Tokyo', iata: 'TYO', type: 'CITY' as const },
        { entityId: 'NRT_SKY', name: 'Tokyo Narita Airport', iata: 'NRT', type: 'AIRPORT' as const },
        { entityId: 'HND_SKY', name: 'Tokyo Haneda Airport', iata: 'HND', type: 'AIRPORT' as const },
        { entityId: 'SYD_SKY', name: 'Sydney', iata: 'SYD', type: 'CITY' as const },
        { entityId: 'SYD_APT', name: 'Sydney Kingsford Smith Airport', iata: 'SYD', type: 'AIRPORT' as const },
        { entityId: 'HEL_SKY', name: 'Helsinki', iata: 'HEL', type: 'CITY' as const },
        { entityId: 'HEL_APT', name: 'Helsinki Vantaa Airport', iata: 'HEL', type: 'AIRPORT' as const },
        { entityId: 'ROM_SKY', name: 'Rome', iata: 'ROM', type: 'CITY' as const },
        { entityId: 'FCO_SKY', name: 'Rome Fiumicino Airport', iata: 'FCO', type: 'AIRPORT' as const },
        { entityId: 'BCN_SKY', name: 'Barcelona', iata: 'BCN', type: 'CITY' as const },
        { entityId: 'BCN_APT', name: 'Barcelona El Prat Airport', iata: 'BCN', type: 'AIRPORT' as const },
        { entityId: 'DXB_SKY', name: 'Dubai', iata: 'DXB', type: 'CITY' as const },
        { entityId: 'DXB_APT', name: 'Dubai International Airport', iata: 'DXB', type: 'AIRPORT' as const },
        { entityId: 'SIN_SKY', name: 'Singapore', iata: 'SIN', type: 'CITY' as const },
        { entityId: 'SIN_APT', name: 'Singapore Changi Airport', iata: 'SIN', type: 'AIRPORT' as const },
        { entityId: 'AMS_SKY', name: 'Amsterdam', iata: 'AMS', type: 'CITY' as const },
        { entityId: 'AMS_APT', name: 'Amsterdam Schiphol Airport', iata: 'AMS', type: 'AIRPORT' as const },
        { entityId: 'BER_SKY', name: 'Berlin', iata: 'BER', type: 'CITY' as const },
        { entityId: 'BER_APT', name: 'Berlin Brandenburg Airport', iata: 'BER', type: 'AIRPORT' as const },
        { entityId: 'LAX_SKY', name: 'Los Angeles', iata: 'LAX', type: 'CITY' as const },
        { entityId: 'LAX_APT', name: 'Los Angeles International Airport', iata: 'LAX', type: 'AIRPORT' as const }
      ];
      
      // Filter places based on the search query (case insensitive)
      const lowercaseQuery = query.toLowerCase();
      const filteredPlaces = commonPlaces.filter(place => 
        place.name.toLowerCase().includes(lowercaseQuery) || 
        place.iata.toLowerCase().includes(lowercaseQuery)
      );
      
      // Add coordinates to the places (simplified for mock)
      const placesWithCoordinates = filteredPlaces.map(place => ({
        ...place,
        coordinates: place.type === 'AIRPORT' ? {
          latitude: Math.random() * 180 - 90, // Random coordinates for demo
          longitude: Math.random() * 360 - 180
        } : undefined
      }));
      
      setPlaces({ places: placesWithCoordinates });
      return placesWithCoordinates;
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