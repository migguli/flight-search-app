import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import type { Flight as APIFlight } from '@/lib/types/flight';
import type { Accommodation } from '@/lib/types/accommodation';
import { AccommodationService } from '@/lib/api/accommodationService';

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
  const [expandedCity, setExpandedCity] = useState<string | null>(null);
  const [cityAccommodations, setCityAccommodations] = useState<Record<string, Accommodation[]>>({});
  const [isLoadingAccommodations, setIsLoadingAccommodations] = useState<Record<string, boolean>>({});

  // Fetch accommodations for a city when expanded
  useEffect(() => {
    if (expandedCity && !cityAccommodations[expandedCity]) {
      const fetchAccommodations = async () => {
        setIsLoadingAccommodations(prev => ({ ...prev, [expandedCity]: true }));
        try {
          const response = await AccommodationService.searchAccommodations({
            city: expandedCity,
            guests: 2 // Default to 2 guests
          });
          setCityAccommodations(prev => ({ 
            ...prev, 
            [expandedCity]: response.accommodations 
          }));
        } catch (error) {
          console.error(`Error fetching accommodations for ${expandedCity}:`, error);
          setCityAccommodations(prev => ({ ...prev, [expandedCity]: [] }));
        } finally {
          setIsLoadingAccommodations(prev => ({ ...prev, [expandedCity]: false }));
        }
      };
      
      fetchAccommodations();
    }
  }, [expandedCity, cityAccommodations]);

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

  const handleViewDetails = (destination: string) => {
    if (expandedCity === destination) {
      setExpandedCity(null);
    } else {
      setExpandedCity(destination);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-4">
      {destinationSummary.map((summary) => (
        <Card key={summary.destination} className="hover:shadow-lg transition-shadow">
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
                      <div key={flight.id} className="p-3 border rounded-lg hover:bg-gray-50">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-semibold">{flight.airline}</h3>
                            <p className="text-sm text-gray-600">Flight {flight.flightNumber}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-bold">${flight.price}</p>
                            <Button 
                              size="sm"
                              className="mt-1" 
                              onClick={() => onSelect?.(flight)}
                              aria-label={`Select flight ${flight.flightNumber} from ${flight.origin} to ${flight.destination}`}
                            >
                              Select
                            </Button>
                          </div>
                        </div>
                        
                        <div className="mt-3 grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-gray-600">Departure</p>
                            <p className="font-semibold">{flight.departureTime}</p>
                            <p>{flight.origin}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-gray-600">Duration</p>
                            <p className="font-semibold">{flight.duration}</p>
                            <p>{flight.stops === 0 ? 'Direct' : `${flight.stops} stop${flight.stops > 1 ? 's' : ''}`}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-600">Arrival</p>
                            <p className="font-semibold">{flight.arrivalTime}</p>
                            <p>{flight.destination}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Top 3 Accommodations */}
                <div>
                  <h4 className="font-medium text-lg mb-3">Best Places to Stay in {summary.destination}</h4>
                  {isLoadingAccommodations[summary.destination] ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 border rounded-lg">
                          <div className="flex flex-col md:flex-row gap-4">
                            <div className="w-full md:w-1/4 h-32 bg-gray-200 rounded-lg animate-pulse"></div>
                            <div className="w-full md:w-3/4 space-y-2">
                              <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
                              <div className="h-4 bg-gray-200 rounded w-1/4 animate-pulse"></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : cityAccommodations[summary.destination]?.length > 0 ? (
                    <div className="space-y-3">
                      {cityAccommodations[summary.destination]
                        .sort((a, b) => b.rating - a.rating)
                        .slice(0, 3)
                        .map((accommodation) => (
                          <div key={accommodation.id} className="p-3 border rounded-lg hover:bg-gray-50">
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="w-full md:w-1/4 h-32 relative rounded-lg overflow-hidden">
                                <Image
                                  src={accommodation.images[0]}
                                  alt={accommodation.title}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 25vw"
                                  style={{ objectFit: 'cover' }}
                                />
                              </div>
                              <div className="w-full md:w-3/4">
                                <div className="flex justify-between">
                                  <div>
                                    <h3 className="font-semibold">{accommodation.title}</h3>
                                    <div className="flex items-center mt-1">
                                      <span className="text-yellow-500">★</span>
                                      <span className="ml-1">{accommodation.rating.toFixed(1)}</span>
                                      <span className="text-gray-500 ml-1">
                                        ({accommodation.numberOfReviews} reviews)
                                      </span>
                                      {accommodation.host.isSuperhost && (
                                        <span className="ml-2 px-1.5 py-0.5 text-xs bg-rose-100 text-rose-800 rounded">
                                          Superhost
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                      {accommodation.capacity.guests} guests • {accommodation.capacity.bedrooms} bedroom
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <p className="font-bold">${accommodation.price.amount}</p>
                                    <p className="text-sm text-gray-600">per {accommodation.price.per}</p>
                                  </div>
                                </div>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {accommodation.amenities.slice(0, 3).map((amenity, index) => (
                                    <span
                                      key={index}
                                      className="inline-block px-2 py-0.5 text-xs bg-gray-100 rounded-full text-gray-600"
                                    >
                                      {amenity}
                                    </span>
                                  ))}
                                  {accommodation.amenities.length > 3 && (
                                    <span className="inline-block px-2 py-0.5 text-xs bg-gray-100 rounded-full text-gray-600">
                                      +{accommodation.amenities.length - 3} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <p className="text-gray-600 text-center py-3">No accommodations found in this city</p>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}; 