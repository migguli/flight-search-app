'use client';

import { useState } from 'react';
import { FlightSearchForm, FlightSearchParams as FormSearchParams } from '@/components/features/search/FlightSearchForm';
import { FlightSearchResults, Flight, transformAPIFlight } from '@/components/features/FlightSearchResults';
import { FlightService } from '@/lib/api/flightService';
import { ApiError } from '@/lib/api/config';
import type { FlightSearchParams } from '@/lib/types/flight';

export default function Home() {
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (formParams: FormSearchParams) => {
    setIsLoading(true);
    setError(null);
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

  const handleFlightSelect = (flight: Flight) => {
    setSelectedFlight(flight);
    // TODO: Implement booking flow or navigation to booking page
    console.log('Selected flight:', flight);
    alert(`Flight ${flight.flightNumber} selected! This will be connected to the booking flow.`);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Find Your Perfect Flight</h1>
        <div className="max-w-4xl mx-auto">
          <FlightSearchForm onSearch={handleSearch} />
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}
          
          {(searchResults.length > 0 || isLoading) && (
            <div className="mt-8">
              <FlightSearchResults
                flights={searchResults}
                isLoading={isLoading}
                onSelect={handleFlightSelect}
              />
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
