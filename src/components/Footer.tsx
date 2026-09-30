import { Link } from "react-router-dom"
import { CONTACT, waLink } from "../data/contact"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#0B1E3B] text-slate-300 border-t border-slate-800">
      <div className="site-container py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Brand Info & Mission (Col 1-4) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#1565C0] text-white flex items-center justify-center font-bold text-lg font-['Poppins'] shadow-sm">
                GE
              </div>
              <div>
                <div className="font-bold text-lg font-['Poppins'] text-white">
                  Gupta Enterprises
                </div>
                <div className="text-[#90CDF4] text-xs font-semibold">
                  Authorized CSC &amp; Digital Seva Kendra
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Your trusted Common Service Centre in Pipraich, Gorakhpur.
              Assisting citizens with government documents, certificates,
              banking, and online services under one roof with complete
              transparency.
            </p>

            <div className="p-3.5 rounded-xl bg-blue-950/70 border border-blue-800/40 text-[11px] text-slate-300 leading-relaxed">
              <strong className="text-white">Public Notice:</strong> Gupta
              Enterprises is an independent citizen digital service assistance
              centre. Official eligibility, statutory portal fees, and
              processing times are determined by respective government
              departments.
            </div>
          </div>

          {/* Quick Links (Col 5-6) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs font-bold text-[#90CDF4] uppercase tracking-wider font-['Poppins']">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { to: "/", label: "Home" },
                { to: "/services", label: "All Services" },
                { to: "/documents", label: "Required Documents" },
                { to: "/about", label: "About Our Centre" },
                { to: "/faq", label: "Help & FAQ" },
                { to: "/contact", label: "Contact Us" },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[#1565C0]">›</span>
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Featured Services (Col 7-9) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#90CDF4] uppercase tracking-wider font-['Poppins']">
              Citizen Services
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                {
                  to: "/services/aadhaar-update",
                  label: "Aadhaar Related Services",
                },
                { to: "/services/pan-apply", label: "PAN Card (New & Update)" },
                {
                  to: "/services/income-cert",
                  label: "Income & Caste Certificates",
                },
                {
                  to: "/services/ayushman-bharat",
                  label: "Ayushman Bharat Card",
                },
                { to: "/services/pm-kisan", label: "PM Kisan Samman Nidhi" },
                {
                  to: "/services/aeps-banking",
                  label: "AePS Biometric ATM Banking",
                },
                {
                  to: "/services/utility-bills",
                  label: "Electricity Bill Payment",
                },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="text-slate-300 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    <span className="text-[#1565C0]">›</span>
                    <span>{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details & Hours (Col 10-12) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-[#90CDF4] uppercase tracking-wider font-['Poppins']">
              Visit or Contact
            </h4>
            <div className="space-y-2.5 text-xs text-slate-300">
              <div className="flex items-start gap-2">
                <span className="text-sm shrink-0">📍</span>
                <div>
                  <span className="leading-snug block">
                    {CONTACT.addressLine1}, {CONTACT.addressLine2}, Pipraich,
                    Gorakhpur - 273152
                  </span>
                  <a
                    href={CONTACT.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#90CDF4] hover:underline font-semibold mt-1 inline-flex items-center gap-1"
                  >
                    Open in Google Maps →
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">📞</span>
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="hover:text-white transition-colors font-medium text-white"
                >
                  {CONTACT.phone}
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">💬</span>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#25D366] hover:underline font-semibold"
                >
                  WhatsApp: +91 87565 57994
                </a>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm">✉️</span>
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="hover:text-white transition-colors truncate"
                >
                  {CONTACT.email}
                </a>
              </div>

              <div className="flex items-start gap-2 pt-1 border-t border-slate-700/60">
                <span className="text-sm">🕒</span>
                <div className="text-[11px] leading-tight">
                  <span className="text-white font-medium block">
                    Mon – Sat: 8:00 AM – 8:00 PM
                  </span>
                  <span className="text-slate-400">
                    Sunday: Closed (On-call assistance)
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Admin Link */}
        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p>© {currentYear} Gupta Enterprises. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <Link
              to="/about"
              className="hover:text-slate-200 transition-colors"
            >
              Terms &amp; Disclosure
            </Link>
            <span>•</span>
            <Link
              to="/admin/login"
              className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
            >
              <span>🔒</span>
              <span>Staff Login</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
