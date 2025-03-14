export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.flightsearch.example';

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
};

export class ApiError extends Error {
  constructor(
    public status: number,
    public message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      response.status,
      error.message || 'An error occurred while fetching data',
      error
    );
  }
  return response.json();
}; 