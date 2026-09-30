import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"
import { CONTACT, waLink } from "../data/contact"
import { Service, findServiceById } from "../data/services"
import { useEnquiry } from "../context/EnquiryContext"
import { recordChatQuery } from "../lib/supabase"

export interface ChatLink {
  label: string
  to?: string
  href?: string
  variant?: "primary" | "whatsapp" | "call" | "secondary"
}

export interface Message {
  id: string
  role: "bot" | "user"
  text: string
  documents?: string[]
  links?: ChatLink[]
  showQuickOptions?: boolean
  isAi?: boolean
  detectedService?: string | null
  timestamp: string
}

export const QUICK_OPTIONS = [
  "All Services",
  "Aadhaar Services",
  "PAN Card",
  "Certificates",
  "Govt Schemes",
  "Banking & Cash (AePS)",
  "Required Documents",
  "Centre Timings",
  "Contact & Location",
]

const WELCOME_TEXT =
  "Namaste! 🙏 Welcome to Gupta Enterprises (CSC & Digital Seva Kendra, Pipraich).\n\nHow can I help you today? You can select any quick option below or ask about our services, documents, and timings."

function getCurrentTime(): string {
  const now = new Date()
  return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

function findMatchingService(query: string): Service | null {
  const q = query.toLowerCase().trim()

  // Try helper
  const found = findServiceById(q)
  if (found) return found

  // Keyword mappings
  if (q.includes("pan")) return findServiceById("pan-apply") || null
  if (q.includes("aadhaar") || q.includes("aadhar") || q.includes("uidai"))
    return findServiceById("aadhaar-update") || null
  if (q.includes("voter") || q.includes("epic") || q.includes("election"))
    return findServiceById("voter-id") || null
  if (q.includes("passport")) return findServiceById("passport-apply") || null
  if (q.includes("income") || q.includes("aay praman"))
    return findServiceById("income-cert") || null
  if (q.includes("caste") || q.includes("jati praman"))
    return findServiceById("caste-cert") || null
  if (q.includes("domicile") || q.includes("niwas") || q.includes("residence"))
    return findServiceById("domicile-cert") || null
  if (q.includes("ayushman") || q.includes("golden card"))
    return findServiceById("ayushman-bharat") || null
  if (q.includes("kisan") || q.includes("pm kisan"))
    return findServiceById("pm-kisan") || null
  if (q.includes("shram") || q.includes("labour"))
    return findServiceById("eshram-card") || null
  if (
    q.includes("aeps") ||
    q.includes("cash") ||
    q.includes("withdrawal") ||
    q.includes("atm")
  )
    return findServiceById("aeps-banking") || null
  if (q.includes("bill") || q.includes("bijli") || q.includes("electricity"))
    return findServiceById("utility-bills") || null
  if (q.includes("gst")) return findServiceById("gst-services") || null
  if (q.includes("itr") || q.includes("tax"))
    return findServiceById("itr-filing") || null
  if (q.includes("train") || q.includes("irctc"))
    return findServiceById("train-booking") || null
  if (q.includes("flight")) return findServiceById("flight-booking") || null
  if (q.includes("photo") || q.includes("passport size"))
    return findServiceById("passport-photos") || null

  return null
}

/**
 * Local intelligent fallback response engine
 */
export function getBotResponse(rawInput: string): Message {
  const q = rawInput.toLowerCase().trim()
  const time = getCurrentTime()

  // Greetings
  if (
    q === "hi" ||
    q === "hello" ||
    q === "hey" ||
    q === "namaste" ||
    q.startsWith("good morning") ||
    q.startsWith("good afternoon") ||
    q.startsWith("good evening")
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: "bot",
      text: `Namaste! 🙏 Welcome to **Gupta Enterprises**.\n\nI am your digital citizen assistant. Ask me anything about our services, required documents, fee guidance, or visit timings in Pipraich.`,
      showQuickOptions: true,
      timestamp: time,
      links: [
        { label: "💬 WhatsApp Helpline", href: waLink(), variant: "whatsapp" },
        {
          label: "📞 Call +91 87565 57994",
          href: `tel:${CONTACT.phoneTel}`,
          variant: "call",
        },
      ],
    }
  }

  // All Services
  if (
    q.includes("all services") ||
    q === "services" ||
    q.includes("csc") ||
    q.includes("kendra")
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: "bot",
      text: `**Gupta Enterprises** is an authorized Common Service Centre (CSC) offering 50+ digital citizen services in Pipraich, Gorakhpur:\n\n• **🪪 Government Documents**: Aadhaar updates, PAN Card, Voter ID, Passport, Ration Card, Driving Licence\n• **📜 Certificates & Schemes**: Income, Caste, Domicile Praman Patra, Ayushman Bharat, e-Shram, PM Kisan\n• **💼 Financial & Business**: GST, ITR, MSME/Udyam, FSSAI, AePS biometric cash withdrawal\n• **🎓 Education & Online**: UP & NSP Scholarships, NIELIT CCC, Exam forms, DigiLocker, PF withdrawal\n• **🖨️ Travel & Other**: Train & flight tickets, FASTag, electricity bills, photocopies, lamination, passport photos`,
      links: [
        {
          label: "📂 Browse All Services",
          to: "/services",
          variant: "primary",
        },
        {
          label: "📋 View Required Documents",
          to: "/documents",
          variant: "secondary",
        },
        {
          label: "💬 WhatsApp Inquiry",
          href: waLink("All Services"),
          variant: "whatsapp",
        },
      ],
      timestamp: time,
    }
  }

  // Aadhaar Services
  if (q.includes("aadhaar") || q.includes("aadhar") || q.includes("uidai")) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: "bot",
      text: `We provide complete **Aadhaar-related Assistance** at Gupta Enterprises:\n\n• **Demographic Updates**: Name correction, address change, and date of birth correction\n• **Mobile Linking Check**: Verification of active linked mobile\n• **e-Aadhaar & PVC Card**: High-definition durable PVC card printing\n• **Document Revalidation**: Mandated 10-year UIDAI document update`,
      documents: [
        "Original Aadhaar card or 12-digit number",
        "Valid Proof of Address (Bank passbook, Voter ID, or Ration card)",
        "Active mobile phone to receive UIDAI OTP",
      ],
      links: [
        {
          label: "🔐 Aadhaar Service Details",
          to: "/services/aadhaar-update",
          variant: "primary",
        },
        {
          label: "📋 Aadhaar Documents",
          to: "/documents?service=aadhaar-update",
          variant: "secondary",
        },
        {
          label: "💬 WhatsApp Help",
          href: waLink("Aadhaar Services"),
          variant: "whatsapp",
        },
      ],
      timestamp: time,
    }
  }

  // PAN Card
  if (q.includes("pan card") || q === "pan") {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: "bot",
      text: `We offer authorized **PAN Card Services** (NSDL / UTIITSL):\n\n• **New PAN Card**: Form 49A for Indian citizens\n• **PAN Correction & Update**: Name, father's name, DOB, or photo/signature correction\n• **Instant e-PAN & PVC Card Reprint**: Fast delivery to your address`,
      documents: [
        "Aadhaar card (matching full name and date of birth)",
        "2 recent passport-size color photographs",
        "Copy of existing PAN card (if applying for correction)",
        "Registered mobile number for digital e-sign OTP",
      ],
      links: [
        {
          label: "🪪 PAN Card Details",
          to: "/services/pan-apply",
          variant: "primary",
        },
        {
          label: "📋 Check Documents",
          to: "/documents?service=pan-apply",
          variant: "secondary",
        },
        {
          label: "💬 WhatsApp Support",
          href: waLink("PAN Card"),
          variant: "whatsapp",
        },
      ],
      timestamp: time,
    }
  }

  // Certificates
  if (
    q.includes("certificate") ||
    q.includes("praman patra") ||
    q.includes("income") ||
    q.includes("caste") ||
    q.includes("domicile") ||
    q.includes("aay") ||
    q.includes("jati") ||
    q.includes("niwas")
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: "bot",
      text: `We process all **e-District Uttar Pradesh Certificates**:\n\n• **Income Certificate (आय प्रमाण पत्र)**: Required for scholarships, college admissions & subsidies\n• **Caste Certificate (जाति प्रमाण पत्र)**: For SC, ST, OBC category reservations\n• **Domicile Certificate (निवास प्रमाण पत्र)**: Official permanent residence proof\n• **Birth & Death Certificates**: Registration and official copies`,
      documents: [
        "Aadhaar card of the applicant",
        "Ration card or Parivar Register copy (परिवार रजिस्टर नकल)",
        "Self-declaration certificate (available at our centre)",
        "Passport-size photograph",
      ],
      links: [
        {
          label: "📜 View Certificates",
          to: "/services?cat=certificates-schemes",
          variant: "primary",
        },
        {
          label: "📋 Certificate Documents",
          to: "/documents?service=income-cert",
          variant: "secondary",
        },
        {
          label: "💬 WhatsApp Inquiry",
          href: waLink("Certificates"),
          variant: "whatsapp",
        },
      ],
      timestamp: time,
    }
  }

  // Government Schemes
  if (
    q.includes("scheme") ||
    q.includes("yojana") ||
    q.includes("ayushman") ||
    q.includes("kisan") ||
    q.includes("pension")
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: "bot",
      text: `We help citizens access major **Central & State Government Schemes**:\n\n• **Ayushman Bharat (PM-JAY)**: Up to ₹5 Lakh free hospitalization per eligible family\n• **PM Kisan Samman Nidhi**: ₹6,000/year farmer support, e-KYC & land seeding\n• **e-Shram & Labour Card**: Social security cards and worker welfare schemes\n• **UP Pensions**: Old Age (Vridha), Widow (Vidhwa), and Disability pensions`,
      documents: [
        "Aadhaar cards of all family members",
        "Bank passbook with active NPCI/DBT mapping",
        "Ration card or Parivar Register copy",
        "Land Khatauni (for PM Kisan) or Income Certificate (for Pensions)",
      ],
      links: [
        {
          label: "🏛️ Explore Schemes",
          to: "/services?cat=certificates-schemes",
          variant: "primary",
        },
        {
          label: "💬 WhatsApp Guidance",
          href: waLink("Govt Schemes"),
          variant: "whatsapp",
        },
      ],
      timestamp: time,
    }
  }

  // Banking & AEPS
  if (
    q.includes("banking") ||
    q.includes("cash") ||
    q.includes("aeps") ||
    q.includes("atm") ||
    q.includes("money transfer")
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: "bot",
      text: `As an authorized DigiPay CSP partner in Pipraich, we provide branchless banking:\n\n• **AEPS Cash Withdrawal**: Withdraw cash from ANY bank using your Aadhaar fingerprint\n• **Balance Check & Mini Statement**: Instant balance across all Indian banks\n• **Domestic Money Transfer (DMT)**: Instant 24/7 bank transfers across India\n• **Account Opening Assistance**: Fast digital accounts`,
      documents: [
        "Original Aadhaar card",
        "Bank account linked to Aadhaar (NPCI enabled)",
        "Biometric thumb verification at our centre",
      ],
      links: [
        {
          label: "🏧 View Banking Services",
          to: "/services/aeps-banking",
          variant: "primary",
        },
        {
          label: "💬 Chat on WhatsApp",
          href: waLink("Banking Services"),
          variant: "whatsapp",
        },
      ],
      timestamp: time,
    }
  }

  // Timings & Location
  if (
    q.includes("timing") ||
    q.includes("hours") ||
    q.includes("open") ||
    q.includes("close") ||
    q.includes("sunday") ||
    q.includes("address") ||
    q.includes("location") ||
    q.includes("where")
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: "bot",
      text: `📍 **Gupta Enterprises Location & Timings:**\n\n🕒 **Working Hours**: Monday to Saturday from **9:00 AM to 8:00 PM**\n📅 **Sunday**: Closed (Available on call for emergencies)\n\n🏢 **Centre Address**:\nNear Saint Xavier's School, Bhatahat Road, Buddh Nagar, Nagar Panchayat Pipraich, Gorakhpur, Uttar Pradesh - 273152\n\nHelpline: **+91 87565 57994** (Call & WhatsApp)`,
      links: [
        {
          label: "🗺️ Open in Google Maps",
          href: CONTACT.mapsUrl,
          variant: "primary",
        },
        {
          label: "📞 Call +91 87565 57994",
          href: `tel:${CONTACT.phoneTel}`,
          variant: "call",
        },
        { label: "💬 WhatsApp Support", href: waLink(), variant: "whatsapp" },
      ],
      timestamp: time,
    }
  }

  // Dynamic Service Match from catalogue
  const matchedService = findMatchingService(q)
  if (matchedService) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: "bot",
      text: `Yes! We provide complete assistance for **${matchedService.name}** at Gupta Enterprises.\n\n${matchedService.shortDescription}\n\nCategory: **${matchedService.category}**`,
      documents: matchedService.documents,
      links: [
        {
          label: "📄 View Service Details",
          to: `/services/${matchedService.id}`,
          variant: "primary",
        },
        {
          label: "📋 View Required Documents",
          to: `/documents?service=${matchedService.id}`,
          variant: "secondary",
        },
        {
          label: "💬 WhatsApp Inquiry",
          href: waLink(matchedService.name),
          variant: "whatsapp",
        },
        {
          label: "📞 Call Helpline",
          href: `tel:${CONTACT.phoneTel}`,
          variant: "call",
        },
      ],
      timestamp: time,
    }
  }

  // Natural fallback
  return {
    id: Math.random().toString(36).substring(2, 9),
    role: "bot",
    text: `I'm happy to help! You can ask me about any service offered at **Gupta Enterprises** (Aadhaar, PAN card, Certificates, Banking, PM Schemes, Bill Payments, Passport, FASTag).\n\nFeel free to choose a quick option or chat with us directly on WhatsApp:`,
    showQuickOptions: true,
    links: [
      { label: "💬 Chat on WhatsApp", href: waLink(), variant: "whatsapp" },
      {
        label: "📞 Call +91 87565 57994",
        href: `tel:${CONTACT.phoneTel}`,
        variant: "call",
      },
      {
        label: "📂 Browse All Services",
        to: "/services",
        variant: "secondary",
      },
    ],
    timestamp: time,
  }
}

function detectServiceIntent(text: string): string | null {
  const t = text.toLowerCase()
  if (t.includes("pan")) return "PAN Card Assistance"
  if (t.includes("aadhaar") || t.includes("aadhar"))
    return "Aadhaar Related Services"
  if (t.includes("income") || t.includes("aay praman"))
    return "Income Certificate (आय प्रमाण पत्र)"
  if (t.includes("caste") || t.includes("jati praman"))
    return "Caste Certificate (जाति प्रमाण पत्र)"
  if (t.includes("domicile") || t.includes("niwas"))
    return "Domicile Certificate (निवास प्रमाण पत्र)"
  if (t.includes("ayushman") || t.includes("golden card"))
    return "Ayushman Bharat Golden Card"
  if (t.includes("kisan") || t.includes("pm kisan"))
    return "PM Kisan Samman Nidhi"
  if (t.includes("shram") || t.includes("labour"))
    return "e-Shram Card Registration"
  if (t.includes("aeps") || t.includes("cash") || t.includes("banking"))
    return "AePS Biometric Cash Withdrawal"
  if (t.includes("bill") || t.includes("bijli") || t.includes("electricity"))
    return "Electricity Bill Payment (UPPCL)"
  if (t.includes("passport")) return "Passport Application Assistance"
  if (t.includes("voter")) return "Voter ID Card"
  if (t.includes("ration")) return "Ration Card Assistance"
  if (t.includes("train")) return "Train Ticket Booking"
  if (t.includes("flight")) return "Flight Ticket Booking"
  if (t.includes("fastag")) return "FASTag Services"
  return null
}

function getChatSessionId(): string {
  try {
    let sid = sessionStorage.getItem("gupta_chat_session_id")
    if (!sid) {
      sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
      sessionStorage.setItem("gupta_chat_session_id", sid)
    }
    return sid
  } catch {
    return `sess_${Date.now()}`
  }
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const { openEnquiryModal } = useEnquiry()
  const sessionId = useRef(getChatSessionId()).current

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "bot",
      text: WELCOME_TEXT,
      showQuickOptions: true,
      timestamp: getCurrentTime(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isOpen, isTyping])

  async function handleSend(textToSend: string) {
    if (!textToSend.trim() || isTyping) return

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      role: "user",
      text: textToSend.trim(),
      timestamp: getCurrentTime(),
    }

    const newMessages = [...messages, userMessage]
    setMessages(newMessages)
    setInput("")
    setIsTyping(true)

    let finalBotText = ""
    let finalLinks: ChatLink[] | undefined = undefined
    let finalDocs: string[] | undefined = undefined
    let isFromAi = false

    try {
      // Prepare history for server-side Gemini endpoint
      const history = newMessages
        .filter((m) => m.id !== "welcome")
        .slice(-10)
        .map((m) => ({
          role: m.role === "user" ? "user" as const : "model" as const,
          text: m.text,
        }))

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend.trim(),
          history,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.text && data.text.trim()) {
          finalBotText = data.text
          finalLinks = data.links
          finalDocs = data.documents
          isFromAi = true
        }
      }
    } catch {
      // Silently fall back to local rule-based engine
    }

    // Fallback if Gemini endpoint did not return text
    if (!finalBotText) {
      const botResponse = getBotResponse(textToSend)
      finalBotText = botResponse.text
      finalLinks = botResponse.links
      finalDocs = botResponse.documents
    }

    const detectedService = detectServiceIntent(textToSend + " " + finalBotText)

    const botMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      role: "bot",
      text: finalBotText,
      links: finalLinks,
      documents: finalDocs,
      isAi: isFromAi,
      detectedService,
      timestamp: getCurrentTime(),
    }

    setMessages((prev) => [...prev, botMessage])
    setIsTyping(false)

    // Save chat query in database / local fallback
    recordChatQuery({
      sessionId,
      userMessage: textToSend.trim(),
      aiResponse: finalBotText,
      detectedService,
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    handleSend(input)
  }

  function handleResetChat() {
    setMessages([
      {
        id: "welcome-" + Date.now(),
        role: "bot",
        text: WELCOME_TEXT,
        showQuickOptions: true,
        timestamp: getCurrentTime(),
      },
    ])
  }

  function formatText(text: string) {
    return text.split("\n").map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      return (
        <span key={i} className="block leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
        </span>
      )
    })
  }

  return (
    <>
      {/* ── CHAT WINDOW ───────────────────────────────────────────── */}
      {isOpen && (
        <div
          className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-24 w-auto sm:w-[410px] h-[540px] max-h-[calc(100vh-100px)] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-[1100] animate-in fade-in zoom-in-95 duration-150"
          role="dialog"
          aria-label="Gupta Enterprises Citizen Assistant"
        >
          {/* Header */}
          <div className="bg-[#1565C0] text-white px-4 py-3.5 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center text-lg shadow-inner">
                🤖
              </div>
              <div>
                <div className="font-bold text-sm font-['Poppins'] tracking-tight flex items-center gap-1.5">
                  Gupta Enterprises
                  <span className="text-[10px] font-semibold px-1.5 py-0.2 rounded bg-[#0D47A1] text-white">
                    CSC
                  </span>
                </div>
                <div className="text-blue-100 text-[11px] font-medium flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                  <span>Citizen Assistant (AI Enabled)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              {/* WhatsApp direct shortcut */}
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                title="Direct WhatsApp Helpline (+91 8756557994)"
                className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center text-[#25D366] transition-colors"
                aria-label="Direct WhatsApp"
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              {/* Reset button */}
              <button
                type="button"
                onClick={handleResetChat}
                title="Restart conversation"
                className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center hover:text-white transition-colors cursor-pointer"
                aria-label="Restart chat"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
              </button>

              {/* Close button */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center hover:text-white transition-colors cursor-pointer"
                aria-label="Close assistant"
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
          </div>

          {/* Quick Notice Bar */}
          <div className="bg-[#EAF4FF] border-b border-slate-200 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-[#1565C0]">
            <div className="flex items-center gap-1.5 font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#25D366]" />
              <span>Pipraich Helpline:</span>
              <span className="font-mono text-[#0D47A1]">+91 87565 57994</span>
            </div>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-[#1565C0] hover:underline"
            >
              WhatsApp →
            </a>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#F5F9FF]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${
                  msg.role === "user" ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs shadow-xs ${
                    msg.role === "user"
                      ? "bg-[#1565C0] text-white rounded-br-xs"
                      : "bg-white text-[#172033] border border-slate-200 rounded-bl-xs"
                  }`}
                >
                  {/* AI badge */}
                  {msg.isAi && (
                    <div className="flex items-center gap-1 mb-1 text-[10px] font-bold text-[#1565C0]">
                      <span>✨ Gemini AI Assistant</span>
                    </div>
                  )}

                  {/* Message Text */}
                  <div className="space-y-1">{formatText(msg.text)}</div>

                  {/* Document Checklist */}
                  {msg.documents && msg.documents.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-bold text-[#0D47A1] mb-1 flex items-center gap-1.5">
                        <span>📋</span> Required Documents:
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-600">
                        {msg.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold">
                              ✓
                            </span>
                            <span>{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Links */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.links.map((link, j) => {
                        const styleClass =
                          link.variant === "whatsapp"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 font-bold"
                            : link.variant === "call"
                              ? "bg-[#EAF4FF] text-[#1565C0] border-[#BFDBFE] hover:bg-[#DBEAFE] font-bold"
                              : link.variant === "secondary"
                                ? "bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 font-medium"
                                : "bg-[#1565C0] text-white hover:bg-[#0D47A1] font-bold"

                        return link.to ? (
                          <Link
                            key={j}
                            to={link.to}
                            onClick={() => setIsOpen(false)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all inline-flex items-center gap-1 ${styleClass}`}
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            key={j}
                            href={link.href}
                            target={
                              link.href?.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel="noopener noreferrer"
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-all inline-flex items-center gap-1 ${styleClass}`}
                          >
                            {link.label}
                          </a>
                        )
                      })}
                    </div>
                  )}

                  {/* Interactive Contact Prompt */}
                  {msg.detectedService && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 bg-[#EAF4FF] -mx-1 px-3 py-2 rounded-xl text-xs space-y-1.5">
                      <div className="text-[11px] font-bold text-[#0D47A1] flex items-center gap-1.5">
                        <span>🤝</span> Would you like Gupta Enterprises to
                        contact you?
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            openEnquiryModal(msg.detectedService || undefined)
                            setIsOpen(false)
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#1565C0] text-white text-[11px] font-bold hover:bg-[#0D47A1] transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>📝</span> Submit Enquiry
                        </button>
                        <a
                          href={waLink(msg.detectedService)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-[#25D366] text-white text-[11px] font-bold hover:bg-[#1EBE5D] transition-colors flex items-center gap-1"
                        >
                          <span>💬</span> WhatsApp Us
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                <span className="text-[10px] text-slate-400 mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Quick Option Buttons */}
                {msg.showQuickOptions && (
                  <div className="mt-2 w-full">
                    <div className="text-[11px] font-bold text-slate-600 mb-1.5 flex items-center gap-1">
                      <span>⚡</span> Quick Questions:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleSend(opt)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#1565C0] text-slate-700 hover:text-[#1565C0] hover:bg-[#EAF4FF] font-medium transition-all shadow-2xs text-left cursor-pointer"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 text-xs px-3.5 py-2 rounded-2xl w-fit shadow-xs">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1565C0] animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px] font-semibold">
                  Assistant is typing...
                </span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Bar */}
          <div className="px-3 py-1.5 bg-[#F5F9FF] border-t border-slate-200 flex items-center justify-between text-[11px] font-medium text-slate-600">
            <button
              type="button"
              onClick={() => handleSend("All Services")}
              className="hover:text-[#1565C0] transition-colors cursor-pointer"
            >
              📂 Services
            </button>
            <button
              type="button"
              onClick={() => handleSend("Required Documents")}
              className="hover:text-[#1565C0] transition-colors cursor-pointer"
            >
              📋 Documents
            </button>
            <button
              type="button"
              onClick={() => handleSend("Centre Timings")}
              className="hover:text-[#1565C0] transition-colors cursor-pointer"
            >
              🕒 Hours
            </button>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#25D366] hover:underline font-semibold"
            >
              💬 WhatsApp
            </a>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder={
                isTyping
                  ? "Assistant is typing..."
                  : "Ask about services, documents, timings..."
              }
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-[#172033] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] transition-all disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-[#1565C0] text-white flex items-center justify-center hover:bg-[#0D47A1] disabled:opacity-40 transition-all shadow-xs shrink-0 cursor-pointer"
              aria-label="Send message"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* ── FLOATING LAUNCHER BUTTON ──────────────────────────────── */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 w-13 h-13 sm:w-14 sm:h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-[1000] cursor-pointer ${
          isOpen
            ? "bg-[#0D47A1] text-white hover:bg-slate-900 shadow-slate-400/50"
            : "bg-[#1565C0] text-white hover:bg-[#0D47A1] shadow-[#1565C0]/30"
        }`}
        aria-label={
          isOpen ? "Close citizen assistant" : "Open citizen assistant"
        }
        title="Chat with Gupta Enterprises Citizen Assistant"
      >
        {isOpen ? (
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.5}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <div className="relative flex items-center justify-center">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          </div>
        )}

        {/* Pulse beacon when closed */}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D47A1] opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#0D47A1] border-2 border-white" />
          </span>
        )}
      </button>
    </>
  )
}
