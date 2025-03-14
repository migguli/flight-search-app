export interface Airport {
  code: string;
  name: string;
  city: string;
  country: string;
}

export interface Airline {
  code: string;
  name: string;
  logo?: string;
}

export interface FlightSegment {
  departureAirport: Airport;
  arrivalAirport: Airport;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  airline: Airline;
  flightNumber: string;
}

export interface Flight {
  id: string;
  segments: FlightSegment[];
  price: {
    amount: number;
    currency: string;
  };
  stops: number;
  totalDuration: string;
  bookingUrl?: string;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: string;
  returnDate?: string;
  passengers: number;
  cabinClass?: 'economy' | 'business' | 'first';
}

export interface FlightSearchResponse {
  flights: Flight[];
  totalResults: number;
  filters?: {
    airlines: string[];
    priceRange: {
      min: number;
      max: number;
    };
    stops: number[];
  };
} 