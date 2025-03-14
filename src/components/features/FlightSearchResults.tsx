import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import type { Flight as APIFlight } from '@/lib/types/flight';

// Extended flight type that includes UI-specific fields
export interface Flight extends Omit<APIFlight, 'segments' | 'price' | 'totalDuration'> {
  airline: string;
  flightNumber: string;
  departureTime: string;
  arrivalTime: string;
  origin: string;
  destination: string;
  price: number;
  duration: string;
  stops: number;
  bookingUrl?: string;
}

// Helper function to transform API flight to UI flight
export const transformAPIFlight = (apiFlight: APIFlight): Flight => {
  const firstSegment = apiFlight.segments[0];
  const lastSegment = apiFlight.segments[apiFlight.segments.length - 1];

  return {
    id: apiFlight.id,
    airline: firstSegment.airline.name,
    flightNumber: firstSegment.flightNumber,
    departureTime: firstSegment.departureTime,
    arrivalTime: lastSegment.arrivalTime,
    origin: firstSegment.departureAirport.code,
    destination: lastSegment.arrivalAirport.code,
    price: apiFlight.price.amount,
    duration: apiFlight.totalDuration,
    stops: apiFlight.stops,
    bookingUrl: apiFlight.bookingUrl
  };
};

interface FlightSearchResultsProps {
  flights: Flight[];
  isLoading?: boolean;
  onFilterChange?: (filters: any) => void;
  onSortChange?: (sortBy: string) => void;
  onSelect?: (flight: Flight) => void;
}

export const FlightSearchResults: React.FC<FlightSearchResultsProps> = ({
  flights,
  isLoading = false,
  onFilterChange,
  onSortChange,
  onSelect,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[...Array(3)].map((_, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <Skeleton className="h-32 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-8">
        <h3 className="text-xl font-semibold mb-2">No flights found</h3>
        <p className="text-gray-600">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4">
      {flights.map((flight) => (
        <Card key={flight.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">{flight.airline}</h3>
                <p className="text-sm text-gray-600">Flight {flight.flightNumber}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">${flight.price}</p>
                <Button 
                  className="mt-2" 
                  onClick={() => onSelect?.(flight)}
                  aria-label={`Select flight ${flight.flightNumber} from ${flight.origin} to ${flight.destination}`}
                >
                  Select
                </Button>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Departure</p>
                <p className="font-semibold">{flight.departureTime}</p>
                <p className="text-sm">{flight.origin}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Duration</p>
                <p className="font-semibold">{flight.duration}</p>
                <p className="text-sm">{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Arrival</p>
                <p className="font-semibold">{flight.arrivalTime}</p>
                <p className="text-sm">{flight.destination}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 