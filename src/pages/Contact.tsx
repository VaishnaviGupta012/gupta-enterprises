import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"
import { CONTACT, waLink } from "../data/contact"
import { services } from "../data/services"
import { submitEnquiry } from "../lib/supabase"

export default function Contact() {
  const [params] = useSearchParams()
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [service, setService] = useState(
    params.get("service") || "General Contact Enquiry",
  )
  const [message, setMessage] = useState("")

  const [loading, setLoading] = useState(false)
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    const s = params.get("service")
    if (s) setService(s)
  }, [params])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    const cleanPhone = phone.replace(/\D/g, "")
    if (cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      setErrorMsg("Please enter a valid 10-digit Indian mobile number.")
      return
    }

    setLoading(true)
    try {
      const res = await submitEnquiry({
        name: name.trim(),
        phone: cleanPhone,
        service,
        message: message.trim(),
      })

      if (res.success) {
        setReferenceId(res.referenceId)
      } else {
        setErrorMsg(res.error || "Failed to submit enquiry.")
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setReferenceId(null)
    setName("")
    setPhone("")
    setMessage("")
  }

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-24 md:pb-16 w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-[#0D47A1] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#0a3880]">
        <div className="site-container max-w-4xl text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Gupta Enterprises</span>
            <span>•</span>
            <span>Contact &amp; Location</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] tracking-tight">
            Contact &amp; Visit Our Centre
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
            We are located in Buddh Nagar, Pipraich, Gorakhpur. Walk in, call
            our helpline, or submit an enquiry online.
          </p>
        </div>
      </div>

      <div className="site-container py-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ── Left Column: Contact Cards & Centre Details (Col 1-5) ── */}
          <div className="lg:col-span-5 space-y-5">
            {/* Centre Info Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#1565C0] text-white flex items-center justify-center font-bold text-xl font-['Poppins'] shadow-xs">
                  GE
                </div>
                <div>
                  <h2 className="font-bold text-lg font-['Poppins'] text-[#0D47A1]">
                    Gupta Enterprises
                  </h2>
                  <p className="text-xs text-[#1565C0] font-semibold">
                    Authorized Common Service Centre
                  </p>
                </div>
              </div>

              <div className="space-y-3.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
                {/* Physical Address */}
                <div className="flex items-start gap-3">
                  <span className="text-base shrink-0">📍</span>
                  <div>
                    <strong className="text-slate-800 block text-xs mb-0.5">
                      Physical Address:
                    </strong>
                    <span className="leading-snug block">
                      {CONTACT.addressLine1}
                      <br />
                      {CONTACT.addressLine2}
                      <br />
                      {CONTACT.addressLine3}
                    </span>
                    <a
                      href={CONTACT.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#1565C0] font-semibold hover:underline mt-1 inline-flex items-center gap-1"
                    >
                      Open in Google Maps →
                    </a>
                  </div>
                </div>

                {/* Telephone */}
                <div className="flex items-start gap-3">
                  <span className="text-base shrink-0">📞</span>
                  <div>
                    <strong className="text-slate-800 block text-xs mb-0.5">
                      Helpline Phone:
                    </strong>
                    <a
                      href={`tel:${CONTACT.phoneTel}`}
                      className="text-[#1565C0] font-semibold hover:underline text-sm"
                    >
                      {CONTACT.phone}
                    </a>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Direct call during centre hours
                    </span>
                  </div>
                </div>

                {/* WhatsApp */}
                <div className="flex items-start gap-3">
                  <span className="text-base shrink-0">💬</span>
                  <div>
                    <strong className="text-slate-800 block text-xs mb-0.5">
                      WhatsApp Support:
                    </strong>
                    <a
                      href={waLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#25D366] font-semibold hover:underline"
                    >
                      +91 87565 57994 (Chat Available)
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-3">
                  <span className="text-base shrink-0">✉️</span>
                  <div>
                    <strong className="text-slate-800 block text-xs mb-0.5">
                      Email Address:
                    </strong>
                    <a
                      href={`mailto:${CONTACT.email}`}
                      className="text-[#1565C0] hover:underline"
                    >
                      {CONTACT.email}
                    </a>
                  </div>
                </div>

                {/* Working Hours */}
                <div className="flex items-start gap-3 pt-2 border-t border-slate-100">
                  <span className="text-base shrink-0">🕒</span>
                  <div>
                    <strong className="text-slate-800 block text-xs mb-0.5">
                      Working Hours:
                    </strong>
                    <span className="block font-medium text-slate-800">
                      {CONTACT.hours}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      {CONTACT.dayOff}
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct Buttons */}
              <div className="pt-2 grid grid-cols-2 gap-2.5">
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="py-2.5 px-3 rounded-xl border border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white font-semibold text-xs text-center transition-all flex items-center justify-center gap-1.5"
                >
                  <span>📞 Call Now</span>
                </a>

                <a
                  href={waLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2.5 px-3 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs text-center transition-all flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>💬 WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* ── Right Column: Interactive Enquiry Form (Col 6-12) ───── */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
              <div className="mb-6">
                <div className="section-badge">Send a Message</div>
                <h2 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-[#0D47A1]">
                  Online Service Inquiry Form
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Fill in your requirements and our team will get in touch with
                  you.
                </p>
              </div>

              {referenceId ? (
                /* Success Screen */
                <div className="text-center py-6 space-y-4">
                  <div className="w-14 h-14 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                    ✓
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Enquiry Submitted
                    </span>
                    <h3 className="text-lg font-bold text-[#0D47A1] font-['Poppins'] mt-2">
                      Thank You! We Have Logged Your Request.
                    </h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
                      Your enquiry is stored in our database. Please save your
                      reference ID:
                    </p>
                  </div>

                  <div className="inline-block bg-[#F5F9FF] border border-[#BFDBFE] rounded-2xl px-6 py-3">
                    <span className="text-[11px] text-slate-500 block">
                      Reference Number:
                    </span>
                    <span className="text-xl font-mono font-bold text-[#1565C0]">
                      {referenceId}
                    </span>
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                    <a
                      href={waLink(
                        `Hello Gupta Enterprises, my name is ${name} (Ref: ${referenceId}). I submitted an inquiry regarding ${service}. Please check.`,
                        true,
                      )}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-semibold text-xs shadow-xs flex items-center justify-center gap-2"
                    >
                      <span>💬 Chat on WhatsApp with Ref</span>
                    </a>
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 font-semibold text-xs hover:bg-slate-50 transition-colors"
                    >
                      Send Another Message
                    </button>
                  </div>
                </div>
              ) : (
                /* Contact Form */
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 font-medium">
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[#172033] font-semibold mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                      />
                    </div>

                    <div>
                      <label className="block text-[#172033] font-semibold mb-1">
                        Mobile Phone Number{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                          +91
                        </span>
                        <input
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={(e) =>
                            setPhone(e.target.value.replace(/\D/g, ""))
                          }
                          className="w-full pl-11 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] font-mono outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#172033] font-semibold mb-1">
                      Service / Subject <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={service}
                      onChange={(e) => setService(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] font-medium outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                    >
                      <option value="General Contact Enquiry">
                        General Contact Enquiry
                      </option>
                      {services.map((s) => (
                        <option key={s.id} value={s.name}>
                          {s.name} ({s.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#172033] font-semibold mb-1">
                      Your Message / Questions{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Please let us know how we can assist you..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] resize-none"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 px-4 rounded-xl bg-[#1565C0] hover:bg-[#0D47A1] text-white font-semibold text-xs sm:text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          <span>Submitting...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Message</span>
                          <span>→</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
