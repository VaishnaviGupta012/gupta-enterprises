import { useState } from "react"
import { Link } from "react-router-dom"
import { CONTACT, waLink } from "../data/contact"

const FAQS_DATA = [
  {
    category: "General & Timings",
    items: [
      {
        q: "What are the working hours of Gupta Enterprises in Pipraich?",
        a: "We are open Monday to Saturday from 8:00 AM to 8:00 PM. We are closed on Sundays (available on call for urgent emergency requirements). Please call us ahead if visiting on a public holiday.",
      },
      {
        q: "Where exactly is your centre located in Pipraich?",
        a: "Our centre is conveniently located Near Saint Xavier's School, on Bhatahat Road, Buddh Nagar, Nagar Panchayat Pipraich, Gorakhpur, Uttar Pradesh - 273152. You can find us on Google Maps by searching for Gupta Enterprises Pipraich.",
      },
      {
        q: "Can I contact Gupta Enterprises on WhatsApp before coming?",
        a: "Yes, absolutely! WhatsApp (+91 87565 57994) is one of the easiest ways to reach us. You can confirm required documents, ask about service availability, or request a checklist before visiting.",
      },
    ],
  },
  {
    category: "Documents & Certificates",
    items: [
      {
        q: "What standard documents should I bring when visiting the centre?",
        a: "We recommend carrying your original Aadhaar card, your active mobile phone (for UIDAI or portal OTPs), 2 passport-size photographs, bank passbook, and any previous document you wish to update (like old PAN card or electricity bill).",
      },
      {
        q: "How long does an Income or Caste Certificate take to be issued?",
        a: "Applications are submitted through the official Uttar Pradesh e-District portal and verified by the local Lekhpal / Tehsil administration. Digitally signed barcode certificates are typically issued within 7 to 12 working days.",
      },
      {
        q: "Can you help update my Aadhaar address or name?",
        a: "Yes, we provide demographic update assistance for Aadhaar cards, including name spelling correction, address change, and mandated 10-year document revalidations using valid proof documents.",
      },
    ],
  },
  {
    category: "Fees & Receipts",
    items: [
      {
        q: "How are service charges determined at Gupta Enterprises?",
        a: "Our service charges are transparent and nominal. Government portal fees (such as for PAN card, Passport, or DL) are paid directly to the respective department portal, plus our nominal assistance fee for form filing, scanning, and tracking.",
      },
      {
        q: "Do I get an official receipt or acknowledgement slip?",
        a: "Yes! For every online application submitted and every bill paid through our centre, you receive an official printed acknowledgement slip containing your application reference number (URN / ACK) or BBPS transaction ID.",
      },
    ],
  },
  {
    category: "Banking & Safety",
    items: [
      {
        q: "Is it safe to withdraw cash using Aadhaar (AePS) at your centre?",
        a: "Yes, completely safe. AePS (Aadhaar-enabled Payment System) is regulated by the Reserve Bank of India (RBI) and National Payments Corporation of India (NPCI). Transactions require live biometric fingerprint authentication, and instant official receipts are generated for every withdrawal.",
      },
      {
        q: "Do you keep copies of my personal passwords or bank PINs?",
        a: "No, never. We strictly respect citizen confidentiality. We never ask for your ATM PINs, internet banking passwords, or personal credentials. You only authenticate via official department OTPs sent directly to your own mobile.",
      },
    ],
  },
]

export default function FAQ() {
  const [search, setSearch] = useState("")
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    "0-0": true,
  })

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  // Filtered FAQs
  const filteredCategories = FAQS_DATA.map((cat) => {
    const matchingItems = cat.items.filter((item) => {
      if (!search.trim()) return true
      const term = search.toLowerCase().trim()
      return (
        item.q.toLowerCase().includes(term) ||
        item.a.toLowerCase().includes(term)
      )
    })
    return { ...cat, items: matchingItems }
  }).filter((cat) => cat.items.length > 0)

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-24 md:pb-16 w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-[#0D47A1] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#0a3880]">
        <div className="site-container max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Gupta Enterprises</span>
            <span>•</span>
            <span>Citizen Help Centre</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] tracking-tight">
            Frequently Asked Questions (FAQ)
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
            Find quick answers to common citizen inquiries regarding documents,
            portal procedures, timings, and fees.
          </p>
        </div>
      </div>

      <div className="site-container py-10 max-w-3xl space-y-8">
        {/* Search Bar */}
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
            🔍
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search questions (e.g. documents, charges, timings, cash withdrawal)..."
            className="w-full pl-12 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-[#172033] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] shadow-xs transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700"
            >
              ✕
            </button>
          )}
        </div>

        {/* FAQs Grouped by Category */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-6 shadow-xs">
            <p className="text-base font-bold text-[#0D47A1]">
              No matching questions found.
            </p>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              Feel free to ask your question directly to our team on WhatsApp or
              via helpline.
            </p>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] text-white font-semibold text-xs inline-flex items-center gap-1.5"
            >
              <span>💬 Ask on WhatsApp</span>
            </a>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredCategories.map((cat, catIdx) => (
              <div key={catIdx} className="space-y-3">
                <h3 className="font-semibold text-xs text-[#1565C0] uppercase tracking-wider font-['Poppins'] pl-1">
                  {cat.category}
                </h3>

                <div className="space-y-3">
                  {cat.items.map((item, itemIdx) => {
                    const key = `${catIdx}-${itemIdx}`
                    const isOpen = Boolean(openItems[key])

                    return (
                      <div
                        key={itemIdx}
                        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs transition-all"
                      >
                        <button
                          type="button"
                          onClick={() => toggleItem(key)}
                          className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-[#F5F9FF] transition-colors cursor-pointer"
                          aria-expanded={isOpen}
                        >
                          <span className="font-semibold text-sm text-[#0D47A1] font-['Poppins'] pr-4">
                            {item.q}
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
                          <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100">
                            {item.a}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Still have questions card */}
        <div className="bg-[#EAF4FF] rounded-3xl p-6 sm:p-8 border border-[#BFDBFE] text-center space-y-3">
          <h3 className="font-bold text-base sm:text-lg font-['Poppins'] text-[#0D47A1]">
            Still Have a Question?
          </h3>
          <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
            Our staff at Pipraich is happy to help you with personalized
            document checklists, form queries, and appointment guidance.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs sm:text-sm shadow-xs transition-colors flex items-center gap-1.5"
            >
              <span>💬 Message on WhatsApp</span>
            </a>
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="px-5 py-2.5 rounded-xl border border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
            >
              <span>📞 Call Helpline</span>
            </a>
            <Link
              to="/contact"
              className="px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-[#172033] hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-colors"
            >
              Contact Us Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
