import { API_BASE_URL, DEFAULT_HEADERS, handleApiResponse } from './config';
import type { Flight, FlightSearchParams, FlightSearchResponse } from '../types/flight';

// Mock data for development and fallback
const generateMockFlights = (params: FlightSearchParams): Flight[] => {
  return [
    {
      id: '1',
      segments: [
        {
          departureAirport: { 
            code: params.origin, 
            name: params.origin + ' Airport',
            city: params.origin,
            country: 'Unknown'
          },
          arrivalAirport: { 
            code: params.destination, 
            name: params.destination + ' Airport',
            city: params.destination,
            country: 'Unknown'
          },
          departureTime: '10:00',
          arrivalTime: '14:00',
          duration: '4h 00m',
          airline: { code: 'AY', name: 'Finnair' },
          flightNumber: 'AY123',
        }
      ],
      price: { amount: 299, currency: 'EUR' },
      stops: 0,
      totalDuration: '4h 00m'
    },
    {
      id: '2',
      segments: [
        {
          departureAirport: { 
            code: params.origin, 
            name: params.origin + ' Airport',
            city: params.origin,
            country: 'Unknown'
          },
          arrivalAirport: { 
            code: 'FRA', 
            name: 'Frankfurt Airport',
            city: 'Frankfurt',
            country: 'Germany'
          },
          departureTime: '14:30',
          arrivalTime: '16:30',
          duration: '2h 00m',
          airline: { code: 'LH', name: 'Lufthansa' },
          flightNumber: 'LH456',
        },
        {
          departureAirport: { 
            code: 'FRA', 
            name: 'Frankfurt Airport',
            city: 'Frankfurt',
            country: 'Germany'
          },
          arrivalAirport: { 
            code: params.destination, 
            name: params.destination + ' Airport',
            city: params.destination,
            country: 'Unknown'
          },
          departureTime: '17:30',
          arrivalTime: '19:45',
          duration: '2h 15m',
          airline: { code: 'LH', name: 'Lufthansa' },
          flightNumber: 'LH789',
        }
      ],
      price: { amount: 199, currency: 'EUR' },
      stops: 1,
      totalDuration: '5h 15m'
    }
  ];
};

export class FlightService {
  static async searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
    try {
      // Check if we're using the example API URL
      if (API_BASE_URL.includes('example')) {
        console.warn('Using mock data as API_BASE_URL is not configured');
        return this.getMockResponse(params);
      }

      const queryParams = new URLSearchParams({
        origin: params.origin,
        destination: params.destination,
        departureDate: params.departureDate,
        passengers: params.passengers.toString(),
        ...(params.returnDate && { returnDate: params.returnDate }),
        ...(params.cabinClass && { cabinClass: params.cabinClass }),
      });

      const response = await fetch(
        `${API_BASE_URL}/flights/search?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        }
      );

      return handleApiResponse(response);
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return this.getMockResponse(params);
    }
  }

  private static getMockResponse(params: FlightSearchParams): FlightSearchResponse {
    const mockFlights = generateMockFlights(params);
    
    return {
      flights: mockFlights,
      totalResults: mockFlights.length
    };
  }

  static async getFlightDetails(flightId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/flights/${flightId}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        }
      );

      return handleApiResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while fetching flight details');
    }
  }

  static async getAirports(query: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/airports/search?q=${encodeURIComponent(query)}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        }
      );

      return handleApiResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while fetching airports');
    }
  }
} 