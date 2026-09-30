import { useParams, Link } from "react-router-dom"
import { findServiceById, services } from "../data/services"
import { CONTACT, waLink } from "../data/contact"
import { useEnquiry } from "../context/EnquiryContext"

export default function ServiceDetail() {
  const { id } = useParams<{ id: string }>()
  const service = id ? findServiceById(id) : undefined
  const { openEnquiryModal } = useEnquiry()

  if (!service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-center p-8 bg-[#F5F9FF]">
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm max-w-md">
          <div className="text-5xl mb-3">🔍</div>
          <h2 className="text-xl font-bold text-[#0D47A1] font-['Poppins'] mb-2">
            Service Not Found
          </h2>
          <p className="text-xs text-slate-500 mb-6 leading-relaxed">
            The service you are looking for may have been moved, renamed, or
            updated in our catalogue.
          </p>
          <Link
            to="/services"
            className="px-5 py-2.5 bg-[#1565C0] hover:bg-[#0D47A1] text-white rounded-xl text-xs font-semibold transition-colors inline-block"
          >
            Browse All Services
          </Link>
        </div>
      </div>
    )
  }

  // Related services in the same category
  const relatedServices = services
    .filter((s) => s.categoryId === service.categoryId && s.id !== service.id)
    .slice(0, 3)

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-24 md:pb-16 w-full overflow-x-hidden">
      {/* ── Breadcrumb Navigation ─────────────────────────────────── */}
      <div className="bg-white border-b border-slate-200">
        <div className="site-container py-3 flex items-center gap-2 text-xs text-slate-500 font-medium flex-wrap">
          <Link to="/" className="hover:text-[#1565C0] transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link
            to="/services"
            className="hover:text-[#1565C0] transition-colors"
          >
            Services
          </Link>
          <span>/</span>
          <Link
            to={`/services?cat=${service.categoryId}`}
            className="hover:text-[#1565C0] transition-colors"
          >
            {service.category}
          </Link>
          <span>/</span>
          <span className="text-[#0D47A1] font-semibold truncate">
            {service.name}
          </span>
        </div>
      </div>

      <div className="site-container py-8 sm:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left / Main Column (Col 1-8) ────────────────────────── */}
          <div className="lg:col-span-8 space-y-6">
            {/* Service Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#EAF4FF] border border-[#BFDBFE]/70 flex items-center justify-center text-3xl shrink-0">
                  {service.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-xs font-semibold text-[#1565C0] uppercase tracking-wider">
                      {service.category}
                    </span>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border ${
                        service.status === "available"
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-amber-50 text-amber-700 border-amber-200"
                      }`}
                    >
                      {service.status === "available" ? "Available" : "Enquire"}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold font-['Poppins'] text-[#0D47A1] leading-tight">
                    {service.name}
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>
              </div>
            </div>

            {/* What is this service? */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-2.5">
              <div className="flex items-center gap-2 text-base font-bold font-['Poppins'] text-[#0D47A1]">
                <span>📖</span>
                <h2>What is this service?</h2>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                {service.whatIsThis}
              </p>
            </div>

            {/* Required Documents Checklist */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 text-base font-bold font-['Poppins'] text-[#0D47A1]">
                  <span>📋</span>
                  <h2>Required Documents</h2>
                </div>
                <Link
                  to={`/documents?service=${service.id}`}
                  className="text-xs font-semibold text-[#1565C0] hover:underline"
                >
                  View in Documents Hub →
                </Link>
              </div>

              <ul className="space-y-2.5">
                {service.documents.map((doc, idx) => (
                  <li
                    key={idx}
                    className="flex items-start gap-3 text-xs sm:text-sm text-slate-700"
                  >
                    <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold">
                      ✓
                    </div>
                    <span className="leading-snug">{doc}</span>
                  </li>
                ))}
              </ul>

              <div className="p-3 rounded-xl bg-[#F5F9FF] border border-slate-200 text-[11px] text-slate-600">
                💡 <strong>Helpful Tip:</strong> Please carry original documents
                along with one set of photocopies when visiting the centre in
                Pipraich.
              </div>
            </div>

            {/* Application Process */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-base font-bold font-['Poppins'] text-[#0D47A1] pb-3 border-b border-slate-100">
                <span>🔄</span>
                <h2>Application Process &amp; Steps</h2>
              </div>

              <div className="space-y-3.5">
                {service.steps.map((step, i) => (
                  <div key={i} className="flex gap-3.5 items-start">
                    <div className="w-7 h-7 rounded-xl bg-[#1565C0] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5 font-['Poppins']">
                      {i + 1}
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-semibold text-[#0D47A1]">
                        Step {i + 1}
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                        {step}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Notes */}
            {service.importantNotes && service.importantNotes.length > 0 && (
              <div className="bg-[#EAF4FF] border border-[#BFDBFE] rounded-3xl p-6 sm:p-7 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-[#1565C0] font-['Poppins']">
                  <span>⚠️</span>
                  <h3>Important Notes &amp; Portal Instructions</h3>
                </div>
                <ul className="space-y-2 text-xs text-slate-600">
                  {service.importantNotes.map((note, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#1565C0] font-bold">•</span>
                      <span>{note}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* ── Right Column: Sticky Action & Centre Info (Col 9-12) ─── */}
          <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
            {/* Quick Action Card */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base font-['Poppins'] text-[#0D47A1]">
                Ready to Apply or Enquire?
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Connect with Gupta Enterprises for verified assistance with{" "}
                {service.name}.
              </p>

              <div className="space-y-2.5 pt-1">
                {/* Submit Enquiry Button */}
                <button
                  type="button"
                  onClick={() => openEnquiryModal(service.name)}
                  className="w-full py-3 px-4 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>📝</span>
                  <span>Enquire Now</span>
                </button>

                {/* WhatsApp Button */}
                <a
                  href={waLink(service.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Chat on WhatsApp</span>
                </a>

                {/* Call Button */}
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="w-full py-2.5 px-4 rounded-xl border border-[#1565C0] text-[#1565C0] hover:bg-[#EAF4FF] font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2"
                >
                  <span>📞 Call: +91 87565 57994</span>
                </a>
              </div>
            </div>

            {/* Centre Timings & Address Info */}
            <div className="bg-white rounded-3xl p-5 border border-slate-200 text-xs space-y-2.5 shadow-xs">
              <div className="font-bold text-[#0D47A1] font-['Poppins'] text-sm">
                Centre Visit Information
              </div>
              <div className="text-slate-600 space-y-1">
                <div>
                  <strong className="text-slate-800">Working Hours:</strong> Mon
                  – Sat: 8:00 AM – 8:00 PM
                </div>
                <div>
                  <strong className="text-slate-800">Location:</strong> Near
                  Saint Xavier's School, Bhatahat Road, Pipraich, Gorakhpur
                </div>
              </div>
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#1565C0] font-semibold hover:underline inline-block mt-1"
              >
                🗺️ Get Directions on Google Maps →
              </a>
            </div>

            {/* Related Services in Same Category */}
            {relatedServices.length > 0 && (
              <div className="bg-white rounded-3xl p-5 border border-slate-200 space-y-3 shadow-xs">
                <h4 className="text-xs font-semibold text-[#1565C0] uppercase tracking-wider font-['Poppins']">
                  More in {service.category}
                </h4>
                <div className="space-y-2">
                  {relatedServices.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/services/${rel.id}`}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-[#1565C0] hover:bg-[#F5F9FF] flex items-center justify-between text-xs transition-colors"
                    >
                      <span className="font-semibold text-[#172033]">
                        {rel.name}
                      </span>
                      <span className="text-[#1565C0]">→</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
