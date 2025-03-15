import React from 'react';
import Image from 'next/image';

export interface Destination {
  id: number;
  name: string;
  gradient: string;
  code: string;
  imageUrl: string;
  iconUrl: string;
  iconLabel: string;
}

interface DestinationCardProps {
  destination: Destination;
  onSelect: (destination: Destination) => void;
}

export const DestinationCard: React.FC<DestinationCardProps> = ({ 
  destination, 
  onSelect 
}) => {
  return (
    <div 
      className="relative overflow-hidden rounded-lg cursor-pointer border border-border hover:border-primary transition-colors duration-300 shadow-sm hover:shadow-md group"
      onClick={() => onSelect(destination)}
    >
      <div className="relative h-64 w-full">
        {/* City image */}
        <Image 
          src={destination.imageUrl}
          alt={`${destination.name} city view`}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-opacity duration-300 group-hover:brightness-75 transition-all duration-300"
          priority
          loading="eager"
          onError={(e) => {
            // If image fails to load, apply a gradient background as fallback
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement?.classList.add(`bg-gradient-to-r`, destination.gradient);
          }}
        />
        
        {/* Overlay gradient for better text visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        
        {/* SVG icon that appears on hover */}
        <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
          <div className="bg-white bg-opacity-80 p-4 rounded-full transform scale-0 group-hover:scale-100 transition-transform duration-300">
            <Image 
              src={destination.iconUrl}
              alt={destination.iconLabel}
              width={40}
              height={40}
            />
          </div>
          <span className="text-white font-medium mt-2 px-2 py-1 bg-black bg-opacity-50 rounded-md transform scale-0 group-hover:scale-100 transition-transform duration-300 delay-100">
            {destination.iconLabel}
          </span>
        </div>
        
        {/* Destination info */}
        <div className="absolute bottom-0 left-0 p-6 text-white z-10">
          <h3 className="text-2xl font-bold mb-2">{destination.name}</h3>
          <p className="text-sm">Flights from €199</p>
        </div>
      </div>
    </div>
  );
}; 