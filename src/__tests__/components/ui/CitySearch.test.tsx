import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CitySearch } from '@/components/ui/city-search';
import { SkyscannerPlace } from '@/lib/types/skyscanner';

// Mock data for test
const mockPlaces: SkyscannerPlace[] = [
  { entityId: 'LON_SKY', name: 'London', iata: 'LON', type: 'CITY' },
  { entityId: 'LHR_SKY', name: 'London Heathrow Airport', iata: 'LHR', type: 'AIRPORT' },
  { entityId: 'LAX_SKY', name: 'Los Angeles', iata: 'LAX', type: 'CITY' },
];

// Mock the search function
const mockSearch = jest.fn().mockImplementation(async (query: string) => {
  // Simulate API behavior by filtering mock data based on query
  const lowercaseQuery = query.toLowerCase();
  return mockPlaces.filter(place => 
    place.name.toLowerCase().includes(lowercaseQuery) || 
    (place.iata?.toLowerCase() || '').includes(lowercaseQuery)
  );
});

const mockOnSelect = jest.fn();

describe('CitySearch', () => {
  beforeEach(() => {
    // Clear mocks before each test
    jest.clearAllMocks();
  });

  test('renders with placeholder text', () => {
    render(
      <CitySearch 
        placeholder="Test placeholder" 
        onSearch={mockSearch} 
        onSelect={mockOnSelect} 
      />
    );
    
    expect(screen.getByPlaceholderText('Test placeholder')).toBeInTheDocument();
  });

  test('displays "No locations found" when search returns no results', async () => {
    // Mock search function to return empty array
    const emptySearch = jest.fn().mockResolvedValue([]);
    
    render(
      <CitySearch 
        placeholder="Search locations..." 
        onSearch={emptySearch} 
        onSelect={mockOnSelect} 
      />
    );
    
    // Type a search term
    const input = screen.getByPlaceholderText('Search locations...');
    await userEvent.type(input, 'Nonexistent');
    
    // Wait for the "No locations found" message
    await waitFor(() => {
      expect(screen.getByText('No locations found')).toBeInTheDocument();
    });
  });

  test('requires at least 2 characters to start searching', async () => {
    render(
      <CitySearch 
        placeholder="Search locations..." 
        onSearch={mockSearch} 
        onSelect={mockOnSelect} 
      />
    );
    
    // Type a single character
    const input = screen.getByPlaceholderText('Search locations...');
    await userEvent.type(input, 'L');
    
    // Should see the "Type at least 2 characters" message
    await waitFor(() => {
      expect(screen.getByText('Type at least 2 characters to search')).toBeInTheDocument();
    });
    
    // Search function should not be called
    expect(mockSearch).not.toHaveBeenCalled();
  });

  test('calls search function when typing at least 2 characters', async () => {
    render(
      <CitySearch 
        placeholder="Search locations..." 
        onSearch={mockSearch} 
        onSelect={mockOnSelect} 
      />
    );
    
    // Type a search term with at least 2 characters
    const input = screen.getByPlaceholderText('Search locations...');
    await userEvent.type(input, 'Lo');
    
    // Wait for the search function to be called
    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('Lo');
    });
  });

  test('selects an option when clicked', async () => {
    render(
      <CitySearch 
        placeholder="Search locations..." 
        onSearch={mockSearch} 
        onSelect={mockOnSelect} 
      />
    );
    
    // Type a search term
    const input = screen.getByPlaceholderText('Search locations...');
    await userEvent.type(input, 'London');
    
    // Wait for results to appear
    await waitFor(() => {
      expect(mockSearch).toHaveBeenCalledWith('London');
    });
    
    // Click on the first result
    const firstResult = await screen.findByText('London');
    fireEvent.click(firstResult);
    
    // Check that onSelect was called with the correct option
    expect(mockOnSelect).toHaveBeenCalledWith(expect.objectContaining({
      value: 'LON_SKY',
      label: 'London',
      type: 'CITY',
      code: 'LON'
    }));
    
    // Input should be updated with the selected value
    expect(input).toHaveValue('London (LON)');
  });
}); 