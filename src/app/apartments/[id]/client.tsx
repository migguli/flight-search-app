'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { useState } from 'react';
import type { Accommodation } from '@/lib/types/accommodation';

interface ApartmentDetailsClientProps {
  apartment: Accommodation;
  error?: {
    status: number;
    message: string;
  } | null;
}

export function ApartmentDetailsClient({ apartment, error }: ApartmentDetailsClientProps) {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [bookingError, setBookingError] = useState<string | null>(null);

  const handleReserve = () => {
    // Implementation for reservation logic
    alert('Reservation functionality will be implemented in the future.');
  };

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
      {/* Error Message */}
      {error && (
        <div className="mb-8 p-4 border border-red-300 bg-red-50 rounded-lg">
          <h2 className="text-lg font-semibold text-red-700">Error {error.status}</h2>
          <p className="text-red-600">{error.message}</p>
          {error.status === 403 && (
            <div className="mt-2">
              <p className="text-sm text-red-600">
                This may be due to:
              </p>
              <ul className="list-disc pl-5 text-sm mt-1 text-red-600">
                <li>Missing or invalid API credentials</li>
                <li>Incorrect API URL configuration</li>
                <li>Server-side permissions issue</li>
              </ul>
            </div>
          )}
        </div>
      )}

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
            
            {bookingError && (
              <p className="mt-2 text-sm text-amber-500">
                {bookingError}
              </p>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
} 