import { useState, useCallback } from 'react';
import { FlightService } from '../api/flightService';
import type { FlightSearchParams, FlightSearchResponse } from '../types/flight';

interface UseFlightSearchReturn {
  results: FlightSearchResponse | null;
  loading: boolean;
  error: Error | null;
  searchFlights: (params: FlightSearchParams) => Promise<void>;
}

// Simple in-memory cache
const cache = new Map<string, { data: FlightSearchResponse; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useFlightSearch(): UseFlightSearchReturn {
  const [results, setResults] = useState<FlightSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const searchFlights = useCallback(async (params: FlightSearchParams) => {
    setLoading(true);
    setError(null);

    try {
      // Create cache key from search parameters
      const cacheKey = JSON.stringify(params);
      const now = Date.now();
      const cached = cache.get(cacheKey);

      // Check if we have valid cached data
      if (cached && now - cached.timestamp < CACHE_DURATION) {
        setResults(cached.data);
        setLoading(false);
        return;
      }

      // Fetch new data
      const data = await FlightService.searchFlights(params);
      
      // Update cache
      cache.set(cacheKey, { data, timestamp: now });
      
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('An error occurred while searching flights'));
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return { results, loading, error, searchFlights };
} 