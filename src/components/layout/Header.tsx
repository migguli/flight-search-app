import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Header() {
  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="text-2xl font-display font-semibold">
          FlightFinder
        </Link>
        
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Button variant="ghost" asChild>
                <Link href="/search">Search</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link href="/deals">Deals</Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" asChild>
                <Link href="/about">About</Link>
              </Button>
            </li>
            <li>
              <Button asChild>
                <Link href="/search">Book Now</Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
} 