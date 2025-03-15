'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Plane, Map, Info, User, Menu, X } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-gray-100 text-black sticky top-0 z-50">
      <div className="container h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 z-10">
          <span className="text-2xl font-display font-bold">
            FlightFinder
          </span>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden z-20" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-4">
            <li>
              <Button variant="ghost" size="sm" className="text-black hover:bg-gray-200" asChild>
                <Link href="/search" className="flex items-center gap-1">
                  <Search size={16} />
                  <span>Search</span>
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="sm" className="text-black hover:bg-gray-200" asChild>
                <Link href="/deals" className="flex items-center gap-1">
                  <Plane size={16} />
                  <span>Deals</span>
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="sm" className="text-black hover:bg-gray-200" asChild>
                <Link href="/destinations" className="flex items-center gap-1">
                  <Map size={16} />
                  <span>Destinations</span>
                </Link>
              </Button>
            </li>
            <li>
              <Button variant="ghost" size="sm" className="text-black hover:bg-gray-200" asChild>
                <Link href="/about" className="flex items-center gap-1">
                  <Info size={16} />
                  <span>About</span>
                </Link>
              </Button>
            </li>
            <li>
              <Button className="bg-gray-300 text-black hover:bg-gray-400" size="sm" asChild>
                <Link href="/account" className="flex items-center gap-1">
                  <User size={16} />
                  <span>My Account</span>
                </Link>
              </Button>
            </li>
          </ul>
        </nav>
        
        {/* Mobile navigation overlay */}
        <div className={`fixed inset-0 bg-white z-10 md:hidden transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="container pt-20 px-6">
            <nav>
              <ul className="flex flex-col space-y-6">
                <li>
                  <Link 
                    href="/search" 
                    className="flex items-center gap-3 text-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Search size={20} />
                    <span>Search</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/deals" 
                    className="flex items-center gap-3 text-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Plane size={20} />
                    <span>Deals</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/destinations" 
                    className="flex items-center gap-3 text-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Map size={20} />
                    <span>Destinations</span>
                  </Link>
                </li>
                <li>
                  <Link 
                    href="/about" 
                    className="flex items-center gap-3 text-xl font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Info size={20} />
                    <span>About</span>
                  </Link>
                </li>
                <li className="pt-6">
                  <Button 
                    className="w-full bg-gray-300 text-black hover:bg-gray-400 py-3" 
                    size="lg"
                    onClick={() => setIsMenuOpen(false)}
                    asChild
                  >
                    <Link href="/account" className="flex items-center justify-center gap-2">
                      <User size={20} />
                      <span>My Account</span>
                    </Link>
                  </Button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
} 