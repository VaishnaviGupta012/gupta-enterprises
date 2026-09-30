import { useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { waLink } from "../data/contact"

export default function Hero() {
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <section className="relative bg-gradient-to-b from-[#F5F9FF] to-[#EAF4FF] border-b border-slate-200 py-12 lg:py-16 overflow-hidden">
      {/* Subtle background glow contained within hero */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-blue-200/40 blur-2xl pointer-events-none" />

      <div className="site-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Heading, Supporting Text, Search, CTAs */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* Blue Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EAF4FF] border border-[#BFDBFE] text-[#1565C0] text-xs font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-[#1565C0]" />
              <span>CSC &amp; Digital Seva Kendra • Pipraich, Gorakhpur</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-['Poppins'] text-[#0D47A1] leading-[1.2] tracking-tight">
              All Digital &amp; Government Services{" "}
              <span className="text-[#1565C0] underline decoration-[#90CDF4] decoration-2 underline-offset-4">
                at One Place
              </span>
            </h1>

            {/* Short Supporting Text */}
            <p className="text-[#556987] text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              Get fast, verified, and guided assistance for Aadhaar, PAN card,
              voter ID, e-District certificates, PM welfare schemes, banking
              cash withdrawals, and online applications in Pipraich.
            </p>

            {/* Modern Rounded Responsive Search Bar */}
            <form onSubmit={handleSearch} className="w-full max-w-xl">
              <div className="flex flex-col sm:flex-row items-stretch gap-2 p-1.5 bg-white rounded-2xl sm:rounded-full border border-slate-200 shadow-sm focus-within:ring-2 focus-within:ring-[#1565C0]/30 focus-within:border-[#1565C0] transition-all">
                <div className="relative flex-1 flex items-center pl-3.5 pr-2">
                  <span className="text-slate-400 text-lg mr-2 shrink-0">
                    🔍
                  </span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search service (e.g. PAN, Aadhaar, Income Certificate, FASTag)..."
                    className="w-full py-2 bg-transparent text-[#172033] placeholder:text-slate-400 text-sm outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl sm:rounded-full bg-[#1565C0] hover:bg-[#0D47A1] text-white text-sm font-semibold shadow-xs transition-all cursor-pointer shrink-0 text-center"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Two Main CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/services"
                className="px-6 py-3 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white text-sm font-semibold shadow-sm hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>Explore Services</span>
                <span>→</span>
              </Link>

              <a
                href={waLink(
                  "Hello Gupta Enterprises, I need information about your digital services.",
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-xl bg-white hover:bg-[#EAF4FF] text-[#1565C0] border border-[#BFDBFE] text-sm font-semibold shadow-xs hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4 text-[#25D366]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Contact Us / WhatsApp</span>
              </a>
            </div>

            {/* Quick Trust Highlights */}
            <div className="pt-4 grid grid-cols-3 gap-3 border-t border-slate-200/80 max-w-lg">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-['Poppins'] text-[#0D47A1]">
                  45+
                </div>
                <div className="text-xs text-[#556987] font-medium">
                  Digital Services
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-['Poppins'] text-[#1565C0]">
                  100%
                </div>
                <div className="text-xs text-[#556987] font-medium">
                  Guided Support
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-['Poppins'] text-[#0D47A1]">
                  Same Day
                </div>
                <div className="text-xs text-[#556987] font-medium">
                  Application Filing
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Digital Services Illustration / Seva Card Preview */}
          <div className="lg:col-span-5 w-full">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-md relative">
              {/* Top Card Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF4FF] text-[#1565C0] flex items-center justify-center text-xl font-bold">
                    🏛️
                  </div>
                  <div>
                    <h3 className="font-['Poppins'] font-bold text-sm text-[#0D47A1]">
                      Digital Seva Desk
                    </h3>
                    <p className="text-xs text-slate-500">
                      Authorized Citizen Facilitation
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Active Desk
                </span>
              </div>

              {/* Service Badges Grid */}
              <div className="space-y-3">
                {[
                  {
                    icon: "🪪",
                    title: "Aadhaar & PAN Card",
                    desc: "Updates, correction & instant PVC print",
                    tag: "Fast",
                  },
                  {
                    icon: "📜",
                    title: "Income, Caste & Domicile",
                    desc: "e-District Uttar Pradesh verified",
                    tag: "e-District",
                  },
                  {
                    icon: "🏦",
                    title: "AePS Banking & Bill Payment",
                    desc: "Biometric cash withdrawal & UPPCL bills",
                    tag: "Instant",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F5F9FF] border border-[#BFDBFE]/60 flex items-center gap-3"
                  >
                    <div className="w-9 h-9 rounded-lg bg-white text-[#1565C0] flex items-center justify-center text-base shadow-2xs">
                      {item.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-[#0D47A1]">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        {item.desc}
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#1565C0]">
                      {item.tag}
                    </span>
                  </div>
                ))}
              </div>

              {/* Bottom Quick Info */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <span className="text-[#1565C0]">📍</span>
                  <span>Near Block Gate, Pipraich</span>
                </div>
                <div className="font-semibold text-[#0D47A1]">
                  Mon - Sat: 8 AM - 8 PM
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
