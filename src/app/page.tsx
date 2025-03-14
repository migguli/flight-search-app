'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FlightSearchForm, FlightSearchParams as FormSearchParams } from '@/components/features/search/FlightSearchForm';
import { FlightSearchResults, Flight as UIFlight, transformAPIFlight } from '@/components/features/FlightSearchResults';
import { AccommodationResults } from '@/components/features/AccommodationResults';
import { AccommodationService } from '@/lib/api/accommodationService';
import { ApiError } from '@/lib/api/config';
import { useSkyscannerSearch } from '@/lib/hooks/useSkyscannerSearch';
import type { Flight as APIFlight, FlightSearchParams } from '@/lib/types/flight';
import type { Accommodation } from '@/lib/types/accommodation';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const { searchFlights, flights, isLoading: isLoadingFlights, error: flightError } = useSkyscannerSearch();
  const [searchResults, setSearchResults] = useState<UIFlight[]>([]);
  const [accommodations, setAccommodations] = useState<Accommodation[]>([]);
  const [isLoadingAccommodations, setIsLoadingAccommodations] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<UIFlight | null>(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState<Accommodation | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (formParams: FormSearchParams) => {
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

      // Use our Skyscanner search hook
      const flightResults = await searchFlights(searchParams);
      
      // Transform API flights to UI flights
      const transformedFlights = flightResults.map((flight: APIFlight) => transformAPIFlight(flight));
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
    }
  };

  const handleFlightSelect = async (flight: UIFlight) => {
    setSelectedFlight(flight);
    
    // We still want to update accommodations based on the selected flight
    setIsLoadingAccommodations(true);
    setError(null);

    try {
      // Use the destination from the selected flight
      const destinationCity = flight.destination;

      // Search for accommodations in the destination city based on the selected flight
      const accommodationResponse = await AccommodationService.searchAccommodations({
        city: destinationCity,
        checkIn: new Date().toISOString(),
        checkOut: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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

  // Function to search for a popular destination
  const searchPopularDestination = (destination: { name: string, code: string }) => {
    // Create a search for flights to the selected destination
    handleSearch({
      origin: 'Helsinki', // Default origin
      destination: destination.name,
      departureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      returnDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    });
    
    // Smoothly scroll to the search results
    document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
  };

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

      {/* Flight Search Results */}
      <section id="search-results" className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              <p>{error}</p>
            </div>
          )}
          
          {flightError && (
            <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
              <p>{flightError}</p>
            </div>
          )}

          {isLoadingFlights ? (
            <div className="text-center py-12">
              <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-lg">Searching for the best flights...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold mb-6">Flight Results</h2>
                <FlightSearchResults 
                  flights={searchResults} 
                  onSelect={handleFlightSelect} 
                  isLoading={false}
                />
              </div>
              
              <div>
                <h2 className="text-2xl font-bold mb-6">Accommodations</h2>
                {isLoadingAccommodations ? (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Finding accommodations...</p>
                  </div>
                ) : accommodations.length > 0 ? (
                  <AccommodationResults
                    accommodations={accommodations}
                    onSelect={handleAccommodationSelect}
                    isLoading={false}
                  />
                ) : (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <p className="text-center text-gray-500">
                      No accommodations found for this destination.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {popularDestinations.map(destination => (
                  <div 
                    key={destination.id} 
                    className="relative overflow-hidden rounded-xl card-hover cursor-pointer"
                    onClick={() => searchPopularDestination(destination)}
                  >
                    <div className="aspect-w-16 aspect-h-9 relative">
                      <Image
                        src={destination.image}
                        alt={destination.name}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                      <div className="absolute bottom-0 left-0 p-4 text-white">
                        <h3 className="text-xl font-bold">{destination.name}</h3>
                        <p className="text-sm opacity-90">Flights from €199</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
