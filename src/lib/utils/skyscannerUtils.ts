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
 */
export const transformSkyscannerResponse = (
  response: FlightSearchResponse
): Flight[] => {
  const { itineraries, legs, segments, carriers, places } = response.content.results;
  
  // Create lookup maps for faster access
  const legsMap = new Map(legs.map(leg => [leg.id, leg]));
  const segmentsMap = new Map(segments.map(segment => [segment.id, segment]));
  const carriersMap = new Map(carriers.map(carrier => [carrier.id, carrier]));
  const placesMap = new Map(places.map(place => [place.id, place]));
  
  return itineraries.map((itinerary: Itinerary) => {
    // For simplicity, we'll take the first leg (outbound) and first pricing option
    const legId = itinerary.legIds[0];
    const leg = legsMap.get(legId) as Leg;
    
    // For pricing, take the lowest price
    const pricingOption = itinerary.pricingOptions.reduce(
      (lowest, current) => 
        current.price.amount < lowest.price.amount ? current : lowest,
      itinerary.pricingOptions[0]
    );
    
    // Create the flight segments from leg segments
    const flightSegments: FlightSegment[] = leg.segmentIds.map(segmentId => {
      const segment = segmentsMap.get(segmentId) as Segment;
      const carrier = carriersMap.get(segment.carrierId) as Carrier;
      const departurePlace = placesMap.get(segment.originPlaceId) as Place;
      const arrivalPlace = placesMap.get(segment.destinationPlaceId) as Place;
      
      const departureAirport: Airport = {
        code: departurePlace.displayCode,
        name: departurePlace.name,
        city: departurePlace.name,
        country: '', // Would need to map from parent place
      };
      
      const arrivalAirport: Airport = {
        code: arrivalPlace.displayCode,
        name: arrivalPlace.name,
        city: arrivalPlace.name,
        country: '', // Would need to map from parent place
      };
      
      const airline: Airline = {
        code: carrier.id,
        name: carrier.name,
        logo: carrier.logoUrl,
      };
      
      return {
        departureAirport,
        arrivalAirport,
        departureTime: formatDateTime(segment.departureDateTime),
        arrivalTime: formatDateTime(segment.arrivalDateTime),
        duration: `${Math.floor(segment.durationInMinutes / 60)}h ${segment.durationInMinutes % 60}m`,
        airline,
        flightNumber: segment.flightNumber,
      };
    });
    
    // Convert to our Flight type
    return {
      id: leg.id,
      segments: flightSegments,
      price: {
        amount: pricingOption.price.amount,
        currency: pricingOption.price.unit,
      },
      stops: leg.stopCount,
      totalDuration: `${Math.floor(leg.durationInMinutes / 60)}h ${leg.durationInMinutes % 60}m`,
      bookingUrl: pricingOption.items[0]?.deepLink || '',
    };
  });
}; 