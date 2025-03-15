"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Check, MapPin, Plane } from "lucide-react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { SkyscannerPlace } from "@/lib/types/skyscanner"

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
}

export function CitySearch({
  placeholder = "Search for a city or airport...",
  onSearch,
  onSelect,
  className,
  value = "",
  disabled = false,
}: CitySearchProps) {
  const [query, setQuery] = useState(value)
  const [options, setOptions] = useState<CitySearchOption[]>([])
  const [loading, setLoading] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

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

  // Handle selection of an item from the dropdown
  const handleSelect = (option: CitySearchOption) => {
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
              {options.map((option) => (
                <li
                  key={option.value}
                  className="px-3 py-2 cursor-pointer hover:bg-accent flex items-center"
                  onClick={() => handleSelect(option)}
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
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
} 