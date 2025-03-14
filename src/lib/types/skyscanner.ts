/**
 * Type definitions for Skyscanner API
 */

// Place autocomplete response interface
export interface SkyscannerPlace {
  entityId: string;
  name: string;
  iata?: string;
  type: 'PLACE' | 'AIRPORT' | 'CITY' | 'COUNTRY';
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  parentId?: string;
  countryId?: string;
  cityId?: string;
}

export interface PlaceAutocompleteResponse {
  places: SkyscannerPlace[];
}

// Flight search request interfaces
export interface FlightLeg {
  origin: string;
  destination: string;
  date: string; // ISO date string
}

export interface FlightSearchRequest {
  legs: FlightLeg[];
  adults?: number;
  childrenAges?: number[];
  cabinClass?: 'CABIN_CLASS_ECONOMY' | 'CABIN_CLASS_PREMIUM_ECONOMY' | 'CABIN_CLASS_BUSINESS' | 'CABIN_CLASS_FIRST';
  currency?: string;
  locale?: string;
}

// Flight search response interfaces
export interface Carrier {
  id: string;
  name: string;
  logoUrl?: string;
  allianceId?: string;
}

export interface Agent {
  id: string;
  name: string;
  type: 'AIRLINE' | 'AGENT' | 'TOUR_OPERATOR';
  logoUrl?: string;
  feedbackCount?: number;
  rating?: number;
}

export interface Price {
  amount: number;
  unit: string;
  updateStatus: 'CONFIRMED' | 'PENDING' | 'OUTDATED';
}

export interface Segment {
  id: string;
  originPlaceId: string;
  destinationPlaceId: string;
  departureDateTime: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  arrivalDateTime: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  durationInMinutes: number;
  carrierId: string;
  operatingCarrierId?: string;
  flightNumber: string;
}

export interface Itinerary {
  pricingOptions: {
    price: Price;
    agentIds: string[];
    items: {
      price: Price;
      agentId: string;
      deepLink: string;
    }[];
  }[];
  legIds: string[];
}

export interface Leg {
  id: string;
  segmentIds: string[];
  originPlaceId: string;
  destinationPlaceId: string;
  departureDateTime: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  arrivalDateTime: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
  durationInMinutes: number;
  stopCount: number;
}

export interface Place {
  id: string;
  name: string;
  displayCode: string;
  type: 'AIRPORT' | 'CITY' | 'COUNTRY';
  parentId?: string;
}

export interface FlightSearchResponse {
  sessionToken: string;
  status: 'RESULT_STATUS_COMPLETE' | 'RESULT_STATUS_INCOMPLETE';
  action: 'RESULT_ACTION_REFRESH' | 'RESULT_ACTION_POLL';
  content: {
    results: {
      carriers: Carrier[];
      agents: Agent[];
      places: Place[];
      itineraries: Itinerary[];
      legs: Leg[];
      segments: Segment[];
    };
  };
} 