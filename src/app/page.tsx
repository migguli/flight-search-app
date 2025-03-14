'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlightSearchForm, FlightSearchParams as FormSearchParams } from '@/components/features/search/FlightSearchForm';
import { FlightSearchResults, Flight, transformAPIFlight } from '@/components/features/FlightSearchResults';
import { AccommodationResults } from '@/components/features/AccommodationResults';
import { FlightService } from '@/lib/api/flightService';
import { AccommodationService } from '@/lib/api/accommodationService';
import { ApiError } from '@/lib/api/config';
import type { FlightSearchParams } from '@/lib/types/flight';
import type { Accommodation } from '@/lib/types/accommodation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAccommodations, setIsLoadingAccommodations] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (formParams: FormSearchParams) => {
    setIsLoading(true);
    setError(null);
    setAccommodations([]);
    setSelectedFlight(null);
    setSelectedAccommodation(null);
    
    try {
      // Transform form params to API params
      const searchParams: FlightSearchParams = {
        origin: formParams.origin,
        destination: formParams.destination,
        departureDate: formParams.departureDate.toISOString(),
        returnDate: formParams.returnDate?.toISOString(),
        passengers: 1, // Default to 1 passenger
        cabinClass: 'economy' // Default to economy
      };

      const response = await FlightService.searchFlights(searchParams);
      // Transform API flights to UI flights
      const transformedFlights = response.flights.map(transformAPIFlight);
      setSearchResults(transformedFlights);
      
      // Immediately fetch accommodations when flights are found
      if (transformedFlights.length > 0) {
        setIsLoadingAccommodations(true);
        try {
          // Search for accommodations in the destination city
          const accommodationResponse = await AccommodationService.searchAccommodations({
            city: formParams.destination,
            checkIn: formParams.departureDate.toISOString(),
            checkOut: formParams.returnDate?.toISOString() || '',
            guests: 2 // Default to 2 guests
          });
          
          setAccommodations(accommodationResponse.accommodations);
        } catch (error) {
          console.error('Error fetching accommodations:', error);
          if (error instanceof ApiError) {
            setError(error.message);
          } else {
            setError('An unexpected error occurred while searching for accommodations');
          }
          setAccommodations([]);
        } finally {
          setIsLoadingAccommodations(false);
        }
      }
    } catch (error) {
      console.error('Error fetching flights:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while searching for flights');
      }
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFlightSelect = async (flight: Flight) => {
    setSelectedFlight(flight);
    
    // We still want to update accommodations based on the selected flight
    setIsLoadingAccommodations(true);
    setError(null);

    try {
      // Search for accommodations in the destination city based on the selected flight
      const accommodationResponse = await AccommodationService.searchAccommodations({
        city: flight.destination,
        checkIn: flight.departureTime,
        checkOut: flight.arrivalTime,
        guests: 2 // Default to 2 guests
      });

      setAccommodations(accommodationResponse.accommodations);
    } catch (error) {
      console.error('Error fetching accommodations:', error);
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('An unexpected error occurred while searching for accommodations');
      }
      // Don't clear accommodations if fetching fails, keep the ones from the initial search
    } finally {
      setIsLoadingAccommodations(false);
    }

    if (flight.bookingUrl) {
      window.open(flight.bookingUrl, '_blank');
    }
  };

  const handleAccommodationSelect = (accommodation: Accommodation) => {
    setSelectedAccommodation(accommodation);
    // Log the apartment ID for debugging
    console.log('Selected accommodation ID:', accommodation.id);
    
    // Navigate to the apartment details page with the clean ID
    router.push(`/apartments/${encodeURIComponent(accommodation.id)}`);
  };

  // Popular destinations for the inspiration section
  const popularDestinations = [
    { id: 1, name: 'Paris', image: '/images/paris.jpg', code: 'CDG' },
    { id: 2, name: 'Tokyo', image: '/images/tokyo.jpg', code: 'HND' },
    { id: 3, name: 'New York', image: '/images/new-york.jpg', code: 'JFK' },
    { id: 4, name: 'Sydney', image: '/images/sydney.jpg', code: 'SYD' },
  ];

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient text-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="animated-gradient-text">Discover Your Next Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-white/90">
              Find and book flights to amazing destinations around the world
            </p>
            
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/20">
              <FlightSearchForm onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-12">
        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600 max-w-4xl mx-auto">
            {error}
          </div>
        )}
        
        {/* Search Results Section */}
        {(searchResults.length > 0 || isLoading) && (
          <div className="mt-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">Available Flights</h2>
            <FlightSearchResults
              flights={searchResults}
              isLoading={isLoading}
              onSelect={handleFlightSelect}
            />
          </div>
        )}

        {/* Accommodations Section */}
        {(accommodations.length > 0 || isLoadingAccommodations) && (
          <div className="mt-12 max-w-4xl mx-auto">
            <h2 className="text-2xl font-semibold mb-6">
              Available Accommodations 
              {selectedFlight 
                ? ` in ${selectedFlight.destination}` 
                : searchResults.length > 0 && searchResults[0].destination 
                  ? ` in ${searchResults[0].destination}` 
                  : ''}
            </h2>
            <AccommodationResults
              accommodations={accommodations}
              isLoading={isLoadingAccommodations}
              onSelect={handleAccommodationSelect}
            />
          </div>
        )}
        
        {/* Travel Inspiration Section - Only show when no search results */}
        {searchResults.length === 0 && !isLoading && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold text-center mb-10">Popular Destinations</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularDestinations.map((destination) => (
                <div 
                  key={destination.id}
                  className="rounded-xl overflow-hidden shadow-md card-hover"
                  onClick={() => {
                    // You could pre-fill the search form with this destination
                    console.log(`Selected destination: ${destination.code}`);
                  }}
                >
                  <div className="relative h-48">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                    <div className="absolute bottom-4 left-4 text-white z-20">
                      <h3 className="text-xl font-bold">{destination.name}</h3>
                      <p className="text-sm text-white/80">Explore flights</p>
                    </div>
                    <div className="w-full h-full bg-primary-100 flex items-center justify-center">
                      <span className="text-3xl">✈️</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
        
        {/* Features Section */}
        {searchResults.length === 0 && !isLoading && (
          <section className="mt-20 mb-16">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-white shadow-sm border border-primary-100 card-hover">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mb-4 text-white">
                  🔍
                </div>
                <h3 className="text-xl font-semibold mb-2">Easy Search</h3>
                <p className="text-neutral-600">Find the perfect flight with our powerful search engine</p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-accent-50 to-white shadow-sm border border-accent-100 card-hover">
                <div className="w-12 h-12 bg-accent-500 rounded-full flex items-center justify-center mb-4 text-white">
                  💰
                </div>
                <h3 className="text-xl font-semibold mb-2">Best Prices</h3>
                <p className="text-neutral-600">Compare prices across major airlines and booking sites</p>
              </div>
              
              <div className="p-6 rounded-xl bg-gradient-to-br from-primary-50 to-white shadow-sm border border-primary-100 card-hover">
                <div className="w-12 h-12 bg-primary-500 rounded-full flex items-center justify-center mb-4 text-white">
                  🏨
                </div>
                <h3 className="text-xl font-semibold mb-2">Complete Package</h3>
                <p className="text-neutral-600">Book your flight and accommodations in one place</p>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
