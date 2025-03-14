"use client"

import { useState } from 'react'
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
import { CityAutocomplete } from '@/components/ui/city-autocomplete'
import { config } from '@/lib/config'

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
  const [originCity, setOriginCity] = useState<{ country: string; capital: string } | null>(null);
  const [destinationCity, setDestinationCity] = useState<{ country: string; capital: string } | null>(null);

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
  React.useEffect(() => {
    form.reset(defaultValues)
  }, [])

  // Handle city selection and ensure form values are synchronized
  const handleOriginCitySelect = (city: { country: string; capital: string }) => {
    setOriginCity(city);
    // Ensure form value matches the selected city
    form.setValue('origin', city.capital, { shouldValidate: true });
  };

  const handleDestinationCitySelect = (city: { country: string; capital: string }) => {
    setDestinationCity(city);
    // Ensure form value matches the selected city
    form.setValue('destination', city.capital, { shouldValidate: true });
  };

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Enhance the search data with city details if available
    const searchData = {
      ...values,
      // Add country information if available
      originCountry: originCity?.country,
      destinationCountry: destinationCity?.country,
    };
    
    onSearch(values);
    
    // Log enhanced data for debugging
    console.log('Enhanced search data:', searchData);
  }

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex gap-4 mb-6">
            <Button
              type="button"
              variant={!isRoundTrip ? "default" : "outline"}
              onClick={() => setIsRoundTrip(false)}
            >
              One Way
            </Button>
            <Button
              type="button"
              variant={isRoundTrip ? "default" : "outline"}
              onClick={() => setIsRoundTrip(true)}
            >
              Round Trip
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="origin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Origin</FormLabel>
                  <FormControl>
                    <Controller
                      name="origin"
                      control={form.control}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <CityAutocomplete
                          placeholder="From where?"
                          value={value}
                          onChange={(newValue) => onChange(newValue)}
                          onCitySelect={handleOriginCitySelect}
                          {...rest}
                        />
                      )}
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
                <FormItem>
                  <FormLabel>Destination</FormLabel>
                  <FormControl>
                    <Controller
                      name="destination"
                      control={form.control}
                      render={({ field: { onChange, value, ...rest } }) => (
                        <CityAutocomplete
                          placeholder="Where to?"
                          value={value}
                          onChange={(newValue) => onChange(newValue)}
                          onCitySelect={handleDestinationCitySelect}
                          {...rest}
                        />
                      )}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                          variant="outline"
                          className={`w-full pl-3 text-left font-normal`}
                        >
                          {format(field.value || new Date(), "PPP")}
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
                          date < new Date()
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
                            variant="outline"
                            className={`w-full pl-3 text-left font-normal`}
                          >
                            {format(field.value || new Date(), "PPP")}
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
                            date < (form.getValues("departureDate") || new Date())
                          }
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

          <Button type="submit" size="lg" className="w-full">
            Search Flights
          </Button>
        </form>
      </Form>
    </Card>
  );
}; 