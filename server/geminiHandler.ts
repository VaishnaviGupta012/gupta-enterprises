import fs from "node:fs"

import path from "node:path"

import { IncomingMessage, ServerResponse } from "node:http"

import { GoogleGenAI } from "@google/genai"

// ── KNOWLEDGE BASE & SYSTEM INSTRUCTION ────────────────────────────

export const SYSTEM_PROMPT = `
You are the official AI Citizen Assistant for "Gupta Enterprises", an authorized Common Service Centre (CSC) and Digital Seva Kendra located in Pipraich, Gorakhpur, Uttar Pradesh, India.

Your primary mission is to assist citizens with helpful, polite, and accurate information about CSC services, government welfare schemes, identity documents, certificates, banking, utility bills, and centre assistance.

=== BUSINESS INFORMATION ===
- Business Name: Gupta Enterprises
- Centre Type: Authorized Common Service Centre (CSC) & Digital Seva Kendra
- Contact Phone / Helpline: +91 87565 57994 (Direct call: tel:+918756557994)
- WhatsApp Support: +91 87565 57994 (Chat link: https://wa.me/918756557994)
- Email: cscpipraichgkp@gmail.com
- Address: Near Saint Xavier's School, Bhatahat Road, Buddh Nagar, Nagar Panchayat Pipraich, Gorakhpur, Uttar Pradesh - 273152
- Working Hours: Monday to Saturday from 9:00 AM to 8:00 PM. Closed on Sundays (emergency appointments available on call).
- Google Maps Location: Near Saint Xavier's School, Bhatahat Road, Buddh Nagar, Pipraich, Gorakhpur, UP.

=== CORE SERVICES OFFERED AT GUPTA ENTERPRISES ===
1. ID & Official Documents:
   - Aadhaar Update / Correction (Demographic updates: address change, name correction, DOB correction, mobile linking assistance, e-Aadhaar download, PVC card ordering, 10-year document revalidation).
   - PAN Card (New PAN Form 49A, PAN Correction/CSF form, linking Aadhaar with PAN, e-PAN instant download, physical PVC card reprint).
   - Voter ID / EPIC (New voter registration Form 6, correction Form 8, digital EPIC download, PVC card print).
   - Passport Assistance (Fresh passport, renewal, tatkal guidance, form filling, document upload, and PSK appointment booking).
   - Ration Card (New ration card application, addition/deletion of family members, UP FCS e-ration download).
   - Driving Licence (Learner's Licence application, permanent DL slot booking, DL renewal, address change via Sarathi Parivahan).
   - Ayushman Bharat Golden Card (PM-JAY - Up to ₹5 Lakh free hospitalization per eligible family per year).
   - E-Shram Card (Unorganized worker national registration, accidental insurance cover).

2. e-District Uttar Pradesh Certificates:
   - Income Certificate (आय प्रमाण पत्र - for scholarships, admissions & subsidies).
   - Caste Certificate (जाति प्रमाण पत्र - SC/ST/OBC category verification).
   - Domicile / Residence Certificate (निवास प्रमाण पत्र - official proof of UP residence).
   - Birth Certificate & Death Certificate registration and formal copies.

3. Government Welfare Schemes:
   - PM Kisan Samman Nidhi (₹6,000/year farmer installment, e-KYC, new registration, land seeding/Khatauni verification).
   - UP Pension Schemes (Old Age / Vridha Pension, Widow / Vidhwa Pension, Divyang / Disability Pension).
   - PM Awas Yojana (PMAY - housing subsidy application).
   - PM Vishwakarma Yojana (Artisan training, toolkit support, and collateral-free loan assistance).
   - PM Matru Vandana Yojana & Kanya Sumangala Yojana.

4. Banking & Financial Services (CSP / DigiPay):
   - AEPS Cash Withdrawal (Aadhaar biometric fingerprint ATM - cash withdrawal for any bank in India).
   - Balance Enquiry & Mini Statement.
   - Domestic Money Transfer (DMT - instant 24/7 bank transfer across India).
   - Savings & Zero-Balance Account Opening assistance.
   - NPCI / DBT Mapping Verification (ensuring bank accounts receive government subsidies).

5. Utility Bills & Recharges (BBPS):
   - UPPCL Electricity Bill Payment (both Rural/Gramin and Urban/Nagariya with instant genuine receipts).
   - Water Bill Payments.
   - LPG Gas Cylinder Booking & Payment (HP Gas, Indane, Bharat Gas).
   - Mobile & DTH Recharges (Jio, Airtel, VI, BSNL, Tata Play, etc.).
   - FASTag Recharge & Traffic Challan Payments.

6. Travel & Booking:
   - Train Ticket Booking (IRCTC authorized booking assistance, Tatkal guidance, status inquiry).
   - Flight Ticket Booking (Domestic & International).
   - Bus Ticket Booking.

7. Education, Forms & Business:
   - UP Scholarship & National Scholarship Portal (NSP) form filling.
   - Government Job & Competitive Exam Application Forms (UPSSSC, Police, Railway, SSC, etc.).
   - Admit Card & Result Printing.
   - Income Tax Return (ITR) Filing assistance.
   - GST Registration & Monthly Return Filing.
   - Udyam / MSME Registration for small businesses.
   - PVC Card Printing (Aadhaar, PAN, Voter, Health Card on durable plastic card).
   - Document Lamination & Xerox.

=== REQUIRED DOCUMENTS GUIDELINES ===
- Aadhaar update: Existing Aadhaar card, valid POI/POA proof (voter card, bank passbook, ration card), registered mobile for OTP.
- PAN card: Aadhaar card (matching name & DOB), 2 passport photos, old PAN copy (if correction).
- Certificates (Income/Caste/Domicile): Aadhaar card, Ration card/Parivar Register Nakal, self-declaration form, photo.
- PM Kisan: Aadhaar card, Bank passbook (with NPCI/DBT linked), Land Khatauni copy, mobile number.
- AEPS Cash Withdrawal: Original Aadhaar card and biometric fingerprint.
- Electricity Bill: Consumer Account ID (10 or 12 digit number).

=== RULES & BEHAVIORAL INSTRUCTIONS ===
1. Languages & Slang:
   - Seamlessly understand English, Hindi (Devanagari script), and Hinglish (e.g., "pan card kaise banega", "documents kya lagenge", "bijli bill bharna hai", "shop kab open hoti hai").
   - Respond in the same language the user uses. If user writes in Hinglish, reply in friendly, helpful Hinglish/Hindi or clear English.
   - Tolerant of typos, phonetic spelling, short texts, and colloquial expressions ("thanku", "ok", "acha", "bhai", "namaste").

2. Multi-turn Conversation Memory:
   - Remember previous questions in this chat. If the user previously asked about "Aadhaar update" and then says "documents kya chahiye?", answer specifically for Aadhaar update.

3. Accuracy & Integrity:
   - CRITICAL: Do NOT invent official government fees, eligibility requirements, government application deadlines, or processing times.
   - Clearly state that government portal fees and standard nominal centre fees apply, and suggest contacting Gupta Enterprises at +91 87565 57994 or chatting on WhatsApp for exact quotes.
   - Do NOT claim Gupta Enterprises provides any service that is not in the list above.

4. Normal Conversational Courtesy:
   - If user says "hi", "hello", "namaste": greet warmly and ask how you can help.
   - If user says "thank you", "thanks", "dhanyawad": reply: "You're welcome! 😊 Is there anything else I can help you with?"
   - If user says "ok", "acha", "theek hai": acknowledge naturally and offer further help if needed.

5. Out-of-Scope Questions:
   - If the user asks questions completely unrelated to Gupta Enterprises, CSC, digital citizen services, government schemes, or documents (e.g. weather, sports, general trivia, code, politics):
     Politely decline: "I’m here to help with Gupta Enterprises and CSC-related services. Please ask me about CSC services, documents, applications, government services, or our contact details."
   - Do NOT hallucinate an answer to unrelated topics.

6. Actionable Contact Information:
   - When answering service questions, mention relevant documents and invite the citizen to visit the centre in Pipraich, call +91 87565 57994, or chat on WhatsApp (+91 87565 57994).
`

// Helper to safely load GEMINI_API_KEY from environment or .env files

export function getGeminiApiKey(): string | null {
  if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim()) {
    return process.env.GEMINI_API_KEY.trim()
  }

  // Check .env.local, .env, or Notepad-created .env.local.txt / .env.txt in process.cwd()

  const candidateFiles = [".env.local", ".env", ".env.local.txt", ".env.txt"]

  for (const fileName of candidateFiles) {
    const fullPath = path.join(process.cwd(), fileName)

    if (fs.existsSync(fullPath)) {
      try {
        const content = fs.readFileSync(fullPath, "utf8")

        const match = content.match(
          /^GEMINI_API_KEY\s*=\s*(["']?)([^"'\r\n]+)\1/m,
        )

        if (match && match[2] && match[2].trim()) {
          return match[2].trim()
        }
      } catch {
        // ignore read error
      }
    }
  }

  return null
}

export interface ChatHistoryItem {
  role: "user" | "model"

  text: string
}

export interface ChatLinkItem {
  label: string
  to?: string
  href?: string
  variant?: string
}

export interface ChatHistoryContent {
  role: string
  parts: { text: string }[]
}

export interface GeminiChatResponse {
  success: boolean
  text: string
  fallback?: boolean
  error?: string
  links?: ChatLinkItem[]
  documents?: string[]
}

// Current supported models for Google Gen AI in cascade

const CANDIDATE_MODELS = [
  "gemini-flash-latest",

  "gemini-3.8-flash",

  "gemini-3.7-flash",

  "gemini-3.5-flash",

  "gemini-3.1-flash-lite",

  "gemini-flash-lite-latest",

  "gemini-pro-latest",
]

export async function handleGeminiChat(
  message: string,

  history: ChatHistoryItem[] = [],
): Promise<GeminiChatResponse> {
  const apiKey = getGeminiApiKey()

  if (!apiKey) {
    console.warn(
      "[Gemini API] GEMINI_API_KEY is not configured in .env.local or environment.",
    )

    return {
      success: false,

      fallback: true,

      text: "",

      error: "GEMINI_API_KEY not configured",
    }
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    // Format history for Google Gen AI SDK

    const formattedContents: ChatHistoryContent[] = []

    // Keep last 10 messages for conversation context

    const recentHistory = history.slice(-10)

    for (const h of recentHistory) {
      if (h.text && h.text.trim()) {
        formattedContents.push({
          role: h.role === "user" ? "user" : "model",

          parts: [{ text: h.text.trim() }],
        })
      }
    }

    // Append latest user message

    formattedContents.push({
      role: "user",

      parts: [{ text: message.trim() }],
    })

    let responseText = ""

    let lastError: any = null

    // Try candidate models in cascade

    for (const model of CANDIDATE_MODELS) {
      try {
        const response = await ai.models.generateContent({
          model,

          contents: formattedContents,

          config: {
            systemInstruction: SYSTEM_PROMPT,

            temperature: 0.4,

            maxOutputTokens: 1000,
          },
        })

        if (response.text && response.text.trim()) {
          responseText = response.text.trim()

          break
        }
      } catch (modelErr: any) {
        lastError = modelErr

        console.warn(
          `[Gemini API] Model ${model} failed (${modelErr?.message || modelErr}), trying fallback model...`,
        )
      }
    }

    if (!responseText.trim()) {
      console.error(
        "[Gemini API Error] All candidate models failed:",
        lastError,
      )

      return {
        success: false,

        fallback: true,

        text: "",

        error: lastError?.message || "Empty response from Gemini API",
      }
    }

    // Attach contextual links based on detected service intent

    const lowerQ = (message + " " + responseText).toLowerCase()

    const links: ChatLinkItem[] = []

    if (lowerQ.includes("pan")) {
      links.push({
        label: "🪪 View PAN Service",
        to: "/services/pan-apply",
        variant: "primary",
      })

      links.push({
        label: "📋 PAN Documents",
        to: "/documents?service=pan-apply",
        variant: "secondary",
      })

      links.push({
        label: "💬 WhatsApp (+91 8756557994)",
        href:
          "https://wa.me/918756557994?text=" +
          encodeURIComponent(
            "Hello Gupta Enterprises, I need assistance regarding PAN Card. Please share the requirements and details.",
          ),
        variant: "whatsapp",
      })
    } else if (lowerQ.includes("aadhaar") || lowerQ.includes("aadhar")) {
      links.push({
        label: "🔐 View Aadhaar Service",
        to: "/services/aadhaar-update",
        variant: "primary",
      })

      links.push({
        label: "📋 Aadhaar Documents",
        to: "/documents?service=aadhaar-update",
        variant: "secondary",
      })

      links.push({
        label: "💬 WhatsApp (+91 8756557994)",
        href:
          "https://wa.me/918756557994?text=" +
          encodeURIComponent(
            "Hello Gupta Enterprises, I need assistance regarding Aadhaar Services. Please share the requirements and details.",
          ),
        variant: "whatsapp",
      })
    } else if (
      lowerQ.includes("certificate") ||
      lowerQ.includes("income") ||
      lowerQ.includes("caste") ||
      lowerQ.includes("domicile") ||
      lowerQ.includes("praman")
    ) {
      links.push({
        label: "📜 View Certificates",
        to: "/services?cat=certificates-schemes",
        variant: "primary",
      })

      links.push({
        label: "📋 Check Documents",
        to: "/documents",
        variant: "secondary",
      })

      links.push({
        label: "💬 WhatsApp (+91 8756557994)",
        href:
          "https://wa.me/918756557994?text=" +
          encodeURIComponent(
            "Hello Gupta Enterprises, I need assistance regarding Certificates. Please share the requirements and details.",
          ),
        variant: "whatsapp",
      })
    } else if (
      lowerQ.includes("scheme") ||
      lowerQ.includes("yojana") ||
      lowerQ.includes("kisan") ||
      lowerQ.includes("ayushman") ||
      lowerQ.includes("pension")
    ) {
      links.push({
        label: "🏛️ Govt Schemes",
        to: "/services?cat=certificates-schemes",
        variant: "primary",
      })

      links.push({
        label: "💬 WhatsApp Help",
        href:
          "https://wa.me/918756557994?text=" +
          encodeURIComponent(
            "Hello Gupta Enterprises, I need assistance regarding Government Schemes. Please share the requirements and details.",
          ),
        variant: "whatsapp",
      })
    } else if (
      lowerQ.includes("bank") ||
      lowerQ.includes("aeps") ||
      lowerQ.includes("cash") ||
      lowerQ.includes("money transfer")
    ) {
      links.push({
        label: "🏦 Banking Services",
        to: "/services?cat=financial-business",
        variant: "primary",
      })

      links.push({
        label: "💬 WhatsApp Enquiry",
        href:
          "https://wa.me/918756557994?text=" +
          encodeURIComponent(
            "Hello Gupta Enterprises, I need assistance regarding Banking Services. Please share the requirements and details.",
          ),
        variant: "whatsapp",
      })
    } else if (
      lowerQ.includes("bill") ||
      lowerQ.includes("bijli") ||
      lowerQ.includes("recharge") ||
      lowerQ.includes("electricity")
    ) {
      links.push({
        label: "⚡ Utility Bills",
        to: "/services?cat=travel-other",
        variant: "primary",
      })

      links.push({
        label: "💬 WhatsApp Enquiry",
        href:
          "https://wa.me/918756557994?text=" +
          encodeURIComponent(
            "Hello Gupta Enterprises, I need assistance regarding Bill Payments. Please share the requirements and details.",
          ),
        variant: "whatsapp",
      })
    } else if (
      lowerQ.includes("contact") ||
      lowerQ.includes("address") ||
      lowerQ.includes("location") ||
      lowerQ.includes("where") ||
      lowerQ.includes("timing") ||
      lowerQ.includes("hours") ||
      lowerQ.includes("phone")
    ) {
      links.push({
        label: "📞 Call +91 87565 57994",
        href: "tel:+918756557994",
        variant: "call",
      })

      links.push({
        label: "🗺️ Get Directions",
        href: "https://maps.google.com/?q=Near+Saint+Xaviers+School+Bhatahat+Road+Buddh+Nagar+Pipraich+Gorakhpur+Uttar+Pradesh",
        variant: "primary",
      })

      links.push({
        label: "💬 Chat on WhatsApp",
        href: "https://wa.me/918756557994",
        variant: "whatsapp",
      })
    }

    return {
      success: true,

      text: responseText,

      links: links.length > 0 ? links : undefined,
    }
  } catch (err: any) {
    console.error("[Gemini API Error]", err)

    return {
      success: false,

      fallback: true,

      text: "",

      error: err?.message || "Gemini API Error",
    }
  }
}

// ── HTTP MIDDLEWARE FOR VITE DEV / PREVIEW SERVER ─────────────────

export function createChatMiddleware() {
  return async (
    req: IncomingMessage,
    res: ServerResponse,
    next: () => void,
  ) => {
    const url = (req.url || "").split("?")[0]

    // Only intercept POST /api/chat

    if (url !== "/api/chat") {
      return next()
    }

    if (req.method !== "POST") {
      res.statusCode = 405

      res.setHeader("Content-Type", "application/json")

      res.end(JSON.stringify({ error: "Method Not Allowed" }))

      return
    }

    let rawBody = ""

    req.on("data", (chunk) => {
      rawBody += chunk
    })

    req.on("end", async () => {
      try {
        const body = rawBody ? JSON.parse(rawBody) : {}

        const { message, history } = body

        if (!message || typeof message !== "string") {
          res.statusCode = 400

          res.setHeader("Content-Type", "application/json")

          res.end(
            JSON.stringify({
              error: 'Missing or invalid "message" in request body',
            }),
          )

          return
        }

        const result = await handleGeminiChat(message, history || [])

        res.statusCode = 200

        res.setHeader("Content-Type", "application/json; charset=utf-8")

        res.end(JSON.stringify(result))
      } catch (err: any) {
        console.error("[Chat Middleware Error]", err)

        res.statusCode = 500

        res.setHeader("Content-Type", "application/json; charset=utf-8")

        res.end(
          JSON.stringify({
            success: false,

            fallback: true,

            error: err?.message || "Internal Server Error",
          }),
        )
      }
    })
  }
}
