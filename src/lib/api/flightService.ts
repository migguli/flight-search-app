import { API_BASE_URL, DEFAULT_HEADERS, handleApiResponse } from './config';
import type { FlightSearchParams, FlightSearchResponse } from '../types/flight';

export class FlightService {
  static async searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
    try {
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
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while searching flights');
    }
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