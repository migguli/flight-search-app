import { API_BASE_URL, DEFAULT_HEADERS, handleApiResponse, ApiError } from './config';
import type { Accommodation, AccommodationSearchParams, AccommodationSearchResponse } from '../types/accommodation';
import { getRandomImagesForProperty } from '../utils/images';
import { airportToCityMapping, extractAirportCode, getAirportCity } from '../utils/airportUtils';

// Cities data with their coordinates
const cities = [
  { city: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { city: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060 },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { city: 'Barcelona', country: 'Spain', lat: 41.3851, lon: 2.1734 },
  { city: 'Rome', country: 'Italy', lat: 41.9028, lon: 12.4964 },
  { city: 'Amsterdam', country: 'Netherlands', lat: 52.3676, lon: 4.9041 },
  { city: 'Berlin', country: 'Germany', lat: 52.5200, lon: 13.4050 },
  { city: 'Madrid', country: 'Spain', lat: 40.4168, lon: -3.7038 },
  { city: 'Vienna', country: 'Austria', lat: 48.2082, lon: 16.3738 },
  { city: 'Prague', country: 'Czech Republic', lat: 50.0755, lon: 14.4378 },
  { city: 'Helsinki', country: 'Finland', lat: 60.1699, lon: 24.9384 },
  { city: 'Stockholm', country: 'Sweden', lat: 59.3293, lon: 18.0686 },
  { city: 'Oslo', country: 'Norway', lat: 59.9139, lon: 10.7522 },
  { city: 'Copenhagen', country: 'Denmark', lat: 55.6761, lon: 12.5683 },
  { city: 'Lisbon', country: 'Portugal', lat: 38.7223, lon: -9.1393 },
  { city: 'Sydney', country: 'Australia', lat: -33.8688, lon: 151.2093 },
  { city: 'Melbourne', country: 'Australia', lat: -37.8136, lon: 144.9631 },
  { city: 'Singapore', country: 'Singapore', lat: 1.3521, lon: 103.8198 },
  { city: 'Hong Kong', country: 'China', lat: 22.3193, lon: 114.1694 },
  { city: 'Dubai', country: 'UAE', lat: 25.2048, lon: 55.2708 },
  { city: 'Istanbul', country: 'Turkey', lat: 41.0082, lon: 28.9784 },
  { city: 'Bangkok', country: 'Thailand', lat: 13.7563, lon: 100.5018 },
  { city: 'Seoul', country: 'South Korea', lat: 37.5665, lon: 126.9780 },
  { city: 'Mumbai', country: 'India', lat: 19.0760, lon: 72.8777 },
  { city: 'Cape Town', country: 'South Africa', lat: -33.9249, lon: 18.4241 },
  { city: 'Rio de Janeiro', country: 'Brazil', lat: -22.9068, lon: -43.1729 },
  { city: 'Buenos Aires', country: 'Argentina', lat: -34.6037, lon: -58.3816 },
  { city: 'Mexico City', country: 'Mexico', lat: 19.4326, lon: -99.1332 },
  { city: 'Vancouver', country: 'Canada', lat: 49.2827, lon: -123.1207 },
  { city: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832 },
  { city: 'San Francisco', country: 'USA', lat: 37.7749, lon: -122.4194 },
  { city: 'Los Angeles', country: 'USA', lat: 34.0522, lon: -118.2437 },
  { city: 'Chicago', country: 'USA', lat: 41.8781, lon: -87.6298 },
  { city: 'Miami', country: 'USA', lat: 25.7617, lon: -80.1918 },
  { city: 'Athens', country: 'Greece', lat: 37.9838, lon: 23.7275 },
  { city: 'Venice', country: 'Italy', lat: 45.4408, lon: 12.3155 },
  { city: 'Florence', country: 'Italy', lat: 43.7696, lon: 11.2558 },
  { city: 'Zurich', country: 'Switzerland', lat: 47.3769, lon: 8.5417 },
  { city: 'Geneva', country: 'Switzerland', lat: 46.2044, lon: 6.1432 },
];

// Common host profiles to mix and match
const hostProfiles = [
  {
    name: 'Sophie Martin',
    avatar: 'https://randomuser.me/api/portraits/women/1.jpg',
    isSuperhost: true,
    responseRate: 98,
    responseTime: 'within an hour',
  },
  {
    name: 'James Wilson',
    avatar: 'https://randomuser.me/api/portraits/men/2.jpg',
    isSuperhost: true,
    responseRate: 99,
    responseTime: 'within an hour',
  },
  {
    name: 'Maria Garcia',
    avatar: 'https://randomuser.me/api/portraits/women/3.jpg',
    isSuperhost: false,
    responseRate: 95,
    responseTime: 'within a few hours',
  },
  {
    name: 'John Smith',
    avatar: 'https://randomuser.me/api/portraits/men/4.jpg',
    isSuperhost: false,
    responseRate: 92,
    responseTime: 'within a day',
  },
];

// Common amenities to mix and match
const amenities = [
  'Wifi',
  'Kitchen',
  'Washer',
  'Dryer',
  'Air conditioning',
  'Heating',
  'Dedicated workspace',
  'TV',
  'Hair dryer',
  'Iron',
  'Pool',
  'Free parking',
  'Gym',
  'Hot tub',
  'BBQ grill',
  'Garden view',
  'City view',
  'Balcony',
  'Coffee maker',
  'Dishwasher'
];

// Property types
const propertyTypes = [
  'Entire apartment',
  'Private room',
  'Entire house',
  'Entire villa',
  'Entire cottage',
  'Entire loft'
];

const generateMockAccommodations = (params: AccommodationSearchParams): Accommodation[] => {
  const accommodations: Accommodation[] = [];
  
  // Filter cities based on search params if provided
  let filteredCities = cities;
  if (params.city) {
    const searchCity = params.city.toLowerCase().trim();
    
    // First try to match by city name
    filteredCities = cities.filter(c => 
      c.city.toLowerCase().includes(searchCity)
    );
    
    // If no matches found, try to extract city name from airport code format (e.g., "LON_SKY")
    if (filteredCities.length === 0 && searchCity.includes('_')) {
      // Extract the airport code (e.g., "CDG" from "CDG_SKY")
      const airportCode = extractAirportCode(searchCity);
      
      if (airportCode) {
        // Try to find the corresponding city for this airport code
        const mappedCity = getAirportCity(airportCode);
        
        if (mappedCity) {
          // Find the city in our cities array
          filteredCities = cities.filter(c => 
            c.city.toLowerCase() === mappedCity.toLowerCase()
          );
        }
      }
      
      // If still no matches, try to find cities that might match this code (first 3 letters)
      if (filteredCities.length === 0) {
        const cityCode = searchCity.split('_')[0].toLowerCase();
        filteredCities = cities.filter(c => 
          c.city.toLowerCase().startsWith(cityCode) || 
          c.city.toLowerCase().includes(cityCode)
        );
      }
    }
    
    // If no cities match, log this for debugging
    if (filteredCities.length === 0) {
      console.log(`No cities found matching '${searchCity}'. Available cities:`, 
        cities.map(c => c.city.toLowerCase()));
      
      // Return empty array when no matches found
      return [];
    }
  }

  // Generate 2-10 properties for each city
  filteredCities.forEach(city => {
    const numProperties = 2 + Math.floor(Math.random() * 9); // 2 to 10
    
    for (let i = 0; i < numProperties; i++) {
      const host = hostProfiles[Math.floor(Math.random() * hostProfiles.length)];
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      
      // Generate random coordinates near the city center
      const latOffset = (Math.random() - 0.5) * 0.1;
      const lonOffset = (Math.random() - 0.5) * 0.1;
      
      const accommodation: Accommodation = {
        id: `${city.city.toLowerCase()}-${i + 1}`,
        title: `${propertyType} in ${city.city}`,
        description: `Beautiful ${propertyType.toLowerCase()} in the heart of ${city.city}. Perfect for your stay!`,
        host: {
          id: `host-${Math.random().toString(36).substr(2, 9)}`,
          name: host.name,
          avatar: host.avatar,
          rating: 4 + Math.random(),
          numberOfReviews: Math.floor(Math.random() * 200) + 10,
          isSuperhost: host.isSuperhost,
          responseRate: host.responseRate,
          responseTime: host.responseTime,
          joinedDate: `${2015 + Math.floor(Math.random() * 8)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}`,
        },
        location: {
          city: city.city,
          country: city.country,
          address: `${Math.floor(Math.random() * 200) + 1} Sample Street`,
          coordinates: {
            latitude: city.lat + latOffset,
            longitude: city.lon + lonOffset,
          },
        },
        images: getRandomImagesForProperty(propertyType),
        price: {
          amount: Math.floor(Math.random() * 300) + 50,
          currency: 'EUR',
          per: 'night',
        },
        amenities: [...amenities].sort(() => 0.5 - Math.random()).slice(0, 8),
        capacity: {
          guests: Math.floor(Math.random() * 6) + 1,
          bedrooms: Math.floor(Math.random() * 3) + 1,
          beds: Math.floor(Math.random() * 4) + 1,
          bathrooms: Math.floor(Math.random() * 2) + 1,
        },
        rating: 4 + Math.random(),
        numberOfReviews: Math.floor(Math.random() * 100) + 5,
        type: propertyType,
        instantBookable: Math.random() > 0.3,
      };
      
      accommodations.push(accommodation);
    }
  });

  return accommodations;
};

export class AccommodationService {
  static async searchAccommodations(params: AccommodationSearchParams): Promise<AccommodationSearchResponse> {
    try {
      // Check if we're using the example API URL
      if (API_BASE_URL.includes('example')) {
        console.warn('Using mock data as API_BASE_URL is not configured');
        
        // Handle airport codes in the city parameter
        if (params.city && params.city.includes('_')) {
          const modifiedParams = { ...params };
          const airportCode = extractAirportCode(params.city);
          
          if (airportCode) {
            const cityForAirport = getAirportCity(airportCode);
            if (cityForAirport) {
              console.log(`Mapping airport code ${airportCode} to city ${cityForAirport}`);
              modifiedParams.city = cityForAirport;
              return this.getMockResponse(modifiedParams);
            }
          }
        }
        
        return this.getMockResponse(params);
      }

      const queryParams = new URLSearchParams();
      if (params.city) queryParams.append('city', params.city);
      if (params.country) queryParams.append('country', params.country);
      if (params.checkIn) queryParams.append('checkIn', params.checkIn);
      if (params.checkOut) queryParams.append('checkOut', params.checkOut);
      if (params.guests) queryParams.append('guests', params.guests.toString());
      if (params.priceMin) queryParams.append('priceMin', params.priceMin.toString());
      if (params.priceMax) queryParams.append('priceMax', params.priceMax.toString());

      const response = await fetch(
        `${API_BASE_URL}/accommodations/search?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        }
      );

      return handleApiResponse(response);
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return this.getMockResponse(params);
    }
  }

  private static getMockResponse(params: AccommodationSearchParams): AccommodationSearchResponse {
    const mockAccommodations = generateMockAccommodations(params);
    
    return {
      accommodations: mockAccommodations,
      totalResults: mockAccommodations.length
    };
  }

  static async getAccommodationDetails(accommodationId: string) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/accommodations/${accommodationId}`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        }
      );

      return handleApiResponse(response);
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while fetching accommodation details');
    }
  }

  static async getAccommodationById(id: string): Promise<Accommodation> {
    try {
      // Check if we're using the example API URL
      if (API_BASE_URL.includes('example')) {
        console.warn('Using mock data as API_BASE_URL is not configured');
        return this.getMockAccommodationById(id);
      }

      console.log(`Fetching accommodation details from: ${API_BASE_URL}/accommodations/${id}`);
      
      const response = await fetch(
        `${API_BASE_URL}/accommodations/${id}`,
        {
          method: 'GET',
          headers: {
            ...DEFAULT_HEADERS,
            // Add any authentication headers if needed
            // 'Authorization': `Bearer ${process.env.NEXT_PUBLIC_API_KEY}`,
          },
          // Add credentials if needed for cookies/auth
          credentials: 'include',
        }
      );

      // Log response status for debugging
      console.log(`API response status: ${response.status}`);
      
      if (response.status === 403) {
        console.error('403 Forbidden error when fetching accommodation details. Please check API credentials and permissions.');
        throw new ApiError(
          403,
          'You don\'t have permission to access this resource. Please check your API credentials.',
          { id }
        );
      }

      return handleApiResponse(response);
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      
      // Rethrow the error if it's already an ApiError
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Otherwise create a new ApiError
      throw new ApiError(
        500, 
        'Failed to fetch accommodation details from API', 
        { originalError: error, id }
      );
    }
  }

  private static getMockAccommodationById(id: string): Accommodation {
    // Generate mock accommodations and find the one with matching ID
    const allMockAccommodations = generateMockAccommodations({});
    
    // Check if id starts with '[' and ends with ']' (which might happen if Next.js route parameter is used directly)
    const cleanId = id.replace(/^\[|\]$/g, '');
    
    // First try exact match
    let accommodation = allMockAccommodations.find(acc => acc.id === cleanId);
    
    // If not found, try partial match (in case id contains city prefix or other pattern)
    if (!accommodation) {
      accommodation = allMockAccommodations.find(acc => 
        acc.id.includes(cleanId) || cleanId.includes(acc.id)
      );
    }
    
    // If still not found, just return the first accommodation as fallback
    if (!accommodation && allMockAccommodations.length > 0) {
      console.warn(`Accommodation with ID ${id} not found, using first available one as fallback`);
      return allMockAccommodations[0];
    }
    
    if (!accommodation) {
      throw new Error(`Accommodation with ID ${id} not found and no fallbacks available`);
    }
    
    return accommodation;
  }

  static async getCityListingCounts(): Promise<Record<string, number>> {
    try {
      // Check if we're using the example API URL
      if (API_BASE_URL.includes('example')) {
        console.warn('Using mock data as API_BASE_URL is not configured');
        return this.getMockCityListingCounts();
      }

      const response = await fetch(
        `${API_BASE_URL}/accommodations/city-counts`,
        {
          method: 'GET',
          headers: DEFAULT_HEADERS,
        }
      );

      return handleApiResponse(response);
    } catch (error) {
      console.warn('API call failed, falling back to mock data:', error);
      return this.getMockCityListingCounts();
    }
  }

  private static getMockCityListingCounts(): Record<string, number> {
    // Generate mock accommodations for all cities
    const allAccommodations = generateMockAccommodations({});
    
    // Count accommodations by city
    const cityCounts: Record<string, number> = {};
    
    allAccommodations.forEach(accommodation => {
      const city = accommodation.location.city;
      if (!cityCounts[city]) {
        cityCounts[city] = 0;
      }
      cityCounts[city]++;
    });
    
    return cityCounts;
  }
} 