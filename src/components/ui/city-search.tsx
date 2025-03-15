"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Check, MapPin, Plane } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { SkyscannerPlace } from "@/lib/types/skyscanner"
import { AccommodationService } from "@/lib/api/accommodationService"
import { getAirportCity } from "@/lib/utils/airportUtils"

export type CitySearchOption = {
  value: string
  label: string
  type: string
  code?: string
}

interface CitySearchProps {
  placeholder?: string
  onSearch: (query: string) => Promise<SkyscannerPlace[]>
  onSelect?: (location: CitySearchOption) => void
  className?: string
  value?: string
  disabled?: boolean
  showListingCounts?: boolean
}

export function CitySearch({
  placeholder = "Search for a city or airport...",
  onSearch,
  onSelect,
  className,
  value = "",
  disabled = false,
  showListingCounts = false,
}: CitySearchProps) {
  const [query, setQuery] = useState(value)
  const [options, setOptions] = useState<CitySearchOption[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [cityListingCounts, setCityListingCounts] = useState<Record<string, number>>({})
  const [isLoadingCounts, setIsLoadingCounts] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Only fetch listing counts if showListingCounts is true
  useEffect(() => {
    if (showListingCounts) {
      const fetchCityListingCounts = async () => {
        setIsLoadingCounts(true)
        try {
          const counts = await AccommodationService.getCityListingCounts()
          setCityListingCounts(counts)
        } catch (error) {
          console.error('Error fetching city listing counts:', error)
        } finally {
          setIsLoadingCounts(false)
        }
      }
      
      fetchCityListingCounts()
    }
  }, [showListingCounts])

  // Update internal state when external value prop changes
  useEffect(() => {
    setQuery(value)
  }, [value])

  // Handle clicks outside the component to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setOptions([])
      return
    }

    setLoading(true)
    try {
      const results = await onSearch(searchQuery)
      
      const mappedOptions: CitySearchOption[] = results.map(place => ({
        value: place.entityId,
        label: place.name,
        type: place.type,
        code: place.iata
      }))
      
      setOptions(mappedOptions)
    } catch (error) {
      console.error("Error searching locations:", error)
      setOptions([])
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setQuery(newValue)
    
    // Show dropdown if there's text
    if (newValue.length > 0) {
      setShowDropdown(true)
    } else {
      setShowDropdown(false)
    }
    
    // Debounce the search to avoid excessive API calls
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    debounceTimerRef.current = setTimeout(() => {
      searchLocations(newValue)
    }, 200)
  }

  // Clean up the timeout when the component unmounts
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  // Get the listing count for a city or airport
  const getListingCount = (cityName: string, airportCode?: string): number => {
    // If counts are still loading, return a placeholder value
    if (isLoadingCounts) {
      return -1 // -1 indicates loading
    }
    
    // For airports, try to get the corresponding city
    if (airportCode) {
      const cityForAirport = getAirportCity(airportCode);
      if (cityForAirport && cityListingCounts[cityForAirport]) {
        return cityListingCounts[cityForAirport];
      }
    }
    
    // Try to find the city in our counts
    return cityListingCounts[cityName] || 0
  }

  // Get a display message for the listing count
  const getListingCountDisplay = (cityName: string, airportCode?: string): string => {
    const count = getListingCount(cityName, airportCode);
    
    if (count === -1) {
      return "Loading...";
    }
    
    if (airportCode) {
      const cityForAirport = getAirportCity(airportCode);
      if (cityForAirport) {
        return `${count} ${count === 1 ? 'listing' : 'listings'} in ${cityForAirport}`;
      }
    }
    
    return `${count} ${count === 1 ? 'listing' : 'listings'}`;
  };

  // Handle selection of an item from the dropdown
  const handleSelect = (option: CitySearchOption) => {
    // Only check for zero listings if showListingCounts is true
    if (showListingCounts) {
      const listingCount = getListingCount(option.label, option.code);
      if (listingCount === 0) {
        return;
      }
    }
    
    // Set the input value to the selected option's label
    const displayText = option.code 
      ? `${option.label} (${option.code})` 
      : option.label
    
    setQuery(displayText)
    setShowDropdown(false)
    
    // Call the onSelect callback if provided
    if (onSelect) {
      onSelect(option)
    }
  }

  return (
    <div className="relative w-full">
      <Input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        onFocus={() => query.length >= 2 && setShowDropdown(true)}
        className={cn("w-full", className)}
        disabled={disabled}
      />
      
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-md max-h-60 overflow-auto"
        >
          {loading ? (
            <div className="py-2 px-3 text-sm text-center">
              Searching...
            </div>
          ) : options.length === 0 ? (
            <div className="py-2 px-3 text-sm text-center">
              {query.length < 2 
                ? "Type at least 2 characters to search" 
                : "No locations found"}
            </div>
          ) : (
            <ul className="py-1">
              {options.map((option) => {
                // Only check for zero listings if showListingCounts is true
                const listingCount = showListingCounts ? getListingCount(option.label, option.code) : 1;
                const isDisabled = showListingCounts && listingCount === 0;
                
                return (
                  <li
                    key={option.value}
                    className={cn(
                      "px-3 py-2 hover:bg-accent flex items-center",
                      isDisabled ? "opacity-50 pointer-events-none" : "cursor-pointer"
                    )}
                    onClick={() => !isDisabled && handleSelect(option)}
                  >
                    {option.type === 'AIRPORT' ? (
                      <Plane className="mr-2 h-4 w-4 text-muted-foreground" />
                    ) : (
                      <MapPin className="mr-2 h-4 w-4 text-muted-foreground" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-medium">{option.label}</span>
                    </div>
                    {option.code && (
                      <span className="ml-auto text-sm font-bold">
                        {option.code}
                      </span>
                    )}
                    {showListingCounts && (
                      <span className="ml-2 text-sm font-medium">
                        {getListingCountDisplay(option.label, option.code)}
                      </span>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  )
} 