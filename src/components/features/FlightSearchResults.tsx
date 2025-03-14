import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Skeleton } from '../ui/skeleton';
import Image from 'next/image';
import { Clock, Navigation, Calendar, DollarSign, Plane, ArrowRight, Sparkles, Star } from 'lucide-react';
import type { Flight as APIFlight } from '@/lib/types/flight';
import type { Accommodation } from '@/lib/types/accommodation';
import { AccommodationService } from '@/lib/api/accommodationService';
import { cn } from '@/lib/utils';
import { Motion } from '../ui/motion';

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

const FlightCard = ({ flight, className, onSelect, index = 0 }: { flight: Flight; className?: string; onSelect?: (flight: Flight) => void; index?: number }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  
  const handleSelect = () => {
    setIsAnimating(true);
    setTimeout(() => {
      if (onSelect) onSelect(flight);
    }, 300);
  };
  
  const isSpecialDeal = flight.price < 300;
  
  return (
    <Motion 
      animationType="slide-up" 
      delay={100 + (index * 50)} 
      duration={500}
      className="w-full"
    >
      <Card 
        className={cn(
          "w-full relative overflow-hidden transition-all duration-300",
          isHovered ? "shadow-lg transform -translate-y-1" : "shadow",
          isAnimating ? "scale-95 opacity-50" : "",
          isSpecialDeal ? "border-accent-200 border-2" : "",
          className
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {isSpecialDeal && (
          <div className="absolute top-0 right-0">
            <div className="bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1 animate-pulse-glow">
              <Sparkles size={12} className="animate-pulse" />
              <span>SPECIAL DEAL</span>
            </div>
          </div>
        )}
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 relative flex-shrink-0 overflow-hidden rounded-full bg-neutral-100 shadow-sm">
                <div className="absolute inset-0 flex items-center justify-center">
                  <Plane 
                    size={24} 
                    className={cn(
                      "text-primary-600 transition-all duration-500",
                      isHovered ? "rotate-12 scale-110" : ""
                    )} 
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg">{flight.airline}</h3>
                <p className="text-sm text-neutral-600">{flight.flightNumber}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap md:flex-nowrap items-center gap-3 md:gap-6">
              <div className="text-center">
                <p className="font-mono font-bold text-lg">{flight.departureTime.substring(11, 16)}</p>
                <p className="text-sm text-neutral-600">{flight.origin}</p>
              </div>
              
              <div className="flex-1 flex items-center px-2">
                <div className="h-0.5 w-full bg-neutral-200 relative">
                  <div className={cn(
                    "absolute h-2 w-2 rounded-full bg-primary-500 top-1/2 transform -translate-y-1/2 transition-all duration-700",
                    isHovered ? "left-[80%]" : "left-[30%]"
                  )}>
                    <div className={cn(
                      "absolute inset-0 bg-primary-500 rounded-full animate-ping opacity-75",
                      isHovered ? "opacity-75" : "opacity-0"
                    )}></div>
                  </div>
                </div>
              </div>
              
              <div className="text-center">
                <p className="font-mono font-bold text-lg">{flight.arrivalTime.substring(11, 16)}</p>
                <p className="text-sm text-neutral-600">{flight.destination}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="flex items-center gap-1 mb-1">
                <Star size={16} className={cn(
                  "text-accent-500 transition-all duration-300",
                  isHovered ? "rotate-45 scale-110" : ""
                )} />
                <p className="text-sm font-medium text-neutral-600">{flight.stops === 0 ? 'Direct' : `${flight.stops} ${flight.stops === 1 ? 'stop' : 'stops'}`}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary-600 font-display">${flight.price}</p>
                <p className="text-sm text-neutral-600">{flight.duration}</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-neutral-200 flex justify-between items-center">
            <div className="flex items-center gap-2 text-sm text-neutral-600">
              <Clock size={16} className="text-neutral-400" />
              <span>Duration: {flight.duration}</span>
            </div>
            
            <Button 
              onClick={handleSelect}
              className={cn(
                "transition-all duration-300 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 shadow-md",
                isHovered ? "shadow-glow scale-105" : ""
              )}
            >
              <span>Select Flight</span>
              <ArrowRight size={16} className={cn(
                "ml-2 transition-transform duration-300",
                isHovered ? "translate-x-1" : ""
              )} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </Motion>
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
  const [cityAccommodations, setCityAccommodations] = useState<Record<string, Accommodation[]>>({});
  const [isLoadingAccommodations, setIsLoadingAccommodations] = useState<Record<string, boolean>>({});
  const [expandedFlight, setExpandedFlight] = useState<string | null>(null);
  const [expandedFlightId, setExpandedFlightId] = useState<string | null>(null);
  const [animateResults, setAnimateResults] = useState(false);

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

  useEffect(() => {
    // Trigger animation when flights are loaded
    if (flights.length > 0 && !isLoading) {
      setAnimateResults(true);
    }
  }, [flights, isLoading]);

  // Format date to display in a more readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  // Format date to display day and month
  const formatDay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
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

  const renderFlights = () => {
    if (flights.length === 0 && !isLoading) {
      return (
        <Motion animationType="fade" duration={800}>
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-neutral-100 flex items-center justify-center">
              <Plane size={36} className="text-neutral-400 -rotate-45" />
            </div>
            <h3 className="text-xl font-bold mb-2">No flights found</h3>
            <p className="text-neutral-600 max-w-md">
              We couldn't find any flights matching your search criteria. Try adjusting your dates or destination.
            </p>
          </div>
        </Motion>
      );
    }

    return (
      <div className="space-y-4">
        {flights.map((flight, index) => (
          <FlightCard 
            key={flight.id} 
            flight={flight} 
            onSelect={handleSelectFlight}
            index={index}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Motion animationType="slide-down" duration={600}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold font-display cosmic-gradient-text">
            {isLoading ? 'Searching flights...' : 
              flights.length > 0 ? `${flights.length} ${flights.length === 1 ? 'Flight' : 'Flights'} Found` : 'No Flights Found'}
          </h2>
          
          {flights.length > 0 && !isLoading && (
            <div className="flex gap-2">
              {/* Sorting and filtering controls can go here */}
            </div>
          )}
        </div>
      </Motion>
      
      {isLoading ? renderSkeletons() : renderFlights()}
    </div>
  );
}; 