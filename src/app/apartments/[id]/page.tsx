import { Accommodation } from '@/lib/types/accommodation';
import { ApartmentDetailsClient } from './client';
import { AccommodationService } from '@/lib/api/accommodationService';
import { ApiError } from '@/lib/api/config';

// Generate static parameters for export
export function generateStaticParams() {
  // Generate static routes for these IDs
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
    { id: '4' },
    { id: '5' },
  ];
}

// Fallback mock data if API fails
const mockApartment = {
  id: '1',
  title: 'Luxury Downtown Apartment',
  description: 'Beautiful modern apartment in the heart of the city with stunning views.',
  price: {
    amount: 150,
    currency: 'USD',
    per: 'night'
  },
  location: {
    address: '123 Main St',
    city: 'New York',
    country: 'USA',
    coordinates: { latitude: 40.7128, longitude: -74.0060 }
  },
  amenities: [
    'WiFi',
    'Air Conditioning',
    'Full Kitchen',
    'Washer/Dryer',
    'Pool',
    'Gym'
  ],
  images: [
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'
  ],
  host: {
    id: 'host-1',
    name: 'John Doe',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    rating: 4.8,
    numberOfReviews: 156,
    isSuperhost: true,
    responseRate: 98,
    responseTime: 'within an hour',
    joinedDate: '2018-05'
  },
  rating: 4.9,
  numberOfReviews: 48,
  type: 'Apartment',
  instantBookable: true,
  capacity: {
    guests: 4,
    bedrooms: 2,
    beds: 2,
    bathrooms: 1
  }
};

// Define the interface for page props to match Next.js expectations
type ApartmentPageProps = {
  params: {
    id: string;
  };
  searchParams?: Record<string, string | string[] | undefined>;
};

// Server component that gets the data
export default async function Page({ params }: ApartmentPageProps) {
  let apartment: Accommodation;
  let error = null;
  
  try {
    // Try to fetch the apartment details from the API
    apartment = await AccommodationService.getAccommodationById(params.id);
  } catch (err) {
    // Handle API errors
    console.error("Error fetching apartment details:", err);
    
    if (err instanceof ApiError && err.status === 403) {
      error = {
        status: 403,
        message: "You don't have permission to access this apartment details. Please check your authentication credentials."
      };
    } else {
      error = {
        status: 500,
        message: "Failed to load apartment details. Using fallback data."
      };
    }
    
    // Use mock data as fallback
    apartment = mockApartment as Accommodation;
  }
  
  return <ApartmentDetailsClient apartment={apartment} error={error} />;
} 