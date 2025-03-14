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

   # Run tests
   npm test

   # Build for production
   npm run build
   ```

2. **Code Quality**
   - ESLint for code linting
   - Prettier for code formatting
   - Husky for pre-commit hooks
   - Jest for unit testing
   - Cypress for E2E testing

3. **Deployment**
   - CI/CD pipeline with GitHub Actions
   - Automated testing before deployment
   - Vercel for frontend deployment
   - PostgreSQL database

### Monitoring & Logging

- Not added yet.

