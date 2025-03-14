"use client"

import * as React from "react"
import { useState, useEffect, useRef } from "react"
import { Check, ChevronsUpDown, MapPin } from "lucide-react"

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
      
      // Automatically open the dropdown when we have results
      if (mappedOptions.length > 0 && !open) {
        setOpen(true)
      }
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

  const handleSelect = (currentValue: string) => {
    const selectedOption = options.find(option => option.value === currentValue)
    
    if (selectedOption) {
      setSelectedValue(currentValue)
      setDisplayValue(selectedOption.label)
      onSelect(selectedOption)
      setOpen(false)
    }
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
          onClick={() => setOpen(true)}
        >
          {selectedValue && options.find((option) => option.value === selectedValue)
            ? options.find((option) => option.value === selectedValue)?.label
            : displayValue || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder={placeholder}
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
            {query.length > 0 
              ? "No locations found." 
              : "Type at least 2 characters to search"
            }
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option.value}
                onSelect={() => handleSelect(option.value)}
                className="flex items-center"
              >
                <MapPin className="mr-2 h-4 w-4" />
                <span>{option.label}</span>
                {option.code && (
                  <span className="ml-auto text-xs text-muted-foreground">
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