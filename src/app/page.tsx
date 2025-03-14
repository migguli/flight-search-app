'use client';

import { useState } from 'react';
import { FlightSearchForm, FlightSearchParams } from '@/components/features/search/FlightSearchForm';
import { FlightSearchResults, Flight } from '@/components/features/FlightSearchResults';
import { FlightFilters } from '@/components/features/FlightFilters';
import { TodoList } from '@/components/features/todo/TodoList';

export default function Home() {
  const [searchResults, setSearchResults] = useState<Flight[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [airlines, setAirlines] = useState<string[]>([]);

  const handleSearch = async (searchParams: FlightSearchParams) => {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      const mockResults: Flight[] = [
        {
          id: '1',
          airline: 'Finnair',
          flightNumber: 'AY123',
          departureTime: '10:00 AM',
          arrivalTime: '2:00 PM',
          origin: searchParams.origin,
          destination: searchParams.destination,
          price: 299,
          duration: '4h 00m',
          stops: 0,
        },
        {
          id: '2',
          airline: 'Norwegian',
          flightNumber: 'DY456',
          departureTime: '2:30 PM',
          arrivalTime: '7:45 PM',
          origin: searchParams.origin,
          destination: searchParams.destination,
          price: 199,
          duration: '5h 15m',
          stops: 1,
        },
      ];
      setSearchResults(mockResults);
      
      // Update filter values based on results
      const prices = mockResults.map(flight => flight.price);
      setMinPrice(Math.min(...prices));
      setMaxPrice(Math.max(...prices));
      setAirlines([...new Set(mockResults.map(flight => flight.airline))]);
    } catch (error) {
      console.error('Error fetching flights:', error);
      // TODO: Handle error state
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: any) => {
    // TODO: Implement filtering logic
    console.log('Filter changed:', filters);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Find Your Perfect Flight</h1>
        <div className="max-w-4xl mx-auto">
          <FlightSearchForm onSearch={handleSearch} />
          
          {(searchResults.length > 0 || isLoading) && (
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="md:col-span-1">
                <FlightFilters
                  onFilterChange={handleFilterChange}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  airlines={airlines}
                />
              </div>
              <div className="md:col-span-3">
                <FlightSearchResults
                  flights={searchResults}
                  isLoading={isLoading}
                />
              </div>
            </div>
          )}

          <div className="mt-12">
            <h2 className="text-2xl font-bold text-center mb-6">Travel Todo List</h2>
            <TodoList />
          </div>
        </div>
      </div>
    </main>
  );
}
