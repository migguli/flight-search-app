import Link from 'next/link'
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin, CreditCard, Shield, Clock, Sparkles, ArrowUpRight } from 'lucide-react'
import { Motion } from '@/components/ui/motion'

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-10 pointer-events-none">
        <div className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary-500 blur-3xl animate-float"></div>
        <div className="absolute -left-20 top-40 w-72 h-72 rounded-full bg-accent-500 blur-3xl animate-pulse-glow"></div>
        <div className="absolute right-40 bottom-20 w-56 h-56 rounded-full bg-primary-700 blur-3xl animate-shimmer"></div>
      </div>
      
      {/* Footer Top - Contact & Benefits */}
      <div className="relative bg-gradient-cosmic">
        <div className="container mx-auto py-6 px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Motion animationType="slide-up" delay={100} duration={700}>
              <div className="flex items-center justify-center md:justify-start gap-3 group transition-all duration-300 hover:scale-105 hover:translate-x-2">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <CreditCard className="text-accent-200 group-hover:text-accent-100 transition-colors duration-300" size={24} />
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-1">
                    Secure Payments
                    <Sparkles size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent-200" />
                  </h3>
                  <p className="text-sm text-white/80">All transactions are encrypted</p>
                </div>
              </div>
            </Motion>
            
            <Motion animationType="slide-up" delay={200} duration={700}>
              <div className="flex items-center justify-center md:justify-start gap-3 group transition-all duration-300 hover:scale-105 hover:translate-x-2">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <Clock className="text-accent-200 group-hover:text-accent-100 transition-colors duration-300" size={24} />
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-1">
                    24/7 Support
                    <Sparkles size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent-200" />
                  </h3>
                  <p className="text-sm text-white/80">Contact us anytime</p>
                </div>
              </div>
            </Motion>
            
            <Motion animationType="slide-up" delay={300} duration={700}>
              <div className="flex items-center justify-center md:justify-start gap-3 group transition-all duration-300 hover:scale-105 hover:translate-x-2">
                <div className="p-3 bg-white/10 backdrop-blur-md rounded-lg group-hover:bg-white/20 transition-all duration-300">
                  <Shield className="text-accent-200 group-hover:text-accent-100 transition-colors duration-300" size={24} />
                </div>
                <div>
                  <h3 className="font-bold flex items-center gap-1">
                    Best Price Guarantee
                    <Sparkles size={12} className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-accent-200" />
                  </h3>
                  <p className="text-sm text-white/80">Find it cheaper, we refund</p>
                </div>
              </div>
            </Motion>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto py-12 px-4 relative">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Motion animationType="slide-right" duration={700}>
            <div>
              <h2 className="text-2xl font-display font-bold mb-6 sexy-gradient-text">FlightFinder</h2>
              <p className="text-neutral-400 mb-6 leading-relaxed">
                Find the best flights and accommodations for your next adventure. Compare prices and book with confidence.
              </p>
              <div className="flex items-center gap-4">
                {[
                  { href: 'https://facebook.com', Icon: Facebook },
                  { href: 'https://twitter.com', Icon: Twitter },
                  { href: 'https://instagram.com', Icon: Instagram },
                  { href: 'https://linkedin.com', Icon: Linkedin }
                ].map((social, index) => (
                  <Link 
                    key={social.href} 
                    href={social.href} 
                    aria-label={social.href.split('https://')[1].split('.com')[0]} 
                    className="text-neutral-400 hover:text-primary-400 transition-all duration-300 hover:scale-125 transform"
                  >
                    <social.Icon size={20} />
                  </Link>
                ))}
              </div>
            </div>
          </Motion>
          
          <Motion animationType="slide-up" delay={200} duration={700}>
            <div>
              <h3 className="font-bold text-lg mb-4 text-white neon-gradient-text">Quick Links</h3>
              <ul className="space-y-3">
                {[
                  { href: '/search', label: 'Search Flights' },
                  { href: '/destinations', label: 'Popular Destinations' },
                  { href: '/deals', label: 'Flight Deals' },
                  { href: '/about', label: 'About Us' },
                  { href: '/contact', label: 'Contact' }
                ].map((link) => (
                  <li key={link.href} className="transform transition-transform duration-300 hover:translate-x-2">
                    <Link href={link.href} className="text-neutral-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">
                      {link.label}
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Motion>
          
          <Motion animationType="slide-up" delay={350} duration={700}>
            <div>
              <h3 className="font-bold text-lg mb-4 text-white neon-gradient-text">Support</h3>
              <ul className="space-y-3">
                {[
                  { href: '/faq', label: 'FAQ' },
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/terms', label: 'Terms of Service' },
                  { href: '/refunds', label: 'Refund Policy' },
                  { href: '/help', label: 'Help Center' }
                ].map((link) => (
                  <li key={link.href} className="transform transition-transform duration-300 hover:translate-x-2">
                    <Link href={link.href} className="text-neutral-400 hover:text-white transition-colors duration-300 flex items-center gap-1 group">
                      {link.label}
                      <ArrowUpRight size={14} className="opacity-0 group-hover:opacity-100 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Motion>
          
          <Motion animationType="slide-left" delay={200} duration={700}>
            <div>
              <h3 className="font-bold text-lg mb-4 text-white neon-gradient-text">Contact Us</h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3 group hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                  <MapPin size={20} className="text-neutral-400 mt-0.5 group-hover:text-primary-400 transition-colors duration-300" />
                  <span className="text-neutral-400 group-hover:text-white transition-colors duration-300">1234 Aviation Way, Flight City, FC 56789</span>
                </li>
                <li className="flex items-center gap-3 group hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                  <Phone size={20} className="text-neutral-400 group-hover:text-primary-400 transition-colors duration-300" />
                  <span className="text-neutral-400 group-hover:text-white transition-colors duration-300">+1 (555) 234-5678</span>
                </li>
                <li className="flex items-center gap-3 group hover:bg-white/5 p-2 rounded-lg transition-all duration-300">
                  <Mail size={20} className="text-neutral-400 group-hover:text-primary-400 transition-colors duration-300" />
                  <span className="text-neutral-400 group-hover:text-white transition-colors duration-300">support@flightfinder.com</span>
                </li>
              </ul>
            </div>
          </Motion>
        </div>
      </div>
      
      {/* Newsletter Signup */}
      <Motion animationType="slide-up" duration={700}>
        <div className="relative py-12 px-4 bg-gradient-to-r from-primary-900/50 to-primary-700/50 backdrop-blur-sm">
          <div className="container mx-auto max-w-4xl">
            <div className="p-8 rounded-xl bg-white/10 backdrop-blur-md shadow-xl border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-sexy opacity-10"></div>
              <div className="relative">
                <h3 className="text-2xl font-bold text-center mb-6 cosmic-gradient-text">Subscribe for the Best Flight Deals</h3>
                <form className="flex flex-col md:flex-row gap-4">
                  <input 
                    type="email" 
                    placeholder="Enter your email" 
                    className="flex-1 px-4 py-3 rounded-lg bg-white/20 border border-white/20 text-white placeholder-white/60 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-300"
                  />
                  <button 
                    type="submit" 
                    className="px-6 py-3 bg-gradient-to-r from-accent-500 to-accent-600 text-white font-bold rounded-lg shadow-lg hover:shadow-accent-500/30 transition-all duration-300 hover:scale-105"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </Motion>
      
      {/* Footer Bottom - Copyright */}
      <div className="border-t border-neutral-800 relative">
        <Motion animationType="fade" duration={700}>
          <div className="container mx-auto py-6 px-4">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-neutral-500 text-sm mb-4 md:mb-0">
                &copy; {currentYear} FlightFinder. All rights reserved.
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                {['Privacy Policy', 'Terms of Service', 'Cookie Policy', 'Sitemap'].map((item, index) => (
                  <Link key={index} href={`/${item.toLowerCase().replace(/\s+/g, '-')}`} className="text-neutral-500 hover:text-white text-sm transition-all duration-300 hover:scale-105">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Motion>
      </div>
    </footer>
  )
} 