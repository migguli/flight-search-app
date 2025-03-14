import FlightSearchForm from '@/components/features/search/FlightSearchForm'

export default function Home() {
  return (
    <div className="container py-12">
      <div className="max-w-3xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Find Your Perfect Flight</h1>
        <p className="text-neutral-600 text-lg">
          Search through thousands of flights to find the best deals for your next journey.
        </p>
      </div>
      <div className="max-w-4xl mx-auto">
        <FlightSearchForm />
      </div>
    </div>
  )
}
