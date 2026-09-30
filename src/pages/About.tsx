import { Link } from "react-router-dom"
import { CONTACT, waLink } from "../data/contact"

const VALUES = [
  {
    icon: "🤝",
    title: "Citizen-Centric Guidance",
    desc: "We prioritize your convenience, patiently explaining forms and procedures without complicated jargon.",
  },
  {
    icon: "🏛️",
    title: "Authorized CSC Standards",
    desc: "Operating with genuine portal access, official BBPS bill receipt generation, and secure DigiPay banking.",
  },
  {
    icon: "🔒",
    title: "Data Privacy & Care",
    desc: "We never store your passwords or unauthorized document copies. Your privacy and records remain fully protected.",
  },
  {
    icon: "📍",
    title: "Local Rooted Presence",
    desc: "A permanent physical centre in Pipraich you can visit, run by trusted local professionals from your own community.",
  },
]

export default function About() {
  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-24 md:pb-16 w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-[#0D47A1] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#0a3880]">
        <div className="site-container max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Gupta Enterprises</span>
            <span>•</span>
            <span>About Us</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] tracking-tight">
            About Gupta Enterprises
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
            Your authorized Common Service Centre (CSC) &amp; Digital Seva
            Kendra in Pipraich, Gorakhpur.
          </p>
        </div>
      </div>

      <div className="site-container py-10 max-w-4xl space-y-10">
        {/* Story & Centre Profile */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 space-y-4">
            <div className="section-badge">
              Serving Pipraich &amp; Gorakhpur
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-[#0D47A1]">
              Dedicated to Digital Inclusion &amp; Easy Citizen Assistance
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Gupta Enterprises was established with a clear mission: to make
              government welfare schemes, official documents, banking, and
              digital citizen services accessible to every resident in and
              around Pipraich.
            </p>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              In today's digital era, government portals require strict photo
              formats, precise documentation, and online fee payments. We
              provide a friendly, reliable physical environment where citizens
              of all ages can get their applications processed smoothly without
              running between offices.
            </p>
          </div>

          <div className="md:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1565C0] text-white flex items-center justify-center font-bold text-xl font-['Poppins']">
                GE
              </div>
              <div>
                <h3 className="font-bold text-lg font-['Poppins'] text-[#0D47A1]">
                  Gupta Enterprises
                </h3>
                <p className="text-xs text-[#1565C0] font-semibold">
                  Authorized Common Service Centre
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-600">
                <div className="flex items-start gap-2">
                  <span>📍</span>
                  <span>{CONTACT.fullAddress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <a
                    href={`tel:${CONTACT.phoneTel}`}
                    className="font-semibold text-[#1565C0] hover:underline"
                  >
                    {CONTACT.phone}
                  </a>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕒</span>
                  <span>Mon – Sat: 8:00 AM – 8:00 PM</span>
                </div>
              </div>

              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 rounded-xl bg-[#EAF4FF] hover:bg-[#DBEAFE] border border-[#BFDBFE] text-[#1565C0] font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>🗺️ View on Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Core Values */}
        <div className="space-y-6">
          <div className="text-center max-w-xl mx-auto">
            <h2 className="section-title">Our Commitments to You</h2>
            <p className="section-subtitle mx-auto">
              Principles that guide our daily citizen assistance service in
              Pipraich.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {VALUES.map((val, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex gap-4"
              >
                <div className="w-11 h-11 rounded-xl bg-[#EAF4FF] border border-[#BFDBFE]/60 flex items-center justify-center text-2xl shrink-0">
                  {val.icon}
                </div>
                <div>
                  <h3 className="font-bold text-sm font-['Poppins'] text-[#0D47A1] mb-1">
                    {val.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {val.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Public Disclaimer Card */}
        <div className="bg-[#EAF4FF] border border-[#BFDBFE] rounded-3xl p-6 sm:p-7 space-y-2">
          <h3 className="font-bold text-sm text-[#0D47A1] font-['Poppins'] flex items-center gap-2">
            <span>ℹ️</span>
            <span>Important Public Disclosure</span>
          </h3>
          <p className="text-xs text-slate-700 leading-relaxed">
            Gupta Enterprises operates as an independent service assistance
            centre and authorized Common Service Centre (CSC). We assist
            citizens in filling forms, arranging documents, and submitting
            online applications on official portals. Acceptance, rejection,
            processing timelines, and statutory portal fees are governed
            strictly by the respective government departments and authorities.
          </p>
        </div>

        {/* CTAs */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/services"
            className="px-6 py-3 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all"
          >
            Explore Services
          </Link>

          <Link
            to="/contact"
            className="px-6 py-3 rounded-xl border border-[#1565C0] text-[#1565C0] hover:bg-[#EAF4FF] font-semibold text-xs sm:text-sm transition-all"
          >
            Contact Centre
          </Link>

          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center gap-1.5"
          >
            <span>💬 Chat on WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  )
}
