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
    setIsLoadingAccommodations(true);
    setError(null);

    try {
      // Search for accommodations in the destination city
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
      setAccommodations([]);
    } finally {
      setIsLoadingAccommodations(false);
    }

    if (flight.bookingUrl) {
      window.open(flight.bookingUrl, '_blank');
    }
  };

  const handleAccommodationSelect = (accommodation: Accommodation) => {
    setSelectedAccommodation(accommodation);
    // Navigate to the apartment details page
    router.push(`/apartments/${accommodation.id}`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Find Your Perfect Flight & Stay</h1>
        <div className="max-w-4xl mx-auto">
          <FlightSearchForm onSearch={handleSearch} />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
          
          {(searchResults.length > 0 || isLoading) && (
            <div className="mt-8">
              <h2 className="text-2xl font-semibold mb-4">Available Flights</h2>
              <FlightSearchResults
                flights={searchResults}
                isLoading={isLoading}
                onSelect={handleFlightSelect}
              />
            </div>
          )}

          {selectedFlight && (
            <div className="mt-12">
              <h2 className="text-2xl font-semibold mb-4">
                Available Accommodations in {selectedFlight.destination}
              </h2>
              <AccommodationResults
                accommodations={accommodations}
                isLoading={isLoadingAccommodations}
                onSelect={handleAccommodationSelect}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
