import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import { Badge } from '../ui/badge';
import Image from 'next/image';
import { Clock, Navigation, Calendar, DollarSign, Plane, ArrowRight } from 'lucide-react';
import type { Flight as APIFlight } from '@/lib/types/flight';
import { cn } from '@/lib/utils';

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
    departureTime: firstSegment.departureTime || '',
    arrivalTime: lastSegment.arrivalTime || '',
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

const FlightCard = ({ flight, className, onSelect }: { flight: Flight; className?: string; onSelect?: (flight: Flight) => void }) => {
  // Format price to display with currency symbol
  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(flight.price);

  return (
    <Card className={cn("transition-shadow duration-300", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Optimized image with proper alt text */}
            <div className="relative w-8 h-8 rounded-full overflow-hidden bg-neutral-100 flex items-center justify-center">
              {flight.airline && (
                <Image
                  src={`/airlines/${flight.airline.toLowerCase().replace(/\s+/g, '-')}.png`}
                  alt={`${flight.airline} logo`}
                  width={32}
                  height={32}
                  className="object-contain"
                  loading="lazy"
                  onError={(e) => {
                    // Fallback if image fails to load
                    const target = e.target as HTMLImageElement;
                    // Only set fallback if not already using the fallback
                    if (!target.src.includes('default-airline')) {
                      target.src = '/airlines/default-airline.svg';
                    }
                    // Prevent further error handling to avoid infinite loop
                    target.onerror = null;
                  }}
                />
              )}
            </div>
            <div>
              <CardTitle className="text-base font-semibold">{flight.airline}</CardTitle>
              <p className="text-xs text-neutral-500" aria-label="Flight number">{flight.flightNumber}</p>
            </div>
          </div>
          <div>
            <span className="text-lg font-bold text-primary-600">{formattedPrice}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <div className="text-center">
            <p className="text-lg font-bold">{flight.origin}</p>
            <p className="text-sm text-neutral-500" aria-label="Departure time">
              {flight.departureTime ? new Date(flight.departureTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </p>
          </div>
          <div className="flex-1 flex flex-col items-center mx-4">
            <div className="w-full flex items-center">
              <div className="h-[2px] flex-1 bg-neutral-200"></div>
              <Plane size={16} className="mx-2 text-primary-500 transform rotate-90" aria-hidden="true" />
              <div className="h-[2px] flex-1 bg-neutral-200"></div>
            </div>
            <p className="text-xs text-neutral-500 mt-1" aria-label="Flight duration">
              {flight.duration}
            </p>
            {flight.stops > 0 && (
              <div className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs mt-1">
                <span aria-label={`${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}>
                  {flight.stops} {flight.stops === 1 ? 'stop' : 'stops'}
                </span>
              </div>
            )}
          </div>
          <div className="text-center">
            <p className="text-lg font-bold">{flight.destination}</p>
            <p className="text-sm text-neutral-500" aria-label="Arrival time">
              {flight.arrivalTime ? new Date(flight.arrivalTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
            </p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-neutral-400" aria-hidden="true" />
            <span className="text-sm">{flight.duration}</span>
          </div>
          {flight.bookingUrl && (
            <Button 
              variant="default" 
              size="sm" 
              onClick={() => window.open(flight.bookingUrl, '_blank')}
              aria-label={`Book ${flight.airline} flight ${flight.flightNumber} (opens in new tab)`}
            >
              Book Now
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export const FlightSearchResults: React.FC<FlightSearchResultsProps> = ({
  flights,
  isLoading = false,
  onFilterChange,
  onSortChange,
  onSelect,
}) => {
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null);

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
    } catch (e) {
      return '';
    }
  };

  // Format date to display day and month
  const formatDay = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      });
    } catch (e) {
      return '';
    }
  };

  // Format price to display as currency
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleViewDetails = (destination: string) => {
    if (expandedCity === destination) {
      setExpandedCity(null);
    } else {
      setExpandedCity(destination);
    }
  };

  const toggleFlightDetails = (flightId: string) => {
    if (expandedFlight === flightId) {
      setExpandedFlight(null);
    } else {
      setExpandedFlight(flightId);
    }
  };

  const handleSelectFlight = (flight: Flight) => {
    if (onSelect) {
      onSelect(flight);
    }
  };

  const getStopsLabel = (stops: number) => {
    switch (stops) {
      case 0:
        return 'Direct';
      case 1:
        return '1 Stop';
      default:
        return `${stops} Stops`;
    }
  };

  // Generate a linear gradient based on airline name for branding
  const getAirlineColor = (airline: string) => {
    // Simple hash function to generate consistent colors
    const hash = airline.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const h = Math.abs(hash) % 360;
    return `hsl(${h}, 70%, 65%)`;
  };

  // Skeleton loader for flight cards
  const renderSkeletons = () => (
    <>
      {[1, 2, 3].map((i) => (
        <Card key={i} className="mb-4 overflow-hidden border border-neutral-200">
          <div className="p-4">
            <div className="flex justify-between mb-4">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-20" />
            </div>
            <div className="flex justify-between items-center">
              <div>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-16" />
              <div>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </Card>
      ))}
    </>
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        {renderSkeletons()}
      </div>
    );
  }

  if (flights.length === 0) {
    return (
      <div className="text-center py-8 bg-neutral-50 rounded-lg border border-neutral-200">
        <div className="text-5xl mb-4">✈️</div>
        <h3 className="text-xl font-semibold mb-2">No flights found</h3>
        <p className="text-neutral-600">Try different search criteria</p>
      </div>
    );
  }

  // Group flights by destination city (using destination code as key)
  const flightsByDestination: Record<string, Flight[]> = {};
  flights.forEach((flight) => {
    if (!flightsByDestination[flight.destination]) {
      flightsByDestination[flight.destination] = [];
    }
    flightsByDestination[flight.destination].push(flight);
  });

  // Find the cheapest flight for each destination
  const destinationSummary = Object.entries(flightsByDestination).map(([destination, flights]) => {
    // Sort flights by price (ascending)
    const sortedFlights = [...flights].sort((a, b) => a.price - b.price);
    const cheapestFlight = sortedFlights[0];
    
    return {
      destination,
      cheapestPrice: cheapestFlight.price,
      flightCount: flights.length,
      airlines: [...new Set(flights.map(f => f.airline))],
      flights: sortedFlights
    };
  });

  return (
    <div className="space-y-4">
      {destinationSummary.map((summary) => (
        <React.Fragment key={summary.destination}>
          <Card className="transition-shadow">
            <CardHeader>
              <CardTitle className="text-xl">Flights to {summary.destination}</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-xl font-medium">From <span className="text-2xl font-bold">${summary.cheapestPrice}</span></p>
                  <p className="text-sm text-gray-600">{summary.flightCount} flights available</p>
                  <div className="mt-1">
                    <p className="text-sm text-gray-700">
                      Airlines: {summary.airlines.join(', ')}
                    </p>
                  </div>
                </div>
                <Button 
                  onClick={() => handleViewDetails(summary.destination)}
                  aria-label={`View flights to ${summary.destination}`}
                >
                  {expandedCity === summary.destination ? 'Hide Details' : 'View Details'}
                </Button>
              </div>
              
              {expandedCity === summary.destination && (
                <div className="mt-6 space-y-6 border-t pt-4">
                  {/* Top 2 Best Flights */}
                  <div>
                    <h4 className="font-medium text-lg mb-3">Best Flights to {summary.destination}</h4>
                    <div className="space-y-3">
                      {summary.flights.slice(0, 2).map((flight) => (
                        <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </React.Fragment>
      ))}
      
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}; 