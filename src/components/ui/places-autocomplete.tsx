"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Input, InputProps } from './input'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Add the Google Maps Places API types
declare global {
  interface Window {
    google: {
      maps: {
        places: {
          Autocomplete: new (
            input: HTMLInputElement, 
            options?: google.maps.places.AutocompleteOptions
          ) => google.maps.places.Autocomplete;
        };
        event: {
          clearInstanceListeners: (instance: any) => void;
        };
      };
    };
    initGoogleMapsPlaces: () => void;
  }
}

// Define necessary Google Maps types
declare namespace google.maps.places {
  interface AutocompleteOptions {
    types?: string[];
    fields?: string[];
  }
  
  interface Autocomplete {
    addListener: (event: string, callback: () => void) => void;
    getPlace: () => PlaceResult;
  }
  
  interface PlaceResult {
    place_id?: string;
    name?: string;
    formatted_address?: string;
    geometry?: {
      location?: {
        lat: () => number;
        lng: () => number;
      };
    };
  }
}

export interface PlacesAutocompleteProps extends Omit<InputProps, 'onChange'> {
  onChange: (value: string, placeId?: string) => void;
  apiKey: string;
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
}

export const PlacesAutocomplete = React.forwardRef<HTMLInputElement, PlacesAutocompleteProps>(
  ({ className, apiKey, onChange, onPlaceSelect, ...props }, ref) => {
    const [isLoading, setIsLoading] = useState(false);
    const [scriptLoaded, setScriptLoaded] = useState(false);
    const [selectedPlace, setSelectedPlace] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
    
    // Set up the Google Maps Places API script
    useEffect(() => {
      if (!apiKey) return;
      
      if (!document.getElementById('google-maps-script')) {
        setIsLoading(true);
        const script = document.createElement('script');
        script.id = 'google-maps-script';
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGoogleMapsPlaces`;
        script.async = true;
        script.defer = true;
        
        // Define the callback function
        window.initGoogleMapsPlaces = () => {
          setScriptLoaded(true);
          setIsLoading(false);
        };
        
        document.head.appendChild(script);
        
        return () => {
          // Clean up
          window.initGoogleMapsPlaces = () => {};
          if (document.getElementById('google-maps-script')) {
            document.getElementById('google-maps-script')?.remove();
          }
        };
      }
    }, [apiKey]);
    
    // Initialize Autocomplete when script is loaded
    useEffect(() => {
      if (!scriptLoaded || !inputRef.current) return;
      
      const options = {
        types: ['(cities)'], // Restrict to cities only
        fields: ['place_id', 'name', 'formatted_address', 'geometry'],
      };
      
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        inputRef.current,
        options
      );
      
      // Add listener for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current?.getPlace();
        if (place && place.formatted_address) {
          setSelectedPlace(place.formatted_address);
          onChange(place.formatted_address, place.place_id);
          if (onPlaceSelect) {
            onPlaceSelect(place);
          }
        }
      });
      
      return () => {
        if (autocompleteRef.current) {
          window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
        }
      };
    }, [scriptLoaded, onChange, onPlaceSelect]);
    
    // Handle manual input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      onChange(value);
      if (selectedPlace && value !== selectedPlace) {
        setSelectedPlace(null);
      }
    };
    
    return (
      <div className="relative">
        <Input
          {...props}
          ref={(node) => {
            // Handle both the forwarded ref and our local ref
            if (typeof ref === 'function') {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
            inputRef.current = node;
          }}
          onChange={handleInputChange}
          className={cn(isLoading && "pr-10", className)}
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          </div>
        )}
      </div>
    );
  }
);

PlacesAutocomplete.displayName = "PlacesAutocomplete"; 