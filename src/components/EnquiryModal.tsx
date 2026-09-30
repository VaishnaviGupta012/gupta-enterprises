import { useState, useEffect } from "react"
import { services } from "../data/services"
import { waLink } from "../data/contact"
import { submitEnquiry } from "../lib/supabase"

interface EnquiryModalProps {
  isOpen: boolean
  onClose: () => void
  preselectedService?: string
}

export default function EnquiryModal({
  isOpen,
  onClose,
  preselectedService = "",
}: EnquiryModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [sameAsPhone, setSameAsPhone] = useState(true)
  const [whatsapp, setWhatsapp] = useState("")
  const [email, setEmail] = useState("")
  const [service, setService] = useState(
    preselectedService || "General CSC & Digital Enquiry",
  )
  const [message, setMessage] = useState("")

  const [loading, setLoading] = useState(false)
  const [referenceId, setReferenceId] = useState<string | null>(null)
  const [submittedService, setSubmittedService] = useState("")
  const [errorMsg, setErrorMsg] = useState("")

  // Update selected service when prop changes
  useEffect(() => {
    if (preselectedService) {
      const matched = services.find(
        (s) =>
          s.id === preselectedService ||
          s.name.toLowerCase().includes(preselectedService.toLowerCase()),
      )
      if (matched) {
        setService(matched.name)
      } else {
        setService(preselectedService)
      }
    }
  }, [preselectedService, isOpen])

  // Sync WhatsApp number if checkbox is checked
  useEffect(() => {
    if (sameAsPhone) {
      setWhatsapp(phone)
    }
  }, [phone, sameAsPhone])

  // Reset status on open
  useEffect(() => {
    if (isOpen) {
      setReferenceId(null)
      setErrorMsg("")
    }
  }, [isOpen])

  if (!isOpen) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg("")

    // Input Validation
    if (!name.trim()) {
      setErrorMsg("Please enter your full name.")
      return
    }

    const cleanPhone = phone.replace(/\D/g, "")
    if (!cleanPhone || cleanPhone.length !== 10 || !/^[6-9]/.test(cleanPhone)) {
      setErrorMsg(
        "Please enter a valid 10-digit Indian mobile number (starting with 6, 7, 8, or 9).",
      )
      return
    }

    if (!sameAsPhone && whatsapp) {
      const cleanWa = whatsapp.replace(/\D/g, "")
      if (cleanWa.length !== 10) {
        setErrorMsg("Please enter a valid 10-digit WhatsApp number.")
        return
      }
    }

    if (!service.trim()) {
      setErrorMsg("Please select a service.")
      return
    }

    if (!message.trim()) {
      setErrorMsg("Please describe what assistance you require.")
      return
    }

    setLoading(true)

    try {
      const res = await submitEnquiry({
        name: name.trim(),
        phone: cleanPhone,
        whatsapp_number: sameAsPhone ? cleanPhone : whatsapp.replace(/\D/g, ""),
        email: email.trim(),
        service,
        message: message.trim(),
      })

      if (res.success) {
        setReferenceId(res.referenceId)
        setSubmittedService(service)
        setName("")
        setPhone("")
        setEmail("")
        setMessage("")
      } else {
        setErrorMsg(res.error || "Failed to submit enquiry. Please try again.")
      }
    } catch (err: any) {
      setErrorMsg(
        err?.message ||
          "Something went wrong while submitting. Please try again.",
      )
    } finally {
      setLoading(false)
    }
  }

  const whatsappContinueUrl = referenceId
    ? waLink(
        `Hello Gupta Enterprises, I submitted an online enquiry [Ref: ${referenceId}] regarding ${submittedService}. Please guide me on the next steps.`,
        true,
      )
    : waLink()

  return (
    <div
      className="fixed inset-0 z-[1200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="enquiry-modal-title"
    >
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="bg-[#1565C0] text-white px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/15 flex items-center justify-center text-lg font-['Poppins'] shadow-sm">
              📝
            </div>
            <div>
              <h2
                id="enquiry-modal-title"
                className="font-bold text-base font-['Poppins'] leading-tight"
              >
                Submit Service Enquiry
              </h2>
              <p className="text-blue-100 text-xs font-medium">
                Gupta Enterprises • Citizen Helpdesk
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-xl hover:bg-white/15 text-white/80 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {referenceId ? (
            /* Success confirmation screen */
            <div className="text-center py-4 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center mx-auto text-3xl font-bold shadow-xs">
                ✓
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-wider font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Enquiry Recorded
                </span>
                <h3 className="text-xl font-bold text-[#0D47A1] mt-2.5 font-['Poppins']">
                  Thank You, We Received Your Request!
                </h3>
                <p className="text-slate-500 text-xs mt-1 max-w-sm mx-auto leading-relaxed">
                  Your enquiry has been logged into our system. Our team at
                  Pipraich will review your request promptly.
                </p>
              </div>

              {/* Reference ID Card */}
              <div className="bg-[#F5F9FF] border border-[#BFDBFE] rounded-2xl p-4 max-w-sm mx-auto text-left shadow-2xs">
                <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">
                  Tracking Reference ID:
                </div>
                <div className="text-xl font-mono font-bold text-[#1565C0] mt-0.5 tracking-wider">
                  {referenceId}
                </div>
                <div className="text-xs text-slate-700 mt-2 pt-2 border-t border-slate-200">
                  <span className="font-semibold text-slate-500">Service:</span>{" "}
                  {submittedService}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 italic">
                  Keep this Reference ID handy when calling or visiting our
                  centre.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 space-y-2.5 max-w-sm mx-auto">
                <a
                  href={whatsappContinueUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-[#25D366] text-white font-bold text-xs sm:text-sm rounded-xl hover:bg-[#1EBE5D] transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Chat on WhatsApp with Reference</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="w-full py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Done &amp; Close
                </button>
              </div>
            </div>
          ) : (
            /* Enquiry Form */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-3.5 py-2.5 rounded-xl text-xs flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-[#172033] font-semibold mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Kumar"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] text-xs transition-all"
                />
              </div>

              {/* Mobile Phone & WhatsApp */}
              <div className="space-y-2">
                <div>
                  <label className="block text-[#172033] font-semibold mb-1">
                    Mobile Phone Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
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
                      className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] text-xs font-mono transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="modal-same-phone"
                    checked={sameAsPhone}
                    onChange={(e) => setSameAsPhone(e.target.checked)}
                    className="rounded text-[#1565C0] focus:ring-[#1565C0] h-3.5 w-3.5 accent-[#1565C0]"
                  />
                  <label
                    htmlFor="modal-same-phone"
                    className="text-slate-600 text-[11px] select-none cursor-pointer"
                  >
                    WhatsApp number is same as mobile number
                  </label>
                </div>

                {!sameAsPhone && (
                  <div>
                    <label className="block text-[#172033] font-semibold mb-1">
                      WhatsApp Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="10-digit WhatsApp number"
                        value={whatsapp}
                        onChange={(e) =>
                          setWhatsapp(e.target.value.replace(/\D/g, ""))
                        }
                        className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] text-xs font-mono transition-all"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label className="block text-[#172033] font-semibold mb-1">
                  Email Address{" "}
                  <span className="text-slate-400 font-normal">(Optional)</span>
                </label>
                <input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] text-xs transition-all"
                />
              </div>

              {/* Service Selection */}
              <div>
                <label className="block text-[#172033] font-semibold mb-1">
                  Select Service Required{" "}
                  <span className="text-red-500">*</span>
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] text-xs transition-all font-medium"
                >
                  <option value="General CSC & Digital Enquiry">
                    General CSC &amp; Digital Enquiry
                  </option>
                  {services.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="block text-[#172033] font-semibold mb-1">
                  Message / Requirement Details{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe your requirement, correction needed, or any questions..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-[#172033] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] text-xs transition-all resize-none"
                />
              </div>

              {/* Safe Citizen Notice */}
              <div className="bg-[#EAF4FF] border border-[#BFDBFE] rounded-xl p-3 text-[11px] text-[#1565C0] flex items-start gap-2">
                <span className="text-sm shrink-0">🛡️</span>
                <span>
                  <strong>Security Note:</strong> Do not enter passwords, OTPs,
                  or bank account PINs. Gupta Enterprises will verify original
                  documents in person.
                </span>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-[#1565C0] hover:bg-[#0D47A1] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting Enquiry...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Enquiry</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
