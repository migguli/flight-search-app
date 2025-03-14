export interface Host {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  numberOfReviews: number;
  isSuperhost: boolean;
  responseRate: number;
  responseTime: string;
  joinedDate: string;
}

export interface Accommodation {
  id: string;
  title: string;
  description: string;
  host: Host;
  location: {
    city: string;
    country: string;
    address: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  images: string[];
  price: {
    amount: number;
    currency: string;
    per: 'night' | 'week' | 'month';
  };
  amenities: string[];
  capacity: {
    guests: number;
    bedrooms: number;
    beds: number;
    bathrooms: number;
  };
  rating: number;
  numberOfReviews: number;
  type: string;
  instantBookable: boolean;
}

export interface AccommodationSearchParams {
  city?: string;
  country?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
  priceMin?: number;
  priceMax?: number;
}

export interface AccommodationSearchResponse {
  accommodations: Accommodation[];
  totalResults: number;
} 