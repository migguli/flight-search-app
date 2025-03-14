'use client';

import { FlightSearchForm, FlightSearchParams } from '@/components/features/FlightSearchForm';

export default function Home() {
  const handleSearch = (searchParams: FlightSearchParams) => {
    // TODO: Implement search functionality
    console.log('Search params:', searchParams);
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">Find Your Perfect Flight</h1>
        <div className="max-w-4xl mx-auto">
          <FlightSearchForm onSearch={handleSearch} />
        </div>
      </div>
    </main>
  );
}
