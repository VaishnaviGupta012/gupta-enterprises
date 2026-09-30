import { createClient, SupabaseClient } from "@supabase/supabase-js"

// Environment variables for Supabase (configured in .env.local)
const rawUrl = (import.meta.env.VITE_SUPABASE_URL || "")
  .trim()
  .replace(/\/+$/, "")
const rawKey = (
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  ""
).trim()

export const isSupabaseConfigured = Boolean(
  rawUrl &&
  rawKey &&
  rawUrl !== "https://your-project.supabase.co" &&
  !rawUrl.includes("placeholder"),
)

// Initialize client if credentials exist, otherwise provide fallback dummy client
export const supabase: SupabaseClient = isSupabaseConfigured
  ? createClient(rawUrl, rawKey)
  : createClient(
    "https://placeholder-project.supabase.co",
    "placeholder-anon-key",
  )

// Data Types
export type EnquiryStatus = "New" | "Contacted" | "In Progress" | "Completed"

export interface Enquiry {
  id: string
  reference_id: string
  name: string
  phone: string
  whatsapp_number?: string | null
  email?: string | null
  service: string
  message: string
  status: EnquiryStatus
  created_at: string
}

export interface ChatQuery {
  id: string
  session_id: string
  user_message: string
  ai_response: string
  detected_service?: string | null
  created_at: string
}

export interface EnquiryInput {
  name: string
  phone: string
  whatsapp_number?: string
  email?: string
  service: string
  message: string
}

// Generate human-readable reference ID (e.g. GE-2026-8942)
export function generateReferenceId(): string {
  const year = new Date().getFullYear()
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `GE-${year}-${randomNum}`
}

// ── LOCAL STORAGE FALLBACK HELPERS ─────────────────────────────────
const LOCAL_ENQUIRIES_KEY = "gupta_local_enquiries"
const LOCAL_CHAT_QUERIES_KEY = "gupta_local_chat_queries"

function getLocalEnquiries(): Enquiry[] {
  try {
    const raw = localStorage.getItem(LOCAL_ENQUIRIES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalEnquiries(list: Enquiry[]) {
  try {
    localStorage.setItem(LOCAL_ENQUIRIES_KEY, JSON.stringify(list))
  } catch { }
}

function getLocalChatQueries(): ChatQuery[] {
  try {
    const raw = localStorage.getItem(LOCAL_CHAT_QUERIES_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveLocalChatQueries(list: ChatQuery[]) {
  try {
    localStorage.setItem(LOCAL_CHAT_QUERIES_KEY, JSON.stringify(list))
  } catch { }
}

// Seed demo enquiries if local storage is empty
export function seedDemoDataIfEmpty() {
  const existing = getLocalEnquiries()
  if (existing.length === 0) {
    const now = new Date()
    const demo: Enquiry[] = [
      {
        id: "demo-1",
        reference_id: "GE-2026-1042",
        name: "Rameshwar Yadav",
        phone: "9839123456",
        whatsapp_number: "9839123456",
        email: "rameshwar@example.com",
        service: "Aadhaar Update / Correction",
        message:
          "Aadhaar card me address change karwana hai. Bank passbook proof chalega?",
        status: "New",
        created_at: new Date(now.getTime() - 1000 * 60 * 35).toISOString(),
      },
      {
        id: "demo-2",
        reference_id: "GE-2026-1043",
        name: "Sunita Devi",
        phone: "9123456780",
        whatsapp_number: "9123456780",
        email: "",
        service: "Income Certificate (आय प्रमाण पत्र)",
        message:
          "Bete ki scholarship ke liye urgent aay praman patra banwana hai.",
        status: "In Progress",
        created_at: new Date(now.getTime() - 1000 * 60 * 180).toISOString(),
      },
      {
        id: "demo-3",
        reference_id: "GE-2026-1044",
        name: "Vikas Gupta",
        phone: "8756123450",
        whatsapp_number: "8756123450",
        email: "vikas.gkp@example.com",
        service: "New PAN Card Application",
        message: "Naya PAN card banana hai instant e-PAN ke sath.",
        status: "Contacted",
        created_at: new Date(now.getTime() - 1000 * 60 * 60 * 24).toISOString(),
      },
    ]
    saveLocalEnquiries(demo)
  }
}

// ── ENQUIRY SUBMISSION ──────────────────────────────────────────────
export async function submitEnquiry(
  input: EnquiryInput,
): Promise<{
  success: boolean
  referenceId: string
  supabaseInserted?: boolean
  error?: string
}> {
  const referenceId = generateReferenceId()
  const newRecord: Enquiry = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `local-${Date.now()}`,
    reference_id: referenceId,
    name: input.name.trim(),
    phone: input.phone.trim(),
    whatsapp_number: input.whatsapp_number?.trim() || input.phone.trim(),
    email: input.email?.trim() || null,
    service: input.service.trim(),
    message: input.message.trim(),
    status: "New",
    created_at: new Date().toISOString(),
  }

  // Always keep a local copy for resilience
  const localList = getLocalEnquiries()
  localList.unshift(newRecord)
  saveLocalEnquiries(localList)

  let supabaseInserted = false
  let supabaseError: string | undefined

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from("enquiries").insert([
        {
          reference_id: newRecord.reference_id,
          name: newRecord.name,
          phone: newRecord.phone,
          whatsapp_number: newRecord.whatsapp_number,
          email: newRecord.email,
          service: newRecord.service,
          message: newRecord.message,
          status: "New",
        },
      ])

      if (error) {
        console.error("[Supabase Insert Error]:", error.message)
        supabaseError = error.message
      } else {
        supabaseInserted = true
        console.log("[Supabase Insert Success] Enquiry recorded:", referenceId)
      }
    } catch (err: any) {
      console.error("[Supabase Network Error]:", err?.message)
      supabaseError = err?.message || "Network error"
    }
  }

  return { success: true, referenceId, supabaseInserted, error: supabaseError }
}

// ── CHAT QUERY STORAGE ──────────────────────────────────────────────
export async function recordChatQuery(params: {
  sessionId: string
  userMessage: string
  aiResponse: string
  detectedService?: string | null
}): Promise<{ success: boolean; supabaseInserted?: boolean; error?: string }> {
  const newQuery: ChatQuery = {
    id:
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `query-${Date.now()}`,
    session_id: params.sessionId,
    user_message: params.userMessage.trim(),
    ai_response: params.aiResponse.trim(),
    detected_service: params.detectedService || null,
    created_at: new Date().toISOString(),
  }

  // Store locally (keep up to 200 items)
  const list = getLocalChatQueries()
  list.unshift(newQuery)
  if (list.length > 200) list.pop()
  saveLocalChatQueries(list)

  let supabaseInserted = false
  let supabaseError: string | undefined

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase.from("chat_queries").insert([
        {
          session_id: newQuery.session_id,
          user_message: newQuery.user_message,
          ai_response: newQuery.ai_response,
          detected_service: newQuery.detected_service,
        },
      ])

      if (error) {
        console.error("[Supabase Chat Insert Error]:", error.message)
        supabaseError = error.message
      } else {
        supabaseInserted = true
      }
    } catch (err: any) {
      console.error("[Supabase Chat Network Error]:", err?.message)
      supabaseError = err?.message || "Network error"
    }
  }

  return { success: true, supabaseInserted, error: supabaseError }
}

// ── ADMIN FETCH ENQUIRIES ───────────────────────────────────────────
export async function fetchEnquiriesAdmin(): Promise<Enquiry[]> {
  const localList = getLocalEnquiries()

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("enquiries")
        .select("*")
        .order("created_at", { ascending: false })

      if (!error && Array.isArray(data) && data.length > 0) {
        const ids = new Set(data.map((d: any) => d.reference_id || d.id))
        const unrecordedLocal = localList.filter(
          (l) => !ids.has(l.reference_id) && !ids.has(l.id),
        )
        return [...data, ...unrecordedLocal] as Enquiry[]
      }
    } catch (err) {
      console.warn("[Supabase] Fetch enquiries fallback to local:", err)
    }
  }

  seedDemoDataIfEmpty()
  return getLocalEnquiries()
}

// ── ADMIN UPDATE ENQUIRY STATUS ─────────────────────────────────────
export async function updateEnquiryStatusAdmin(
  id: string,
  newStatus: EnquiryStatus,
): Promise<boolean> {
  const list = getLocalEnquiries()
  const item = list.find((e) => e.id === id || e.reference_id === id)
  if (item) {
    item.status = newStatus
    saveLocalEnquiries(list)
  }

  if (isSupabaseConfigured) {
    try {
      const { error } = await supabase
        .from("enquiries")
        .update({ status: newStatus })
        .or(`id.eq.${id},reference_id.eq.${id}`)

      if (error) {
        console.warn("[Supabase] Update status error:", error.message)
      }
    } catch (err) {
      console.warn("[Supabase] Update status network error:", err)
    }
  }

  return true
}

// ── ADMIN FETCH CHAT QUERIES ────────────────────────────────────────
export async function fetchChatQueriesAdmin(): Promise<ChatQuery[]> {
  const localList = getLocalChatQueries()

  if (isSupabaseConfigured) {
    try {
      const { data, error } = await supabase
        .from("chat_queries")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      if (!error && Array.isArray(data) && data.length > 0) {
        const ids = new Set(data.map((d: any) => d.id || d.session_id))
        const unrecordedLocal = localList.filter((l) => !ids.has(l.id))
        return [...data, ...unrecordedLocal] as ChatQuery[]
      }
    } catch (err) {
      console.warn("[Supabase] Fetch chat queries fallback to local:", err)
    }
  }

  return getLocalChatQueries()
}
