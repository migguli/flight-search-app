import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, CreditCard, Shield, Clock } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-black">
      {/* Footer Top - Contact & Benefits */}
      <div className="bg-gray-200">
        <div className="container mx-auto py-6 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center justify-center md:justify-start gap-3">
              <CreditCard size={24} />
              <div>
                <h3 className="font-bold">Secure Payments</h3>
                <p className="text-sm">All transactions are encrypted</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Clock size={24} />
              <div>
                <h3 className="font-bold">24/7 Support</h3>
                <p className="text-sm">Contact us anytime</p>
              </div>
            </div>
            <div className="flex items-center justify-center md:justify-start gap-3">
              <Shield size={24} />
              <div>
                <h3 className="font-bold">Best Price Guarantee</h3>
                <p className="text-sm">Find it cheaper, we refund</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto py-12 px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h2 className="text-2xl font-display font-bold mb-6">FlightFinder</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Find the best flights and accommodations for your next adventure. Compare prices and book with confidence.
            </p>
            <div className="flex items-center gap-4">
              <Link href="https://facebook.com" aria-label="Facebook" className="text-gray-600 hover:text-gray-800 transition-colors">
                <Facebook size={20} />
              </Link>
              <Link href="https://twitter.com" aria-label="Twitter" className="text-gray-600 hover:text-gray-800 transition-colors">
                <Twitter size={20} />
              </Link>
              <Link href="https://instagram.com" aria-label="Instagram" className="text-gray-600 hover:text-gray-800 transition-colors">
                <Instagram size={20} />
              </Link>
              <Link href="https://linkedin.com" aria-label="LinkedIn" className="text-gray-600 hover:text-gray-800 transition-colors">
                <Linkedin size={20} />
              </Link>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/search" className="text-gray-600 hover:text-gray-800 transition-colors">Search Flights</Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-600 hover:text-gray-800 transition-colors">Popular Destinations</Link>
              </li>
              <li>
                <Link href="/deals" className="text-gray-600 hover:text-gray-800 transition-colors">Flight Deals</Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-600 hover:text-gray-800 transition-colors">About Us</Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-gray-800 transition-colors">Contact</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/faq" className="text-gray-600 hover:text-gray-800 transition-colors">FAQ</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-gray-800 transition-colors">Privacy Policy</Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-gray-800 transition-colors">Terms of Service</Link>
              </li>
              <li>
                <Link href="/refunds" className="text-gray-600 hover:text-gray-800 transition-colors">Refund Policy</Link>
              </li>
              <li>
                <Link href="/help" className="text-gray-600 hover:text-gray-800 transition-colors">Help Center</Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={20} className="text-gray-600 mt-0.5" />
                <span className="text-gray-600">1234 Aviation Way, Flight City, FC 56789</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-gray-600" />
                <span className="text-gray-600">+1 (555) 234-5678</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-gray-600" />
                <span className="text-gray-600">support@flightfinder.com</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Footer Bottom - Copyright */}
      <div className="border-t border-gray-300">
        <div className="container mx-auto py-6 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              &copy; {currentYear} FlightFinder. All rights reserved.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/privacy" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                Cookie Policy
              </Link>
              <Link href="/sitemap" className="text-gray-600 hover:text-gray-800 text-sm transition-colors">
                Sitemap
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
} 