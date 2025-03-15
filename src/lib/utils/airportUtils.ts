// Airport to city mapping
const airportToCityMapping: Record<string, string> = {
  // Paris airports
  'CDG': 'Paris',
  'ORY': 'Paris',
  'BVA': 'Paris',
  // London airports
  'LHR': 'London',
  'LGW': 'London',
  'STN': 'London',
  'LTN': 'London',
  'LCY': 'London',
  // New York airports
  'JFK': 'New York',
  'LGA': 'New York',
  'EWR': 'New York',
  // Tokyo airports
  'NRT': 'Tokyo',
  'HND': 'Tokyo',
  // Barcelona airports
  'BCN': 'Barcelona',
  // Rome airports
  'FCO': 'Rome',
  'CIA': 'Rome',
  // Amsterdam airports
  'AMS': 'Amsterdam',
  // Berlin airports
  'BER': 'Berlin',
  'TXL': 'Berlin',
  // Madrid airports
  'MAD': 'Madrid',
  // Vienna airports
  'VIE': 'Vienna',
  // Helsinki airports
  'HEL': 'Helsinki',
  // Stockholm airports
  'ARN': 'Stockholm',
  // Oslo airports
  'OSL': 'Oslo',
  // Copenhagen airports
  'CPH': 'Copenhagen',
  // Singapore airports
  'SIN': 'Singapore',
  // Dubai airports
  'DXB': 'Dubai',
  // Sydney airports
  'SYD': 'Sydney',
  // Melbourne airports
  'MEL': 'Melbourne',
  // Los Angeles airports
  'LAX': 'Los Angeles',
  // San Francisco airports
  'SFO': 'San Francisco',
  // Chicago airports
  'ORD': 'Chicago',
  'MDW': 'Chicago',
  // Miami airports
  'MIA': 'Miami',
  // Toronto airports
  'YYZ': 'Toronto',
  // Vancouver airports
  'YVR': 'Vancouver',
};

/**
 * Get the city associated with an airport code
 * @param code Airport code (e.g., 'CDG', 'LHR')
 * @returns The city name or undefined if not found
 */
export function getAirportCity(code: string): string | undefined {
  // Clean up the code - remove any non-alphanumeric characters and convert to uppercase
  const cleanCode = code.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
  
  // Try to match the first 3 characters if the code is longer
  const searchCode = cleanCode.substring(0, 3);
  
  return airportToCityMapping[searchCode];
}

/**
 * Extract airport code from a Skyscanner-style entity ID
 * @param entityId Format like "CDG_SKY" or similar
 * @returns Just the airport code part (e.g., "CDG")
 */
export function extractAirportCode(entityId: string): string | null {
  if (!entityId || !entityId.includes('_')) {
    return null;
  }
  
  return entityId.split('_')[0].toUpperCase();
}

/**
 * Check if an entity ID represents an airport
 * @param entityId The entity ID to check
 * @returns True if it's an airport ID
 */
export function isAirportEntityId(entityId: string): boolean {
  if (!entityId || !entityId.includes('_')) {
    return false;
  }
  
  const code = extractAirportCode(entityId);
  return code !== null && code.length === 3;
}

export { airportToCityMapping }; 