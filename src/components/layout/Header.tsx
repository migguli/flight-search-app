import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Search, Plane, Map, Info, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-700 text-white sticky top-0 z-50 shadow-md">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-2xl font-display font-bold relative">
            <span className="absolute -left-1 -top-1 opacity-0 group-hover:opacity-100 transition-all duration-500">
              ✈️
            </span>
            <span className="animated-gradient-text">FlightFinder</span>
          </span>
        </Link>
        
        <nav>
          <ul className="flex items-center gap-4">
            <li>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
                <Link href="/search" className="flex items-center gap-1">
                  <Search size={16} />
                  <span>Search</span>
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
                <Link href="/deals" className="flex items-center gap-1">
                  <Plane size={16} />
                  <span>Deals</span>
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
                <Link href="/destinations" className="flex items-center gap-1">
                  <Map size={16} />
                  <span>Destinations</span>
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10" asChild>
                <Link href="/about" className="flex items-center gap-1">
                  <Info size={16} />
                  <span>About</span>
                </Link>
              </Button>
            </li>
            <li>
              <Button className="bg-white text-primary-600 hover:bg-white/90" size="sm" asChild>
                <Link href="/account" className="flex items-center gap-1">
                  <User size={16} />
                  <span>My Account</span>
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
} 