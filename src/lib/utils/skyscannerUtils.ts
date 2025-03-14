'use client';

import type { Flight, FlightSegment, Airport, Airline } from '../types/flight';
import type { FlightSearchResponse, Itinerary, Leg, Segment, Carrier, Place } from '../types/skyscanner';

/**
 * Formats a datetime object from Skyscanner to a local time string
 */
const formatDateTime = (dt: any): string => {
  if (!dt) return '';
  
  const date = new Date(
    dt.year,
    dt.month - 1, // JavaScript months are 0-based
    dt.day,
    dt.hour,
    dt.minute,
    dt.second
  );
  
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

/**
 * Formats a date object from Skyscanner to a string (YYYY-MM-DD)
 */
const formatDate = (dt: any): string => {
  if (!dt) return '';
  
  const date = new Date(
    dt.year,
    dt.month - 1, // JavaScript months are 0-based
    dt.day
  );
  
  return date.toISOString().split('T')[0];
};

/**
 * Transforms a Skyscanner API response into our internal Flight format
 * Note: Since we're using mock data for now, this function is not used
 * but it's here for when we integrate with the real API
 */
export const transformSkyscannerResponse = (
  response: FlightSearchResponse
): Flight[] => {
  // Mock implementation for now
  return [];
}; 