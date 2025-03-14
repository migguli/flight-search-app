import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-white py-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-display font-semibold mb-4">FlightFinder</h3>
            <p className="text-neutral-300">
              Find and book your perfect flight with ease.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/search" className="text-neutral-300 hover:text-white transition-colors">
                  Search Flights
                </Link>
              </li>
              <li>
                <Link href="/deals" className="text-neutral-300 hover:text-white transition-colors">
                  Special Deals
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-neutral-300 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-neutral-300 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-neutral-300 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-neutral-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-neutral-300 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-neutral-300 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-neutral-800 text-center text-neutral-300">
          <p>&copy; {new Date().getFullYear()} FlightFinder. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
} 