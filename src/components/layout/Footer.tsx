import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, CreditCard, Shield, Clock } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background text-foreground">
      {/* Footer Top - Contact & Benefits */}
      <div className="bg-secondary">
        <div className="container mx-auto py-6 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <CreditCard size={24} className="text-primary" />
              <div>
                <h3 className="font-bold">Secure Payments</h3>
                <p className="text-sm text-muted-foreground">All transactions are encrypted</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Clock size={24} className="text-primary" />
              <div>
                <h3 className="font-bold">24/7 Support</h3>
                <p className="text-sm text-muted-foreground">Contact us anytime</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Shield size={24} className="text-primary" />
              <div>
                <h3 className="font-bold">Best Price Guarantee</h3>
                <p className="text-sm text-muted-foreground">Find it cheaper, we refund</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">
              <span className="text-primary">Flight</span>
              <span className="text-accent">Finder</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Find the best flights and accommodations for your next adventure. Compare prices and book with confidence.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://facebook.com" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn" className="text-muted-foreground hover:text-primary transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-primary transition-colors">Search Flights</Link>
              </li>
              <li>
                <Link href="/destinations" className="text-muted-foreground hover:text-primary transition-colors">Popular Destinations</Link>
              </li>
              <li>
                <Link href="/deals" className="text-muted-foreground hover:text-primary transition-colors">Flight Deals</Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/refunds" className="text-muted-foreground hover:text-primary transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary transition-colors">Help Center</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-accent mt-0.5" />
                <span className="text-muted-foreground">1234 Aviation Way, Flight City, FC 56789</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-accent" />
                <span className="text-muted-foreground">+1 (555) 234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-accent" />
                <span className="text-muted-foreground">support@flightfinder.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom - Copyright */}
      <div className="border-t border-border">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-muted-foreground text-sm mb-4 md:mb-0">
              &copy; {currentYear} FlightFinder. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/privacy" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-muted-foreground hover:text-primary text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 