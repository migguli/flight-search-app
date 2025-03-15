"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Check, ChevronsUpDown, MapPin, Plane } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { SkyscannerPlace } from "@/lib/types/skyscanner"

export type LocationOption = {
  value: string
  label: string
  type: string
  code?: string
}

interface SkyscannerLocationAutocompleteProps {
  placeholder?: string
  onSearch: (query: string) => Promise<SkyscannerPlace[]>
  onSelect: (location: LocationOption) => void
  className?: string
  value?: string
  disabled?: boolean
}

export function SkyscannerLocationAutocomplete({
  placeholder = "Search locations...",
  onSearch,
  onSelect,
  className,
  value,
  disabled = false,
}: SkyscannerLocationAutocompleteProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [options, setOptions] = useState<LocationOption[]>([])
  const [selectedValue, setSelectedValue] = useState(value || "")
  const [loading, setLoading] = useState(false)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const [displayValue, setDisplayValue] = useState("")

  // Update internal state when external value prop changes
  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value)
    }
  }, [value])

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setOptions([])
      return
    }

    setLoading(true)
    try {
      const results = await onSearch(searchQuery)
      
      const mappedOptions: LocationOption[] = results.map(place => ({
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

  const handleInputChange = (value: string) => {
    setQuery(value)
    setDisplayValue(value)
    
    // Debounce the search to avoid excessive API calls
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    
    debounceTimerRef.current = setTimeout(() => {
      searchLocations(value)
    }, 300)
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
  const handleSelect = (currentValue: string) => {
    const selectedOption = options.find(option => option.value === currentValue)
    
    if (selectedOption) {
      setSelectedValue(currentValue)
      // Set display value to show both name and code if available
      const displayName = selectedOption.code 
        ? `${selectedOption.label} (${selectedOption.code})` 
        : selectedOption.label
      setDisplayValue(displayName)
      onSelect(selectedOption)
      setOpen(false)
    }
  }

  // Format display text for selected item
  const getFormattedDisplayText = () => {
    if (selectedValue) {
      const selected = options.find((option) => option.value === selectedValue)
      if (selected) {
        return selected.code 
          ? `${selected.label} (${selected.code})` 
          : selected.label
      }
    }
    return displayValue || placeholder
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("w-full justify-between", className)}
          disabled={disabled}
        >
          {getFormattedDisplayText()}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search by city name or airport code..."
            value={query}
            onValueChange={handleInputChange}
            className="h-9"
            autoFocus
          />
          {loading && (
            <div className="py-6 text-center text-sm">
              Searching locations...
            </div>
          )}
          <CommandEmpty>
            {query.length > 0 && query.length < 2
              ? "Type at least 2 characters to search"
              : "No locations found."}
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                value={option.value}
                onSelect={() => handleSelect(option.value)}
                className="flex items-center cursor-pointer hover:bg-accent"
              >
                {option.type === 'AIRPORT' ? (
                  <Plane className="mr-2 h-4 w-4" />
                ) : (
                  <MapPin className="mr-2 h-4 w-4" />
                )}
                <div className="flex flex-col">
                  <span className="font-medium">{option.label}</span>
                  {option.type === 'AIRPORT' && (
                    <span className="text-xs text-muted-foreground">
                      Airport
                    </span>
                  )}
                </div>
                {option.code && (
                  <span className="ml-auto text-sm font-bold">
                    {option.code}
                  </span>
                )}
                <Check
                  className={cn(
                    "ml-2 h-4 w-4",
                    selectedValue === option.value ? "opacity-100" : "opacity-0"
                  )}
                />
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 