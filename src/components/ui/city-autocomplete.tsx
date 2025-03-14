"use client"

import React, { useEffect, useState } from 'react'
import { Input, InputProps } from './input'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from './button'

// Import the city data
import citiesData from '@/lib/mockData/cities.json'

export interface CityAutocompleteProps extends Omit<InputProps, 'onChange'> {
  onChange: (value: string) => void;
  onCitySelect?: (city: { country: string; capital: string }) => void;
  value?: string;
}

export const CityAutocomplete = React.forwardRef<HTMLInputElement, CityAutocompleteProps>(
  ({ className, onChange, onCitySelect, value = '', ...props }, ref) => {
    const [open, setOpen] = useState(false)
    const [searchTerm, setSearchTerm] = useState(value)
    const [filteredCities, setFilteredCities] = useState<{ country: string; capital: string }[]>([])
    
    // Synchronize internal state with external value
    useEffect(() => {
      if (value !== searchTerm) {
        setSearchTerm(value)
      }
    }, [value, searchTerm])

    // Update filtered cities when search term changes
    useEffect(() => {
      if (!searchTerm) {
        setFilteredCities([])
        return
      }

      const lowercaseTerm = searchTerm.toLowerCase()
      const cities = citiesData.capitals.filter(city => 
        city.capital.toLowerCase().includes(lowercaseTerm) || 
        city.country.toLowerCase().includes(lowercaseTerm)
      )
      
      // Limit to first 10 results for performance
      setFilteredCities(cities.slice(0, 10))
    }, [searchTerm])

    // Handle explicit city selection from dropdown
    const handleSelect = (city: { country: string; capital: string }) => {
      setSearchTerm(city.capital)
      onChange(city.capital)
      if (onCitySelect) {
        onCitySelect(city)
      }
      setOpen(false)
    }

    // Handle input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setSearchTerm(newValue)
      onChange(newValue)
      
      // Open dropdown when typing if there's content to show
      if (newValue && !open) {
        setOpen(true)
      }
    }

    // Detect clicks outside to close dropdown but keep focus
    useEffect(() => {
      if (!open) return;
      
      const handleClickOutside = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        
        // Don't close if clicking on dropdown elements
        if (target.closest('[data-city-dropdown]')) {
          return;
        }
        
        // Don't close if clicking on the input field
        if (target.tagName.toLowerCase() === 'input') {
          return;
        }
        
        setOpen(false);
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [open]);

    return (
      <div className="relative w-full">
        <div className="flex relative">
          <Input
            {...props}
            ref={ref}
            value={searchTerm}
            onChange={handleInputChange}
            className={cn("pr-10", className)}
            onClick={() => {
              if (!open && searchTerm && filteredCities.length > 0) {
                setOpen(true);
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setOpen(false);
                // This helps keep focus
                e.preventDefault();
                e.stopPropagation();
              }
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="absolute right-0 top-0 h-full px-2"
            tabIndex={-1}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setOpen(!open);
            }}
          >
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </Button>
        </div>
          
        {open && filteredCities.length > 0 && (
          <div 
            data-city-dropdown
            className="absolute z-50 w-full bg-popover shadow-md rounded-md mt-1 overflow-hidden" 
          >
            <div className="p-1 max-h-60 overflow-auto">
              {filteredCities.length === 0 ? (
                <div className="py-6 text-center text-sm">No cities found.</div>
              ) : (
                <div>
                  {filteredCities.map((city) => (
                    <div
                      key={`${city.country}-${city.capital}`}
                      className="relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                      onClick={() => handleSelect(city)}
                      onMouseDown={(e) => {
                        // This is critical - it prevents the input from losing focus
                        e.preventDefault();
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          searchTerm === city.capital ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span>{city.capital}</span>
                      <span className="ml-2 text-sm text-muted-foreground">({city.country})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    )
  }
)

CityAutocomplete.displayName = "CityAutocomplete" 