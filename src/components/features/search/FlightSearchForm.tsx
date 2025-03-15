"use client"

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'
import React from 'react'

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card } from '@/components/ui/card'
import { CitySearch, CitySearchOption } from '@/components/ui/city-search'
import { useSkyscannerSearch } from '@/lib/hooks/useSkyscannerSearch'
import { config } from '@/lib/config'
import { cn } from '@/lib/utils'

// Import the Google Maps types
// This is referencing the types we defined in places-autocomplete.tsx
declare namespace google.maps.places {
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

const formSchema = z.object({
  origin: z.string().min(3, 'Origin is required'),
  destination: z.string().min(3, 'Destination is required'),
  departureDate: z.date({
    required_error: 'Departure date is required',
  }),
  returnDate: z.date().optional(),
})

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: Date;
  returnDate?: Date;
}

interface FlightSearchFormProps {
  onSearch: (searchParams: FlightSearchParams) => void;
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch }) => {
  const [isRoundTrip, setIsRoundTrip] = useState(true)
  const [originLocation, setOriginLocation] = useState<CitySearchOption | null>(null);
  const [destinationLocation, setDestinationLocation] = useState<CitySearchOption | null>(null);
  const { searchPlaces } = useSkyscannerSearch();

  const defaultValues = {
    origin: 'Helsinki',
    destination: 'London',
    departureDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  // Initialize form with default values
  useEffect(() => {
    form.reset(defaultValues)
  }, [])

  // Handle location selection and ensure form values are synchronized
  const handleOriginLocationSelect = (location: CitySearchOption) => {
    setOriginLocation(location);
    form.setValue('origin', location.value);
  }

  const handleDestinationLocationSelect = (location: CitySearchOption) => {
    setDestinationLocation(location);
    form.setValue('destination', location.value);
  }

  // Clear/reset the form
  const handleResetForm = () => {
    form.reset()
    setOriginLocation(null)
    setDestinationLocation(null)
  }

  // Submit the form and call the onSearch callback
  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const searchParams: FlightSearchParams = {
      origin: values.origin,
      destination: values.destination,
      departureDate: values.departureDate,
      returnDate: isRoundTrip ? values.returnDate : undefined
    }
    onSearch(searchParams)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card className="p-6">
          <div className="mb-6">
            <div className="flex rounded-md overflow-hidden border border-border">
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-center transition-colors ${
                  isRoundTrip 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'bg-background hover:bg-muted'
                }`}
                onClick={() => setIsRoundTrip(true)}
              >
                Round Trip
              </button>
              <button
                type="button"
                className={`flex-1 py-2 px-4 text-center transition-colors ${
                  !isRoundTrip 
                    ? 'bg-primary text-primary-foreground font-medium' 
                    : 'bg-background hover:bg-muted'
                }`}
                onClick={() => setIsRoundTrip(false)}
              >
                One Way
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Origin</FormLabel>
                  <FormControl>
                    <CitySearch
                      placeholder="Search for airports or cities..."
                      onSearch={searchPlaces}
                      onSelect={handleOriginLocationSelect}
                      value={originLocation ? originLocation.label + (originLocation.code ? ` (${originLocation.code})` : '') : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="destination"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <CitySearch
                      placeholder="Search for airports or cities..."
                      onSearch={searchPlaces}
                      onSelect={handleDestinationLocationSelect}
                      value={destinationLocation ? destinationLocation.label + (destinationLocation.code ? ` (${destinationLocation.code})` : '') : ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <FormField
              control={form.control}
              name="departureDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Departure Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date < new Date(new Date().setHours(0, 0, 0, 0))
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {isRoundTrip && (
              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Return Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value || undefined}
                          onSelect={field.onChange}
                          disabled={(date) => {
                            const departureDate = form.getValues("departureDate")
                            return date < departureDate
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
          </div>

          <div className="flex justify-center mt-8">
            <Button type="submit" className="w-full md:w-1/2 py-6 text-lg font-medium">
              Search Flights
            </Button>
          </div>
        </Card>
      </form>
    </Form>
  )
} 