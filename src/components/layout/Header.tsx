import Link from 'next/link'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Plane, Map, Info, User, Menu, X, Sparkles } from 'lucide-react'
import { Motion } from '@/components/ui/motion'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [animateIcons, setAnimateIcons] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Animate icons after component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimateIcons(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <header className={`bg-gradient-to-r from-primary-600 to-primary-700 text-white sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-md'}`}>
      <div className={`container h-16 flex items-center justify-between transition-all duration-300 ${isScrolled ? 'h-14' : 'h-16'}`}>
        <Link href="/" className="flex items-center gap-2 group z-10">
          <Motion animationType="slide-right" duration={700}>
            <span className="text-2xl font-display font-bold relative overflow-hidden">
              <span className="absolute -left-1 -top-1 opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:rotate-12">
                ✈️
              </span>
              <span className="sexy-gradient-text">FlightFinder</span>
              <span className="absolute top-0 right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-300">
                <Sparkles size={16} className="text-accent-200 animate-pulse-fast" />
              </span>
            </span>
          </Motion>
        </Link>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden z-20 transition-transform duration-300 hover:scale-110 active:scale-95" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? <X size={24} className="animate-jello" /> : <Menu size={24} />}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:block">
          <ul className="flex items-center gap-4">
            {[
              { href: '/search', icon: <Search size={16} />, label: 'Search', delay: 100 },
              { href: '/deals', icon: <Plane size={16} className={animateIcons ? 'animate-float' : ''} />, label: 'Deals', delay: 200 },
              { href: '/destinations', icon: <Map size={16} className={animateIcons ? 'animate-pulse-fast' : ''} />, label: 'Destinations', delay: 300 },
              { href: '/about', icon: <Info size={16} />, label: 'About', delay: 400 }
            ].map((item, index) => (
              <Motion key={item.href} animationType="fade" delay={item.delay} duration={500}>
                <li>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-white hover:bg-white/10 transition-all duration-300 hover:scale-105" 
                    asChild
                  >
                    <Link href={item.href} className="flex items-center gap-1 group">
                      <span className="transition-transform duration-300 group-hover:scale-110">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </Button>
                </li>
              </Motion>
            ))}
            <Motion animationType="slide-left" delay={500} duration={700}>
              <li>
                <Button 
                  className="bg-white text-primary-600 hover:bg-white/90 shadow-lg hover:shadow-glow transition-all duration-300 hover:scale-105" 
                  size="sm" 
                  asChild
                >
                  <Link href="/account" className="flex items-center gap-1">
                    <User size={16} />
                    <span>My Account</span>
                  </Link>
                </Button>
              </li>
            </Motion>
          </ul>
        </nav>
        
        {/* Mobile navigation overlay */}
        <div className={`fixed inset-0 bg-gradient-cosmic z-10 md:hidden transition-all duration-500 ease-in-out backdrop-blur-lg ${isMenuOpen ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
          <div className="container pt-20 px-6">
            <nav>
              <ul className="flex flex-col space-y-6">
                {[
                  { href: '/search', icon: <Search size={24} />, label: 'Search', delay: 100 },
                  { href: '/deals', icon: <Plane size={24} className="animate-float" />, label: 'Deals', delay: 200 },
                  { href: '/destinations', icon: <Map size={24} className="animate-pulse-fast" />, label: 'Destinations', delay: 300 },
                  { href: '/about', icon: <Info size={24} />, label: 'About', delay: 400 }
                ].map((item) => (
                  <Motion key={item.href} animationType="slide-up" delay={isMenuOpen ? item.delay : 0} duration={500}>
                    <li>
                      <Link 
                        href={item.href} 
                        className="flex items-center gap-3 text-xl font-medium transition-all duration-300 hover:translate-x-2"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <span className="text-white/80">{item.icon}</span>
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  </Motion>
                ))}
                <Motion animationType="slide-up" delay={isMenuOpen ? 500 : 0} duration={500}>
                  <li className="pt-6">
                    <Button 
                      className="w-full bg-white text-primary-600 hover:bg-white/90 py-3 shadow-xl hover:shadow-glow transition-all duration-300 hover:scale-105" 
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
                </Motion>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </header>
  )
} 