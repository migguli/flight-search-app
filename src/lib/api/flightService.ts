import { API_BASE_URL, DEFAULT_HEADERS, handleApiResponse } from './config';
import type { Flight, FlightSearchParams, FlightSearchResponse } from '../types/flight';

// Helper function to create a random time string in format "HH:MM"
const randomTime = () => {
  const hours = Math.floor(Math.random() * 24).toString().padStart(2, '0');
  const minutes = (Math.floor(Math.random() * 4) * 15).toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

// Helper function to calculate duration string based on departure and arrival times
const calculateDuration = (departureTime: string, arrivalTime: string) => {
  const [depHours, depMinutes] = departureTime.split(':').map(Number);
  let [arrHours, arrMinutes] = arrivalTime.split(':').map(Number);
  
  // Adjust for next day arrival
  if (arrHours < depHours) {
    arrHours += 24;
  }
  
  const durationMinutes = (arrHours - depHours) * 60 + (arrMinutes - depMinutes);
  const hours = Math.floor(durationMinutes / 60);
  const minutes = durationMinutes % 60;
  
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
};

// Common airlines for mock data
const airlines = [
  { code: 'AY', name: 'Finnair' },
  { code: 'LH', name: 'Lufthansa' },
  { code: 'BA', name: 'British Airways' },
  { code: 'AF', name: 'Air France' },
  { code: 'KL', name: 'KLM Royal Dutch Airlines' },
  { code: 'SK', name: 'SAS Scandinavian Airlines' },
  { code: 'LX', name: 'Swiss International Air Lines' },
  { code: 'IB', name: 'Iberia' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'AA', name: 'American Airlines' }
];

// Common stopover airports
const stopovers = [
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'AMS', name: 'Amsterdam Schiphol Airport', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'LHR', name: 'London Heathrow Airport', city: 'London', country: 'United Kingdom' },
  { code: 'ZRH', name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland' },
  { code: 'MAD', name: 'Madrid Barajas Airport', city: 'Madrid', country: 'Spain' },
  { code: 'CPH', name: 'Copenhagen Airport', city: 'Copenhagen', country: 'Denmark' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' }
];

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
          airline: airlines[0],
          flightNumber: `${airlines[0].code}${Math.floor(Math.random() * 900) + 100}`,
        }
      ],
      price: { amount: 299, currency: 'EUR' },
      stops: 0,
      totalDuration: '4h 00m',
      bookingUrl: `https://www.skyscanner.com/transport/flights/${params.origin.toLowerCase()}/${params.destination.toLowerCase()}/${params.departureDate.split('T')[0]}`
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
          arrivalAirport: stopovers[0],
          departureTime: '14:30',
          arrivalTime: '16:30',
          duration: '2h 00m',
          airline: airlines[1],
          flightNumber: `${airlines[1].code}${Math.floor(Math.random() * 900) + 100}`,
        },
        {
          departureAirport: stopovers[0],
          arrivalAirport: { 
            code: params.destination, 
            name: params.destination + ' Airport',
            city: params.destination,
            country: 'Unknown'
          },
          departureTime: '17:30',
          arrivalTime: '19:45',
          duration: '2h 15m',
          airline: airlines[1],
          flightNumber: `${airlines[1].code}${Math.floor(Math.random() * 900) + 100}`,
        }
      ],
      price: { amount: 199, currency: 'EUR' },
      stops: 1,
      totalDuration: '5h 15m',
      bookingUrl: `https://www.skyscanner.com/transport/flights/${params.origin.toLowerCase()}/${params.destination.toLowerCase()}/${params.departureDate.split('T')[0]}`
    },
    {
      id: '3',
      segments: [
        {
          departureAirport: { 
            code: params.origin, 
            name: params.origin + ' Airport',
            city: params.origin,
            country: 'Unknown'
          },
          arrivalAirport: stopovers[1],
          departureTime: '06:15',
          arrivalTime: '08:30',
          duration: '2h 15m',
          airline: airlines[4],
          flightNumber: `${airlines[4].code}${Math.floor(Math.random() * 900) + 100}`,
        },
        {
          departureAirport: stopovers[1],
          arrivalAirport: { 
            code: params.destination, 
            name: params.destination + ' Airport',
            city: params.destination,
            country: 'Unknown'
          },
          departureTime: '10:00',
          arrivalTime: '12:35',
          duration: '2h 35m',
          airline: airlines[4],
          flightNumber: `${airlines[4].code}${Math.floor(Math.random() * 900) + 100}`,
        }
      ],
      price: { amount: 349, currency: 'EUR' },
      stops: 1,
      totalDuration: '6h 20m',
      bookingUrl: `https://www.skyscanner.com/transport/flights/${params.origin.toLowerCase()}/${params.destination.toLowerCase()}/${params.departureDate.split('T')[0]}`
    },
    {
      id: '4',
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
          departureTime: '08:45',
          arrivalTime: '11:25',
          duration: '2h 40m',
          airline: airlines[2],
          flightNumber: `${airlines[2].code}${Math.floor(Math.random() * 900) + 100}`,
        }
      ],
      price: { amount: 429, currency: 'EUR' },
      stops: 0,
      totalDuration: '2h 40m',
      bookingUrl: `https://www.skyscanner.com/transport/flights/${params.origin.toLowerCase()}/${params.destination.toLowerCase()}/${params.departureDate.split('T')[0]}`
    },
    {
      id: '5',
      segments: [
        {
          departureAirport: { 
            code: params.origin, 
            name: params.origin + ' Airport',
            city: params.origin,
            country: 'Unknown'
          },
          arrivalAirport: stopovers[2], 
          departureTime: '12:15',
          arrivalTime: '14:30',
          duration: '2h 15m',
          airline: airlines[3],
          flightNumber: `${airlines[3].code}${Math.floor(Math.random() * 900) + 100}`,
        },
        {
          departureAirport: stopovers[2],
          arrivalAirport: stopovers[3],
          departureTime: '15:45',
          arrivalTime: '16:25',
          duration: '0h 40m',
          airline: airlines[3],
          flightNumber: `${airlines[3].code}${Math.floor(Math.random() * 900) + 100}`,
        },
        {
          departureAirport: stopovers[3],
          arrivalAirport: { 
            code: params.destination, 
            name: params.destination + ' Airport',
            city: params.destination,
            country: 'Unknown'
          },
          departureTime: '17:30',
          arrivalTime: '21:15',
          duration: '3h 45m',
          airline: airlines[2],
          flightNumber: `${airlines[2].code}${Math.floor(Math.random() * 900) + 100}`,
        }
      ],
      price: { amount: 179, currency: 'EUR' },
      stops: 2,
      totalDuration: '9h 00m',
      bookingUrl: `https://www.skyscanner.com/transport/flights/${params.origin.toLowerCase()}/${params.destination.toLowerCase()}/${params.departureDate.split('T')[0]}`
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