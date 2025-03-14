'use client';

import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useState, useEffect } from 'react';
import { AccommodationService } from '@/lib/api/accommodationService';
import type { Accommodation } from '@/lib/types/accommodation';

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

export default function ApartmentDetails() {
  const params = useParams();
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [apartment, setApartment] = useState<Accommodation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchApartmentDetails = async () => {
      if (!params.id) {
        setError('No apartment ID provided');
        setIsLoading(false);
        return;
      }

      try {
        // In a real app, fetch the actual data from the API
        const response = await AccommodationService.getAccommodationById(params.id as string);
        setApartment(response);
      } catch (error) {
        console.error('Error fetching apartment:', error);
        // Fallback to mock data if API call fails
        setApartment(mockApartment as unknown as Accommodation);
        setError('Could not fetch apartment details. Showing mock data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchApartmentDetails();
  }, [params.id]);

  const handleReserve = () => {
    // Implementation for reservation logic
    alert('Reservation functionality will be implemented in the future.');
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
          <div className="h-[400px] bg-gray-200 rounded-lg mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-40 bg-gray-200 rounded-lg mb-8"></div>
              <div className="h-20 bg-gray-200 rounded-lg mb-8"></div>
            </div>
            <div>
              <div className="h-80 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && !apartment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
          <p className="text-red-500">{error}</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-amber-50 border border-amber-200 rounded-lg">
          <h2 className="text-xl font-semibold text-amber-600 mb-2">Apartment Not Found</h2>
          <p className="text-amber-500">The requested apartment could not be found.</p>
          <Button className="mt-4" onClick={() => router.back()}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{apartment.title}</h1>
        <div className="flex items-center gap-4">
          <Badge variant="secondary">
            ★ {apartment.rating} ({apartment.numberOfReviews} reviews)
          </Badge>
          <span className="text-muted-foreground">
            {apartment.location?.city}, {apartment.location?.country}
          </span>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src={apartment.images[0]}
            alt={apartment.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            quality={80}
            className="object-cover"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {apartment.images.slice(1, 3).map((image, index) => (
            <div key={index} className="relative h-[190px] rounded-lg overflow-hidden">
              <Image
                src={image}
                alt={`${apartment.title} ${index + 2}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                quality={80}
                className="object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2">
          {/* Host Information */}
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-4 mb-4">
              <div className="relative w-16 h-16 rounded-full overflow-hidden">
                <Image
                  src={apartment.host?.avatar || "/mock/host-avatar.jpg"}
                  alt={`${apartment.host?.name || 'Host'}`}
                  fill
                  sizes="64px"
                  quality={80}
                  className="object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Hosted by {apartment.host?.name || "Host"}</h3>
                <p className="text-muted-foreground">
                  ★ {apartment.host?.rating || 4.5} · {apartment.host?.numberOfReviews || 0} reviews
                </p>
                <p className="text-sm">Response time: {apartment.host?.responseTime || "1 day"}</p>
              </div>
            </div>
          </Card>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About this place</h2>
            <p className="text-muted-foreground">{apartment.description}</p>
          </div>

          {/* Amenities */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">What this place offers</h2>
            <div className="grid grid-cols-2 gap-4">
              {apartment.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="text-muted-foreground">✓</span>
                  {amenity}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column - Booking */}
        <div>
          <Card className="p-6 sticky top-8">
            <div className="mb-4">
              <span className="text-2xl font-bold">
                {apartment.price.currency} {apartment.price.amount}
              </span>
              <span className="text-muted-foreground"> / {apartment.price.per}</span>
            </div>

            {/* Calendar */}
            <div className="mb-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
              />
            </div>

            <Button className="w-full" size="lg" onClick={handleReserve}>
              Reserve
            </Button>
            
            {error && (
              <p className="mt-2 text-sm text-amber-500">
                {error}
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 