import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface FilterState {
  priceRange: [number, number];
  stops: string;
  airlines: string[];
  departureTime: string;
}

interface FlightFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  minPrice: number;
  maxPrice: number;
  airlines: string[];
}

export const FlightFilters: React.FC<FlightFiltersProps> = ({
  onFilterChange,
  minPrice,
  maxPrice,
  airlines,
}) => {
  const [filters, setFilters] = React.useState<FilterState>({
    priceRange: [minPrice, maxPrice],
    stops: 'all',
    airlines: [],
    departureTime: 'all',
  });

  const handleFilterChange = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>Filters</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Price Range Filter */}
        <div>
          <Label>Price Range</Label>
          <div className="mt-2">
            <Slider
              defaultValue={[minPrice, maxPrice]}
              min={minPrice}
              max={maxPrice}
              step={10}
              onValueChange={(value: number[]) => handleFilterChange('priceRange', value as [number, number])}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>${filters.priceRange[0]}</span>
              <span>${filters.priceRange[1]}</span>
            </div>
          </div>
        </div>

        {/* Stops Filter */}
        <div>
          <Label>Stops</Label>
          <Select
            value={filters.stops}
            onValueChange={(value: string) => handleFilterChange('stops', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select stops" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="0">Direct</SelectItem>
              <SelectItem value="1">1 Stop</SelectItem>
              <SelectItem value="2+">2+ Stops</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Airlines Filter */}
        <div>
          <Label>Airlines</Label>
          <Select
            value={filters.airlines[0] || ''}
            onValueChange={(value: string) => handleFilterChange('airlines', [value])}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select airline" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Airlines</SelectItem>
              {airlines.map((airline) => (
                <SelectItem key={airline} value={airline}>
                  {airline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Departure Time Filter */}
        <div>
          <Label>Departure Time</Label>
          <Select
            value={filters.departureTime}
            onValueChange={(value: string) => handleFilterChange('departureTime', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Times</SelectItem>
              <SelectItem value="morning">Morning (6AM - 12PM)</SelectItem>
              <SelectItem value="afternoon">Afternoon (12PM - 6PM)</SelectItem>
              <SelectItem value="evening">Evening (6PM - 12AM)</SelectItem>
              <SelectItem value="night">Night (12AM - 6AM)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}; 