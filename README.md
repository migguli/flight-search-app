# Flight Search Tool

A modern web application that helps Airbnb users find the cheapest flights to destinations with Airbnb host availability.

## Technical Specifications

### Architecture

#### Frontend
- **Framework**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **State Management**: React Query for server state and caching, Zustand for client state
- **Form Handling**: React Hook Form with Zod validation
- **Maps**: Mapbox GL JS for interactive map visualization
- **Date Handling**: date-fns for date manipulation and formatting
- **Database**: Prisma with PostgreSQL
- **Authentication**: NextAuth.js with Supabase Auth
- **API Client**: tRPC for type-safe API calls

### Database Schema

The database schema is defined in `prisma/schema.prisma` using Prisma's schema language. Key models include:

- **User**: Stores user information and preferences
- **FlightSearch**: Records flight search queries and results
- **SavedFlight**: Stores user's saved flights

For detailed schema information, see `prisma/schema.prisma`.

### Row Level Security

Row Level Security is implemented at the application level using tRPC middleware and Prisma queries. Each query is scoped to the authenticated user's data.

### API Integration

#### Skyscanner API
- **Authentication**: API key-based authentication
- **Rate Limiting**: Implemented with tRPC middleware
- **Caching**: React Query with stale-while-revalidate strategy
- **Error Handling**: Retry mechanism for failed requests

#### Browser Location API
- **Fallback**: IP-based geolocation service
- **Caching**: Local storage for user's last known location
- **Error Handling**: Graceful degradation to manual input

### Data Models

#### Flight Search
```typescript
interface FlightSearch {
  origin: {
    city: string;
    code: string;
    coordinates: [number, number];
  };
  destination: {
    city: string;
    code: string;
    coordinates: [number, number];
  };
  dates: {
    departure: Date;
    return?: Date;
  };
  passengers: {
    adults: number;
    children: number;
    infants: number;
  };
  cabinClass: 'economy' | 'premium' | 'business';
}
```

#### Flight Result
```typescript
interface FlightResult {
  id: string;
  airline: {
    name: string;
    code: string;
    logo: string;
  };
  flightNumber: string;
  departure: {
    time: Date;
    terminal?: string;
  };
  arrival: {
    time: Date;
    terminal?: string;
  };
  duration: number;
  stops: number;
  price: {
    amount: number;
    currency: string;
  };
  bookingUrl: string;
  fareType: string;
}
```


### Security Measures

- Type-safe API with tRPC
- NextAuth.js for authentication
- HTTPS enforcement
- CORS configuration
- Rate limiting via tRPC middleware
- Input sanitization
- XSS protection
- CSRF protection
- API key rotation mechanism

### Development Workflow

1. **Local Development**
   ```bash
   # Install dependencies
   npm install

   # Set up environment variables
   cp .env.example .env.local

   # Generate Prisma client
   npx prisma generate

   # Run database migrations
   npx prisma migrate dev

   # Start development server
   npm run dev

   # Build for production
   npm run build
   ```

2. **Code Quality**
   - ESLint for code linting
   - Prettier for code formatting
   - Husky for pre-commit hooks

3. **Deployment**
   - CI/CD pipeline with GitHub Actions
   - Vercel for frontend deployment
   - PostgreSQL database

### Monitoring & Logging

- Not added yet.

# Flight Search App

A web application for searching and booking flights.

## Project Overview

This application is built with Next.js and is deployed to AWS S3 for static hosting, with CloudFront for content delivery.

## Development Setup

1. **Clone the repository**

```bash
git clone <repository-url>
cd flight-search-app
```

2. **Install dependencies**

```bash
npm install
```

3. **Set up environment variables**

Copy `.env.local.example` to `.env.local` and fill in the required values.

```bash
cp .env.local.example .env.local
```

4. **Start the development server**

```bash
npm run dev
```

## Deployment

The application is deployed to AWS S3 buckets with the following environments:

- **Development**: `flight-search-app-dev`
- **Production**: `flight-search-app-prod`

### Deploy using the script

```bash
# Deploy to dev environment (default)
./scripts/deploy.sh

# Deploy to production environment
./scripts/deploy.sh prod
```

## Infrastructure

The infrastructure is managed with OpenTofu (previously Terraform). The configuration files are located in the `/terraform` directory.

Note: Current IAM permissions are limited to uploading files to the S3 buckets. To modify the infrastructure configuration, additional permissions would be required.

## OpenTofu Setup

OpenTofu is installed using ASDF version manager:

```bash
# Check OpenTofu version
asdf exec tofu --version
```

## Additional Notes

- AWS credentials are stored in `.env.local` and should not be committed to version control.
- The Google Maps API key is also stored in `.env.local` for local development.

## Features

- Search for flights between cities
- Google Maps Places API integration for city autocomplete
- View flight search results with prices and details
- Find accommodations at your destination

## Setup

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```

3. Set up your environment variables by creating a `.env.local` file in the root directory with the following:
   ```
   NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
   ```

4. Get a Google Maps API Key:
   - Go to the [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project (or select an existing one)
   - Enable the "Places API" for your project
   - Create an API key and restrict it to the Places API
   - Copy your API key and paste it in the `.env.local` file

5. Run the development server:
   ```
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the app

## API Key Restrictions

For security, restrict your Google Maps API key:
- Set application restrictions to HTTP referrers and add your domains
- Enable only the Places API for this key
- In production, set up billing with proper quotas

## Usage

1. Enter your origin city in the "From" field - the autocomplete will show matching cities
2. Enter your destination city in the "To" field - the autocomplete will show matching cities
3. Select your departure and return dates
4. Click "Search Flights" to see available options

## CI/CD Pipeline

This project uses GitHub Actions for continuous integration and continuous deployment to AWS. The pipeline automatically:

1. Validates Terraform code
2. Plans infrastructure changes
3. Applies infrastructure changes
4. Builds the Next.js application
5. Deploys to S3
6. Invalidates CloudFront cache

### How it works

- **On Pull Requests**: The pipeline runs Terraform validation and planning, posting the results as comments on the PR.
- **On Push to Main**: The pipeline runs the full deployment process, applying Terraform changes and deploying the application.
- **Manual Trigger**: You can also manually trigger the workflow from the GitHub Actions tab.

For detailed setup instructions and configuration details, see [.github/CICD_SETUP.md](.github/CICD_SETUP.md).

