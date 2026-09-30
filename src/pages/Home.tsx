import { useState } from "react"
import { Link } from "react-router-dom"
import Hero from "../components/Hero"
import ServiceCard from "../components/ServiceCard"
import HowItWorks from "../components/HowItWorks"
import { categories, popularServices } from "../data/services"
import { CONTACT, waLink } from "../data/contact"
import { submitEnquiry } from "../lib/supabase"

const WHY_CHOOSE_US = [
  {
    icon: "🏢",
    title: "Local Physical Centre",
    description:
      "A genuine walk-in centre in Pipraich near Saint Xavier's School, staffed by helpful locals.",
  },
  {
    icon: "⚡",
    title: "Fast & Error-Free Filing",
    description:
      "We ensure photo sizes, signatures, and document details strictly match official portal guidelines.",
  },
  {
    icon: "📋",
    title: "Clear Document Guidance",
    description:
      "Know exactly what papers to bring before visiting so your work is done in a single trip.",
  },
  {
    icon: "🏧",
    title: "Instant Branchless Banking",
    description:
      "AePS biometric cash withdrawal and fund transfers for all major nationalized and private banks.",
  },
  {
    icon: "🤝",
    title: "Transparent & Fair Pricing",
    description:
      "Clear nominal service charges without hidden markups or misleading government fee claims.",
  },
  {
    icon: "💬",
    title: "Continuous WhatsApp Help",
    description:
      "Message our helpline anytime to check application status or ask pre-visit questions.",
  },
]

const HOME_FAQS = [
  {
    q: "What documents should I bring when visiting the centre?",
    a: 'For most services (like Aadhaar, PAN card, or Certificates), please carry your original Aadhaar card, active mobile phone (for OTP), 2 passport-size photographs, and relevant supporting proofs (like electricity bill, ration card, or bank passbook). Check our "Documents Required" page for complete checklists.',
  },
  {
    q: "How much do you charge for CSC services?",
    a: "Our assistance charges follow transparent nominal rates plus statutory portal fees. Because portal fees vary by department and service category, please call or WhatsApp us at +91 87565 57994 for exact, transparent quotes.",
  },
  {
    q: "Can I withdraw cash from my bank at Gupta Enterprises?",
    a: "Yes! As an authorized DigiPay/AePS centre, you can withdraw cash from State Bank of India, PNB, Bank of Baroda, Union Bank, and 50+ other banks using your Aadhaar card and thumb fingerprint — no ATM card or passbook needed.",
  },
  {
    q: "How long does it take to receive a caste or income certificate?",
    a: "e-District Uttar Pradesh certificates (Income, Caste, Domicile) are processed by the respective Lekhpal and Tehsildar. Typically, digitally signed barcode certificates are issued within 7 to 12 working days.",
  },
  {
    q: "What are your working hours in Pipraich?",
    a: "We are open Monday to Saturday from 8:00 AM to 8:00 PM. We are closed on Sundays (available on call for urgent emergency requirements).",
  },
]

export default function Home() {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  // Home Page Inline Enquiry Form state
  const [enquiry, setEnquiry] = useState({
    name: "",
    phone: "",
    service: "General CSC & Digital Service",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState("")

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage("")

    const cleanPhone = enquiry.phone.replace(/\D/g, "")
    if (cleanPhone.length !== 10) {
      setErrorMessage("Please enter a valid 10-digit mobile number.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await submitEnquiry({
        name: enquiry.name.trim(),
        phone: cleanPhone,
        service: enquiry.service,
        message: enquiry.message.trim(),
      })

      if (res.success) {
        setReferenceId(res.referenceId)
      } else {
        setErrorMessage(res.error || "Failed to submit enquiry.")
      }
    } catch (err: any) {
      setErrorMessage(err?.message || "Error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleResetEnquiry = () => {
    setReferenceId(null)
    setEnquiry({
      name: "",
      phone: "",
      service: "General CSC & Digital Service",
      message: "",
    })
  }

  return (
    <div className="space-y-0 w-full overflow-x-hidden">
      {/* ── 1. HERO SECTION ────────────────────────────────────────── */}
      <Hero />

      {/* ── 2. SERVICES CATEGORIES SHOWCASE ────────────────────────── */}
      <section className="py-14 bg-[#F5F9FF] border-b border-slate-200">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <div className="section-badge">Organized Categories</div>
            <h2 className="section-title">Explore by Category</h2>
            <p className="section-subtitle mx-auto">
              Find exactly what you need quickly from our categorized citizen
              service sectors.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5 sm:gap-4">
            {categories
              .filter((c) => c.id !== "all")
              .map((cat) => (
                <Link
                  key={cat.id}
                  to={`/services?cat=${cat.id}`}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-[#1565C0] p-4 sm:p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#EAF4FF] group-hover:bg-[#DBEAFE] border border-[#BFDBFE]/60 flex items-center justify-center text-xl sm:text-2xl mb-3 transition-colors">
                      {cat.icon}
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm font-['Poppins'] text-[#0D47A1] group-hover:text-[#1565C0] transition-colors mb-1">
                      {cat.label}
                    </h3>
                    <p className="text-[11px] text-slate-500 leading-relaxed line-clamp-2">
                      {cat.description}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] font-semibold text-[#1565C0]">
                    <span>Browse</span>
                    <span>→</span>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* ── 3. POPULAR SERVICES GRID ───────────────────────────────── */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="site-container">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <div className="section-badge">High Demand</div>
              <h2 className="section-title">Most Requested Services</h2>
              <p className="section-subtitle">
                Popular citizen services frequently assisted at our Pipraich
                centre.
              </p>
            </div>
            <Link
              to="/services"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1565C0] hover:text-[#0D47A1] hover:underline shrink-0"
            >
              <span>View All 45+ Services</span>
              <span>→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {popularServices.slice(0, 8).map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white text-sm font-semibold shadow-xs hover:-translate-y-0.5 transition-all"
            >
              <span>Explore Complete Catalogue</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. HOW IT WORKS ────────────────────────────────────────── */}
      <HowItWorks />

      {/* ── 5. REQUIRED DOCUMENTS TEASER ───────────────────────────── */}
      <section className="py-14 bg-[#F5F9FF] border-b border-slate-200">
        <div className="site-container">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="section-badge">Pre-Visit Checklist</div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-[#0D47A1] leading-tight">
                Don't Make Wasted Trips. Check Required Documents First.
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                Whether applying for a PAN Card, updating Aadhaar, filing an
                Income Certificate, or booking a train ticket, our interactive
                Documents Hub shows you exactly what originals and copies to
                bring.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <Link
                to="/documents"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-semibold text-sm shadow-xs text-center transition-all"
              >
                📋 Open Documents Hub
              </Link>
              <a
                href={waLink("Document checklist enquiry")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-5 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-sm shadow-xs text-center transition-all flex items-center justify-center gap-2"
              >
                <span>💬 Ask on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. WHY CHOOSE GUPTA ENTERPRISES ────────────────────────── */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="site-container">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="section-badge">Trusted Local Partner</div>
            <h2 className="section-title">Why Choose Gupta Enterprises?</h2>
            <p className="section-subtitle mx-auto">
              We bridge the gap between complex digital government systems and
              local citizens with dependable, friendly, and honest guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {WHY_CHOOSE_US.map((item, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-[#1565C0] hover:shadow-md transition-all flex gap-4"
              >
                <div className="w-12 h-12 rounded-xl bg-[#EAF4FF] border border-[#BFDBFE]/60 flex items-center justify-center text-2xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold text-base font-['Poppins'] text-[#0D47A1] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 7. FAQ ACCORDION PREVIEW ───────────────────────────────── */}
      <section className="py-16 bg-[#F5F9FF] border-b border-slate-200">
        <div className="site-container max-w-4xl">
          <div className="text-center mb-10">
            <div className="section-badge">Common Questions</div>
            <h2 className="section-title">Frequently Asked Questions</h2>
            <p className="section-subtitle mx-auto">
              Quick answers about our centre timings, documents, charges, and
              process.
            </p>
          </div>

          <div className="space-y-3.5">
            {HOME_FAQS.map((faq, i) => {
              const isOpen = openFaqIndex === i
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#F5F9FF] transition-colors cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="font-semibold text-sm sm:text-base text-[#0D47A1] pr-4 font-['Poppins']">
                      {faq.q}
                    </span>
                    <span
                      className={`text-lg text-[#1565C0] font-bold transition-transform duration-200 shrink-0 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    >
                      ▾
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-2 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/faq"
              className="text-xs font-semibold text-[#1565C0] hover:text-[#0D47A1] hover:underline"
            >
              Have more questions? View Complete FAQ Page →
            </Link>
          </div>
        </div>
      </section>

      {/* ── 8. INLINE ENQUIRY FORM ─────────────────────────────────── */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="site-container max-w-2xl">
          <div className="text-center mb-8">
            <div className="section-badge">Online Service Helpdesk</div>
            <h2 className="section-title">Send Us a Direct Enquiry</h2>
            <p className="section-subtitle mx-auto">
              Submit your request below and we will contact you with exact
              requirements and next steps.
            </p>
          </div>

          {referenceId ? (
            /* Success confirmation */
            <div className="bg-[#F5F9FF] rounded-3xl p-7 border border-[#BFDBFE] shadow-sm text-center space-y-4">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-xl font-bold text-[#0D47A1] font-['Poppins']">
                Enquiry Logged Successfully!
              </h3>
              <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                Thank you,{" "}
                <strong className="text-[#0D47A1]">{enquiry.name}</strong>. Your
                enquiry has been saved with Reference ID:
              </p>
              <div className="inline-block bg-white border border-[#BFDBFE] rounded-2xl px-5 py-3">
                <span className="text-xs text-slate-500 block">
                  Reference Number:
                </span>
                <span className="text-xl font-mono font-bold text-[#1565C0]">
                  {referenceId}
                </span>
              </div>
              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                <a
                  href={waLink(
                    `Hello Gupta Enterprises, my name is ${enquiry.name} (Ref: ${referenceId}). I submitted an enquiry for ${enquiry.service}. Please share details.`,
                    true,
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2"
                >
                  <span>💬 Continue on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={handleResetEnquiry}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            /* Direct Form */
            <form
              onSubmit={handleEnquirySubmit}
              className="bg-[#F5F9FF] rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4 text-xs"
            >
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
                  ⚠️ {errorMessage}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#172033] font-semibold mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Anand Gupta"
                    value={enquiry.name}
                    onChange={(e) =>
                      setEnquiry({ ...enquiry, name: e.target.value })
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                  />
                </div>

                <div>
                  <label className="block text-[#172033] font-semibold mb-1">
                    Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit number"
                      value={enquiry.phone}
                      onChange={(e) =>
                        setEnquiry({
                          ...enquiry,
                          phone: e.target.value.replace(/\D/g, ""),
                        })
                      }
                      className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] font-mono outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[#172033] font-semibold mb-1">
                  Service You Need <span className="text-red-500">*</span>
                </label>
                <select
                  value={enquiry.service}
                  onChange={(e) =>
                    setEnquiry({ ...enquiry, service: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] font-medium outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                >
                  {[
                    "General CSC & Digital Service",
                    "Aadhaar Update / Correction",
                    "PAN Card Application (New & Correction)",
                    "Income Certificate (आय प्रमाण पत्र)",
                    "Caste Certificate (जाति प्रमाण पत्र)",
                    "Domicile Certificate (निवास प्रमाण पत्र)",
                    "Ayushman Bharat Golden Card",
                    "PM Kisan Samman Nidhi",
                    "AePS Cash Withdrawal (Banking)",
                    "Electricity Bill Payment (UPPCL)",
                    "Train / Flight Ticket Booking",
                    "FASTag Services",
                    "Government Job Form",
                  ].map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#172033] font-semibold mb-1">
                  Message / Details <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain what specific service, update, or advice you are looking for..."
                  value={enquiry.message}
                  onChange={(e) =>
                    setEnquiry({ ...enquiry, message: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Submitting to Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Submit Enquiry</span>
                      <span>→</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* ── 9. LOCATION & CONTACT CALLOUT ──────────────────────────── */}
      <section className="py-12 bg-[#0B1E3B] text-white">
        <div className="site-container">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 text-center lg:text-left">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold font-['Poppins']">
                Visit Gupta Enterprises in Pipraich, Gorakhpur
              </h2>
              <p className="text-xs sm:text-sm text-[#90CDF4]">
                Near Saint Xavier's School, Bhatahat Road, Buddh Nagar • Mon –
                Sat: 8:00 AM – 8:00 PM
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="px-5 py-2.5 rounded-xl bg-white text-[#1565C0] font-semibold text-xs sm:text-sm shadow-sm hover:bg-blue-50 transition-all flex items-center gap-1.5"
              >
                <span>📞 Call: +91 87565 57994</span>
              </a>

              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-semibold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5"
              >
                <span>🗺️ Get Directions</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
