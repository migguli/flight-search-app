import React, { useState } from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import Image from 'next/image';
import type { Accommodation } from '@/lib/types/accommodation';

interface AccommodationResultsProps {
  accommodations: Accommodation[];
  isLoading?: boolean;
  onSelect?: (accommodation: Accommodation) => void;
}

export const AccommodationResults: React.FC<AccommodationResultsProps> = ({
  accommodations,
  isLoading,
  onSelect,
}) => {
  // State to track how many accommodations to show
  const [visibleCount, setVisibleCount] = useState(3);
  
  // Function to show more accommodations
  const handleShowMore = () => {
    setVisibleCount(prevCount => Math.min(prevCount + 5, accommodations.length));
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-48 bg-gray-200 rounded-lg mb-4" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!accommodations.length) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-gray-500">No accommodations found.</p>
        </CardContent>
      </Card>
    );
  }

  // Sort accommodations by rating (most popular first)
  const sortedAccommodations = [...accommodations].sort((a, b) => b.rating - a.rating);
  
  // Get only the visible accommodations
  const visibleAccommodations = sortedAccommodations.slice(0, visibleCount);
  
  // Check if there are more accommodations to show
  const hasMoreToShow = visibleCount < accommodations.length;

  return (
    <div className="space-y-4">
      {visibleAccommodations.map((accommodation) => (
        <Card key={accommodation.id} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1 relative h-48">
                <Image
                  src={accommodation.images[0]}
                  alt={accommodation.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  quality={80}
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="md:col-span-2">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold">{accommodation.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{accommodation.type}</p>
                    <div className="flex items-center mt-2">
                      <span className="text-yellow-500">★</span>
                      <span className="ml-1">{accommodation.rating.toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({accommodation.numberOfReviews} reviews)</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">
                      {accommodation.price.currency} {accommodation.price.amount}
                    </p>
                    <p className="text-sm text-gray-600">per {accommodation.price.per}</p>
                    <Button 
                      className="mt-2" 
                      onClick={() => onSelect?.(accommodation)}
                    >
                      View Details
                    </Button>
                  </div>
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600">{accommodation.description}</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {accommodation.amenities.slice(0, 4).map((amenity, index) => (
                      <span
                        key={index}
                        className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-600"
                      >
                        {amenity}
                      </span>
                    ))}
                    {accommodation.amenities.length > 4 && (
                      <span className="inline-block px-2 py-1 text-xs bg-gray-100 rounded-full text-gray-600">
                        +{accommodation.amenities.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Show more button - only displayed if there are more accommodations to show */}
      {hasMoreToShow && (
        <div className="text-center mt-4">
          <Button 
            variant="outline" 
            onClick={handleShowMore}
            className="px-6"
          >
            Show more
          </Button>
        </div>
      )}
    </div>
  );
}; 