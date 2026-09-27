import { Link } from 'react-router-dom';
import { CONTACT, waLink } from '../data/contact';

export default function Footer() {
  return (
    <footer className="bg-[#0f2060] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-white font-bold text-lg font-['Poppins']">
                G
              </div>
              <div>
                <div className="font-bold text-base font-['Poppins']">Gupta Enterprises</div>
                <div className="text-blue-200 text-[10px]">Digital Service Centre</div>
              </div>
            </div>
            <p className="text-blue-200 text-sm leading-relaxed mb-3">
              Digital &amp; Online Service Assistance Centre, Pipraich, Gorakhpur.
            </p>
            <p className="text-blue-300 text-xs leading-relaxed">
              Gupta Enterprises is an independent service assistance centre. Availability, eligibility, fees, requirements and processing times for individual services may depend on the relevant authority or service provider.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/80 uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/services', label: 'Services' },
                { to: '/documents', label: 'Documents Required' },
                { to: '/about', label: 'About Us' },
                { to: '/faq', label: 'FAQ' },
                { to: '/contact', label: 'Contact' },
              ].map(link => (
                <li key={link.to}>
                  <Link to={link.to} className="text-blue-200 text-sm hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Services */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/80 uppercase tracking-wider">Popular Services</h4>
            <ul className="space-y-2">
              {[
                { id: 'pan-apply', label: 'PAN Card' },
                { id: 'passport-apply', label: 'Passport' },
                { id: 'income-cert', label: 'Certificates' },
                { id: 'electricity-bill', label: 'Bill Payment' },
                { id: 'competitive-exam-forms', label: 'Exam Forms' },
              ].map(s => (
                <li key={s.id}>
                  <Link to={`/services/${s.id}`} className="text-blue-200 text-sm hover:text-white transition-colors">
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-sm mb-3 text-white/80 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-sm text-blue-200">
              <li className="flex gap-2">
                <span className="shrink-0">📍</span>
                <div>
                  <span>{CONTACT.addressLine1}<br />{CONTACT.addressLine2}<br />{CONTACT.addressLine3}</span>
                  <a
                    href={CONTACT.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-300 hover:text-white mt-1 inline-flex items-center gap-1 transition-colors block"
                  >
                    Get Directions →
                  </a>
                </div>
              </li>
              <li className="flex gap-2">
                <span>📞</span>
                <a href={`tel:${CONTACT.phoneTel}`} className="hover:text-white transition-colors">{CONTACT.phone}</a>
              </li>
              <li className="flex gap-2">
                <span>💬</span>
                <a href={waLink()} target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">WhatsApp</a>
              </li>
              <li className="flex gap-2">
                <span>✉️</span>
                <a href={`mailto:${CONTACT.email}`} className="hover:text-white transition-colors break-all">{CONTACT.email}</a>
              </li>
              <li className="flex gap-2">
                <span className="shrink-0">🕐</span>
                <span>Mon–Sat: 9:00 AM – 8:00 PM<br /><span className="text-blue-300">Sunday: Closed</span></span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-blue-300">
          <p>© {new Date().getFullYear()} Gupta Enterprises. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/faq" className="hover:text-white transition-colors">FAQ</Link>
            <Link to="/about" className="hover:text-white transition-colors">Disclaimer</Link>
            <Link to="/admin" className="hover:text-white transition-colors text-blue-300 hover:text-amber-300 opacity-80 hover:opacity-100 flex items-center gap-1 transition-all">
              <span>🔒</span> Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
