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
import { PopularDestinations, Destination } from '@/components/features/destinations';
import React from 'react';

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
    console.log('handleSearch called with params:', formParams);
    
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

      console.log('Transformed search params for API:', searchParams);

      // Use our Skyscanner search hook
      const flightResults = await searchFlights(searchParams);
      console.log('Flight results from API:', flightResults);
      
      // Transform API flights to UI flights
      const transformedFlights = flightResults.map((flight: APIFlight) => transformAPIFlight(flight));
      console.log('Transformed flights for UI:', transformedFlights);
      
      setSearchResults(transformedFlights);
      
      // Immediately fetch accommodations when flights are found
      if (transformedFlights.length > 0) {
        setIsLoadingAccommodations(true);
        try {
          // Extract the city name from the destination (remove any codes in parentheses)
          let cityName = formParams.destination
            .replace(/\([^)]*\)/g, '') // Remove anything in parentheses like (LON)
            .trim();
          
          // Handle airport codes in format like "LON_SKY"
          if (cityName.includes('_')) {
            // Keep the original format for the accommodationService to handle
            console.log(`Searching accommodations for airport code: "${cityName}"`);
          } else {
            console.log(`Searching accommodations for city: "${cityName}"`);
          }
          
          // Search for accommodations in the destination city
          const accommodationResponse = await AccommodationService.searchAccommodations({
            city: cityName,
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
      // Extract the city name from the destination (remove any codes in parentheses)
      const destinationCity = flight.destination
        .replace(/\([^)]*\)/g, '') // Remove anything in parentheses like (LON)
        .trim();
        
      console.log(`Flight selected: Searching accommodations for city: "${destinationCity}"`);

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

  // Function to handle destination selection
  const handleDestinationSelect = (destination: Destination) => {
    // Create search parameters with standardized destination format
    const cityName = destination.name.trim();
    
    console.log(`Searching for popular destination: ${cityName} (${destination.code})`);
    
    // Create a search for flights to the selected destination
    const searchParams = {
      origin: 'Helsinki', // Default origin
      destination: cityName, // Use just the city name without the code
      departureDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
      returnDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // 21 days from now
    };
    
    console.log('Search parameters:', searchParams);
    
    handleSearch(searchParams);
    
    // Smoothly scroll to the search results
    document.getElementById('search-results')?.scrollIntoView({ behavior: 'smooth' });
    
    console.log('Search initiated and scrolled to results');
  };

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-secondary text-foreground py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              <span className="text-primary">Discover</span> Your Next <span className="text-accent">Adventure</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
              Find and book flights to amazing destinations around the world
            </p>
            
            <div className="bg-white p-6 rounded-lg border border-border shadow-sm">
              <FlightSearchForm onSearch={handleSearch} />
            </div>
          </div>
        </div>
      </section>

      {/* Flight Search Results */}
      <section id="search-results" className="py-12 bg-background">
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
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-border">
                    <p className="text-center text-muted-foreground">
                      No accommodations found for this destination.
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <PopularDestinations onDestinationSelect={handleDestinationSelect} />
          )}
        </div>
      </section>
    </main>
  );
}
