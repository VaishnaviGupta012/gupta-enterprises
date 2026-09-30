import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { CONTACT, waLink } from "../data/contact"
import { useEnquiry } from "../context/EnquiryContext"

const NAV_LINKS = [
  { to: "/", label: "Home" },
  { to: "/services", label: "Services" },
  { to: "/documents", label: "Documents Required" },
  { to: "/about", label: "About Us" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
]

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { openEnquiryModal } = useEnquiry()

  // Add subtle shadow when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/"
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    )
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-200 bg-white ${
        isScrolled
          ? "shadow-sm border-b border-slate-200/90 bg-white/95 backdrop-blur-xs"
          : "border-b border-slate-200/70"
      }`}
    >
      <div className="site-container">
        <div className="flex items-center justify-between h-18 gap-2">
          {/* Logo & Brand Identity */}
          <Link
            to="/"
            className="flex items-center gap-3 group shrink-0 min-w-0"
          >
            <div className="w-10 h-10 rounded-xl bg-[#1565C0] text-white flex items-center justify-center font-bold text-lg font-['Poppins'] shadow-xs group-hover:bg-[#0D47A1] transition-colors shrink-0">
              GE
            </div>
            <div className="min-w-0">
              <div className="text-base sm:text-lg font-bold font-['Poppins'] text-[#0D47A1] leading-tight truncate group-hover:text-[#1565C0] transition-colors">
                Gupta Enterprises
              </div>
              <div className="text-[11px] font-medium text-slate-500 leading-none mt-0.5 flex items-center gap-1.5 truncate">
                <span>CSC &amp; Digital Seva Kendra</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] shrink-0" />
                <span className="text-[#1565C0] font-semibold">Pipraich</span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav
            className="hidden lg:flex items-center gap-1 xl:gap-1.5 shrink-0"
            aria-label="Main Navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.to)
                    ? "text-[#1565C0] bg-[#EAF4FF] font-semibold shadow-2xs"
                    : "text-slate-600 hover:text-[#1565C0] hover:bg-[#F5F9FF]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Action CTAs (Enquiry, Call, WhatsApp) */}
          <div className="hidden md:flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => openEnquiryModal()}
              className="px-3.5 py-2 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white text-xs lg:text-sm font-semibold shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>📝</span>
              <span>Enquiry</span>
            </button>

            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="px-3.5 py-2 rounded-xl border border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5"
            >
              <span>📞</span>
              <span className="hidden xl:inline">Call Now</span>
            </a>

            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-2 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white text-xs lg:text-sm font-semibold shadow-xs transition-all flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              <span>WhatsApp</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-[#F5F9FF] border border-slate-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white shadow-lg animate-in slide-in-from-top-2 duration-150">
          <nav className="site-container py-4 flex flex-col gap-1.5">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-3.5 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.to)
                    ? "text-[#1565C0] bg-[#EAF4FF] font-semibold"
                    : "text-slate-700 hover:bg-[#F5F9FF]"
                }`}
              >
                {link.label}
              </Link>
            ))}

            <div className="pt-3 border-t border-slate-200 mt-2 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  openEnquiryModal()
                }}
                className="w-full py-2.5 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-semibold text-sm shadow-xs flex items-center justify-center gap-2"
              >
                <span>📝</span>
                <span>Submit Service Enquiry</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="py-2.5 rounded-xl border border-[#1565C0] text-[#1565C0] text-center font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#EAF4FF]"
                >
                  <span>📞 Call Now</span>
                </a>
                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 rounded-xl bg-[#25D366] text-white text-center font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-[#1EBE5D]"
                >
                  <span>💬 WhatsApp</span>
                </a>
              </div>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
