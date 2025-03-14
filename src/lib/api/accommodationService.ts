import { API_BASE_URL, DEFAULT_HEADERS, handleApiResponse, ApiError } from './config';
import type { Accommodation, AccommodationSearchParams, AccommodationSearchResponse } from '../types/accommodation';
import { getRandomImagesForProperty } from '../utils/images';

// Cities data with their coordinates
const cities = [
  { city: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
  { city: 'London', country: 'United Kingdom', lat: 51.5074, lon: -0.1278 },
  { city: 'New York', country: 'USA', lat: 40.7128, lon: -74.0060 },
  { city: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { city: 'Barcelona', country: 'Spain', lat: 41.3851, lon: 2.1734 },
  // ... adding more cities would make this file very long, so I'll keep it shorter for demonstration
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
    filteredCities = cities.filter(c => 
      c.city.toLowerCase().includes(params.city!.toLowerCase())
    );
  }

  // Generate 3-4 properties for each city
  filteredCities.forEach(city => {
    const numProperties = 3 + Math.floor(Math.random() * 2); // 3 or 4
    
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
} 