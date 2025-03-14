import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { CustomDatePicker } from '../ui/date-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FlightSearchFormProps {
  onSearch: (searchParams: FlightSearchParams) => void;
}

export interface FlightSearchParams {
  origin: string;
  destination: string;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: number;
}

export const FlightSearchForm: React.FC<FlightSearchFormProps> = ({ onSearch }) => {
  const [searchParams, setSearchParams] = useState<FlightSearchParams>({
    origin: '',
    destination: '',
    departureDate: null,
    returnDate: null,
    passengers: 1,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FlightSearchParams, string>>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FlightSearchParams, string>> = {};

    if (!searchParams.origin) {
      newErrors.origin = 'Origin is required';
    }
    if (!searchParams.destination) {
      newErrors.destination = 'Destination is required';
    }
    if (!searchParams.departureDate) {
      newErrors.departureDate = 'Departure date is required';
    }
    if (searchParams.passengers < 1) {
      newErrors.passengers = 'At least 1 passenger is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSearch(searchParams);
    }
  };

  const passengerOptions = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="From"
          placeholder="Enter origin city"
          value={searchParams.origin}
          onChange={(e) => setSearchParams({ ...searchParams, origin: e.target.value })}
          error={errors.origin}
        />
        <Input
          label="To"
          placeholder="Enter destination city"
          value={searchParams.destination}
          onChange={(e) => setSearchParams({ ...searchParams, destination: e.target.value })}
          error={errors.destination}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <CustomDatePicker
          label="Departure Date"
          selected={searchParams.departureDate}
          onChange={(date) => setSearchParams({ ...searchParams, departureDate: date })}
          minDate={new Date()}
          error={errors.departureDate}
        />
        <CustomDatePicker
          label="Return Date (Optional)"
          selected={searchParams.returnDate}
          onChange={(date) => setSearchParams({ ...searchParams, returnDate: date })}
          minDate={searchParams.departureDate || new Date()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="w-full">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Passengers
          </label>
          <Select
            value={searchParams.passengers.toString()}
            onValueChange={(value) =>
              setSearchParams({ ...searchParams, passengers: parseInt(value) })
            }
          >
            <SelectTrigger className={errors.passengers ? 'border-red-500' : ''}>
              <SelectValue placeholder="Select number of passengers" />
            </SelectTrigger>
            <SelectContent>
              {passengerOptions.map((num) => (
                <SelectItem key={num} value={num.toString()}>
                  {num} {num === 1 ? 'passenger' : 'passengers'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.passengers && (
            <p className="mt-1 text-sm text-red-500">{errors.passengers}</p>
          )}
        </div>
      </div>

      <Button type="submit" className="w-full">
        Search Flights
      </Button>
    </form>
  );
}; 