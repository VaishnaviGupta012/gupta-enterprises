import { useState, useEffect } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { services, findServiceById } from "../data/services"
import { waLink } from "../data/contact"
import { useEnquiry } from "../context/EnquiryContext"

const GENERAL_CITIZEN_TIPS = [
  "Carry original documents alongside one set of photocopies.",
  "Ensure your mobile number is active to receive UIDAI or department OTPs.",
  "For certificates & pensions, ensure family names strictly match Aadhaar spelling.",
  "For bank-related subsidies (PM Kisan, Scholarships), ensure bank account has NPCI Aadhaar seeding active.",
]

export default function Documents() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState("")
  const [selectedServiceId, setSelectedServiceId] = useState(
    params.get("service") || "aadhaar-update",
  )
  const { openEnquiryModal } = useEnquiry()

  useEffect(() => {
    const s = params.get("service")
    if (s) {
      setSelectedServiceId(s)
    }
  }, [params])

  const handleSelect = (id: string) => {
    setSelectedServiceId(id)
    if (id) {
      setParams({ service: id }, { replace: true })
    } else {
      setParams({}, { replace: true })
    }
  }

  const currentService = findServiceById(selectedServiceId) || services[0]

  // Quick filter for search results in dropdown
  const filteredList = search.trim()
    ? services.filter(
        (s) =>
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.category.toLowerCase().includes(search.toLowerCase()),
      )
    : services

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-24 md:pb-16 w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-[#0D47A1] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#0a3880]">
        <div className="site-container max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Gupta Enterprises</span>
            <span>•</span>
            <span>Pre-Visit Guide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] tracking-tight">
            Required Documents Checklist
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
            Check the necessary original papers, proofs, and photographs before
            visiting our Pipraich centre to complete your application in a
            single trip.
          </p>
        </div>
      </div>

      <div className="site-container py-10 max-w-4xl">
        {/* Service Selector Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-bold text-base sm:text-lg font-['Poppins'] text-[#0D47A1]">
                Select a Service to Inspect Checklist
              </h2>
              <p className="text-xs text-slate-500">
                Choose from all categories or search by name.
              </p>
            </div>
            <span className="text-xs text-[#1565C0] font-semibold">
              {services.length} services available
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
            {/* Quick search input */}
            <div className="sm:col-span-5 relative">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter dropdown list..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs text-[#172033] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
              />
              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Select Dropdown */}
            <div className="sm:col-span-7">
              <select
                value={currentService.id}
                onChange={(e) => handleSelect(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-[#172033] outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
              >
                {filteredList.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Selected Service Document Display Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div className="flex items-start gap-4 pb-4 border-b border-slate-100">
            <div className="w-14 h-14 rounded-2xl bg-[#EAF4FF] border border-[#BFDBFE]/70 flex items-center justify-center text-3xl shrink-0">
              {currentService.icon}
            </div>
            <div>
              <div className="text-xs font-semibold text-[#1565C0] uppercase tracking-wider">
                {currentService.category}
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-[#0D47A1]">
                {currentService.name}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {currentService.shortDescription}
              </p>
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold font-['Poppins'] text-[#0D47A1] flex items-center gap-2">
              <span>📋</span>
              <span>Documents to Bring Along:</span>
            </h4>

            <div className="space-y-2.5">
              {currentService.documents.map((doc, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-2xl bg-[#F5F9FF] border border-slate-200 flex items-start gap-3 text-xs sm:text-sm text-slate-800"
                >
                  <span className="text-emerald-600 font-bold text-base leading-none mt-0.5">
                    ✓
                  </span>
                  <span className="leading-snug">{doc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Helpful Tips Card */}
          <div className="p-4 rounded-2xl bg-[#EAF4FF] border border-[#BFDBFE] space-y-2 text-xs text-slate-700">
            <div className="font-bold text-[#1565C0] flex items-center gap-1.5 font-['Poppins']">
              <span>💡</span>
              <span>General Centre Visit Advice:</span>
            </div>
            <ul className="space-y-1 pl-1">
              {GENERAL_CITIZEN_TIPS.map((tip, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-[#1565C0] font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action CTAs */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3 justify-between">
            <Link
              to={`/services/${currentService.id}`}
              className="text-xs font-semibold text-[#1565C0] hover:underline"
            >
              ← View full application process for {currentService.name}
            </Link>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                type="button"
                onClick={() => openEnquiryModal(currentService.name)}
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
              >
                Submit Enquiry
              </button>

              <a
                href={waLink(currentService.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs shadow-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>💬 WhatsApp Us</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
