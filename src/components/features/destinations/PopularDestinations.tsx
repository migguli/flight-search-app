import React from 'react';
import { DestinationCard, Destination } from './DestinationCard';

// Popular destinations data
const popularDestinations: Destination[] = [
  { 
    id: 1, 
    name: 'Paris', 
    gradient: 'from-blue-500 to-indigo-600', 
    code: 'CDG', 
    imageUrl: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?q=80&w=1000&auto=format&fit=crop',
    iconUrl: '/images/icons/paris.svg',
    iconLabel: 'Eiffel Tower'
  },
  { 
    id: 2, 
    name: 'Tokyo', 
    gradient: 'from-red-500 to-pink-600', 
    code: 'HND', 
    imageUrl: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?q=80&w=1000&auto=format&fit=crop',
    iconUrl: '/images/icons/tokyo.svg',
    iconLabel: 'Tokyo Tower'
  },
  { 
    id: 3, 
    name: 'New York', 
    gradient: 'from-green-500 to-teal-600', 
    code: 'JFK', 
    imageUrl: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?q=80&w=1000&auto=format&fit=crop',
    iconUrl: '/images/icons/newyork.svg',
    iconLabel: 'Empire State Building'
  },
  { 
    id: 4, 
    name: 'Sydney', 
    gradient: 'from-yellow-500 to-orange-600', 
    code: 'SYD', 
    imageUrl: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?q=80&w=1000&auto=format&fit=crop',
    iconUrl: '/images/icons/sydney.svg',
    iconLabel: 'Opera House'
  },
];

interface PopularDestinationsProps {
  onDestinationSelect: (destination: Destination) => void;
}

export const PopularDestinations: React.FC<PopularDestinationsProps> = ({ 
  onDestinationSelect 
}) => {
  return (
    <div className="text-center py-12">
      <h2 className="text-2xl font-bold mb-6">Popular Destinations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {popularDestinations.map(destination => (
          <DestinationCard 
            key={destination.id}
            destination={destination}
            onSelect={onDestinationSelect}
          />
        ))}
      </div>
    </div>
  );
};

// Export the destinations data for use elsewhere if needed
export { popularDestinations }; 