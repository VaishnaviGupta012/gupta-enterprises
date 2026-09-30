import { useState, useEffect, useMemo } from "react"
import { useNavigate, Link } from "react-router-dom"
import {
  supabase,
  isSupabaseConfigured,
  fetchEnquiriesAdmin,
  updateEnquiryStatusAdmin,
  fetchChatQueriesAdmin,
  Enquiry,
  ChatQuery,
  EnquiryStatus,
} from "../../lib/supabase"
import { waLink } from "../../data/contact"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<"enquiries" | "chat_queries">(
    "enquiries",
  )
  const [enquiries, setEnquiries] = useState<Enquiry[]>([])
  const [chatQueries, setChatQueries] = useState<ChatQuery[]>([])
  const [loading, setLoading] = useState(true)
  const [adminUser, setAdminUser] = useState<string | null>(null)

  // Filters for enquiries
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [serviceFilter, setServiceFilter] = useState<string>("all")

  const navigate = useNavigate()

  // Authentication check & live sync
  useEffect(() => {
    let channel: any = null
    let pollTimer: any = null

    async function checkAuth() {
      if (isSupabaseConfigured) {
        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session) {
          setAdminUser(session.user.email || "Admin")
        } else {
          navigate("/admin/login", { replace: true })
          return
        }
      } else {
        const localAuth = sessionStorage.getItem("gupta_admin_local_auth")
        if (!localAuth) {
          navigate("/admin/login", { replace: true })
          return
        }
        setAdminUser("Demo Admin (Preview)")
      }

      await loadData(true)

      // Realtime channel if Supabase is active
      if (isSupabaseConfigured) {
        try {
          channel = supabase.channel(`admin-sync-${Date.now()}`)
          channel
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "enquiries" },
              () => {
                loadData(false)
              },
            )
            .on(
              "postgres_changes",
              { event: "*", schema: "public", table: "chat_queries" },
              () => {
                loadData(false)
              },
            )
            .subscribe()
        } catch {
          // ignore
        }
      }

      // 10-second background poll
      pollTimer = setInterval(() => {
        loadData(false)
      }, 10000)
    }

    checkAuth()

    return () => {
      if (channel) supabase.removeChannel(channel)
      if (pollTimer) clearInterval(pollTimer)
    }
  }, [navigate])

  async function loadData(showLoading = true) {
    if (showLoading) setLoading(true)
    try {
      const [enquiryList, chatList] = await Promise.all([
        fetchEnquiriesAdmin(),
        fetchChatQueriesAdmin(),
      ])
      setEnquiries(enquiryList)
      setChatQueries(chatList)
    } catch (err) {
      console.error("[Admin] Error loading dashboard data:", err)
    } finally {
      if (showLoading) setLoading(false)
    }
  }

  async function handleStatusChange(id: string, newStatus: EnquiryStatus) {
    // Optimistic local state update
    setEnquiries((prev) =>
      prev.map((e) =>
        e.id === id || e.reference_id === id ? { ...e, status: newStatus } : e,
      ),
    )
    await updateEnquiryStatusAdmin(id, newStatus)
  }

  async function handleLogout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut()
    }
    sessionStorage.removeItem("gupta_admin_local_auth")
    navigate("/admin/login", { replace: true })
  }

  // Summary statistics
  const stats = useMemo(() => {
    const total = enquiries.length
    const newCount = enquiries.filter((e) => e.status === "New").length
    const inProgressCount = enquiries.filter(
      (e) => e.status === "In Progress",
    ).length
    const completedCount = enquiries.filter(
      (e) => e.status === "Completed",
    ).length
    const contactedCount = enquiries.filter(
      (e) => e.status === "Contacted",
    ).length
    const totalChats = chatQueries.length
    return {
      total,
      newCount,
      inProgressCount,
      completedCount,
      contactedCount,
      totalChats,
    }
  }, [enquiries, chatQueries])

  // Unique services list for filtering
  const uniqueServices = useMemo(() => {
    const set = new Set<string>()
    enquiries.forEach((e) => {
      if (e.service) set.add(e.service)
    })
    return Array.from(set).sort()
  }, [enquiries])

  // Filtered enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      const matchesSearch =
        !searchQuery.trim() ||
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.phone.includes(searchQuery) ||
        (e.reference_id &&
          e.reference_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        e.service.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || e.status === statusFilter
      const matchesService =
        serviceFilter === "all" || e.service === serviceFilter

      return matchesSearch && matchesStatus && matchesService
    })
  }, [enquiries, searchQuery, statusFilter, serviceFilter])

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case "New":
        return "bg-blue-50 text-blue-700 border-blue-200"
      case "Contacted":
        return "bg-purple-50 text-purple-700 border-purple-200"
      case "In Progress":
        return "bg-amber-50 text-amber-700 border-amber-200"
      case "Completed":
        return "bg-emerald-50 text-emerald-700 border-emerald-200"
      default:
        return "bg-slate-100 text-slate-700 border-slate-200"
    }
  }

  return (
    <div className="min-h-screen bg-[#F5F9FF] text-[#172033] font-['Inter'] pb-16 w-full overflow-x-hidden">
      {/* ── Top Header ────────────────────────────────────────────── */}
      <header className="bg-[#0B1E3B] text-white px-4 sm:px-8 py-4 border-b border-slate-800 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1565C0] flex items-center justify-center font-bold text-lg font-['Poppins']">
              GE
            </div>
            <div>
              <h1 className="font-bold text-base font-['Poppins']">
                Gupta Enterprises Admin
              </h1>
              <p className="text-[11px] text-[#90CDF4]">
                CSC Helpdesk • {adminUser}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs text-slate-300 hover:text-white px-3 py-1.5 rounded-lg border border-slate-700 hover:border-slate-500 transition-colors"
            >
              Public Website ↗
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="text-xs bg-red-600/90 hover:bg-red-600 text-white font-semibold px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* ── Metric Summary Cards ─────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs">
            <div className="text-xs text-slate-500 font-medium">
              Total Enquiries
            </div>
            <div className="text-2xl font-bold font-['Poppins'] text-[#0D47A1] mt-1">
              {stats.total}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-blue-200 p-4 shadow-2xs">
            <div className="text-xs text-blue-700 font-medium">
              New / Unopened
            </div>
            <div className="text-2xl font-bold font-['Poppins'] text-blue-700 mt-1">
              {stats.newCount}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-amber-200 p-4 shadow-2xs">
            <div className="text-xs text-amber-700 font-medium">
              In Progress
            </div>
            <div className="text-2xl font-bold font-['Poppins'] text-amber-700 mt-1">
              {stats.inProgressCount}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-emerald-200 p-4 shadow-2xs">
            <div className="text-xs text-emerald-700 font-medium">
              Completed
            </div>
            <div className="text-2xl font-bold font-['Poppins'] text-emerald-700 mt-1">
              {stats.completedCount}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-indigo-200 p-4 shadow-2xs col-span-2 sm:col-span-1">
            <div className="text-xs text-indigo-700 font-medium">
              AI Assistant Chats
            </div>
            <div className="text-2xl font-bold font-['Poppins'] text-indigo-700 mt-1">
              {stats.totalChats}
            </div>
          </div>
        </div>

        {/* ── Tabs Navigation ───────────────────────────────────────── */}
        <div className="flex border-b border-slate-200 gap-4">
          <button
            type="button"
            onClick={() => setActiveTab("enquiries")}
            className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "enquiries"
                ? "border-[#1565C0] text-[#1565C0]"
                : "border-transparent text-slate-500 hover:text-[#172033]"
            }`}
          >
            📋 Citizen Enquiries ({enquiries.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("chat_queries")}
            className={`pb-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "chat_queries"
                ? "border-[#1565C0] text-[#1565C0]"
                : "border-transparent text-slate-500 hover:text-[#172033]"
            }`}
          >
            🤖 AI Chat Logs ({chatQueries.length})
          </button>
        </div>

        {/* ── Tab 1: Citizen Enquiries Table / Card Layout ──────────── */}
        {activeTab === "enquiries" && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs flex flex-col md:flex-row gap-3 items-center justify-between">
              <div className="w-full md:w-80 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, phone, ref ID, service..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 bg-[#F5F9FF] text-xs text-[#172033] outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0]"
                />
              </div>

              <div className="flex gap-2 w-full md:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-[#F5F9FF] text-xs font-medium outline-none text-[#172033]"
                >
                  <option value="all">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>

                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-[#F5F9FF] text-xs font-medium outline-none max-w-[200px] truncate text-[#172033]"
                >
                  <option value="all">All Services</option>
                  {uniqueServices.map((srv) => (
                    <option key={srv} value={srv}>
                      {srv}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Enquiries List */}
            {loading ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <div className="w-6 h-6 border-2 border-[#1565C0] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs text-slate-500">Loading enquiries...</p>
              </div>
            ) : filteredEnquiries.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                <p className="text-sm font-semibold text-[#0D47A1]">
                  No enquiries matching filters.
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Try resetting the search terms or filters.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#F5F9FF] border-b border-slate-200 text-slate-600 font-semibold">
                        <th className="py-3 px-4">Ref ID / Date</th>
                        <th className="py-3 px-4">Citizen Name</th>
                        <th className="py-3 px-4">Phone / WhatsApp</th>
                        <th className="py-3 px-4">Service</th>
                        <th className="py-3 px-4">Message</th>
                        <th className="py-3 px-4">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredEnquiries.map((enq) => (
                        <tr
                          key={enq.id}
                          className="hover:bg-slate-50/80 transition-colors"
                        >
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-mono font-bold text-[#1565C0]">
                              {enq.reference_id}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {new Date(enq.created_at).toLocaleDateString([], {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 font-semibold text-[#172033]">
                            {enq.name}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="font-mono text-[#172033]">
                              {enq.phone}
                            </div>
                            <a
                              href={waLink(
                                `Hello ${enq.name}, this is Gupta Enterprises regarding your enquiry ref [${enq.reference_id}] for ${enq.service}.`,
                                true,
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] text-[#25D366] hover:underline font-semibold inline-flex items-center gap-1"
                            >
                              <span>💬 WhatsApp</span>
                            </a>
                          </td>

                          <td className="py-3.5 px-4">
                            <span className="font-medium text-[#172033]">
                              {enq.service}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 max-w-xs text-slate-500 leading-relaxed">
                            {enq.message}
                          </td>

                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <select
                              value={enq.status}
                              onChange={(e) =>
                                handleStatusChange(
                                  enq.id,
                                  e.target.value as EnquiryStatus,
                                )
                              }
                              className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border outline-none cursor-pointer ${getStatusBadge(
                                enq.status,
                              )}`}
                            >
                              <option value="New">New</option>
                              <option value="Contacted">Contacted</option>
                              <option value="In Progress">In Progress</option>
                              <option value="Completed">Completed</option>
                            </select>
                          </td>

                          <td className="py-3.5 px-4 text-right whitespace-nowrap">
                            <a
                              href={`tel:${enq.phone}`}
                              className="px-2.5 py-1 rounded-lg border border-[#1565C0] text-[#1565C0] hover:bg-[#1565C0] hover:text-white text-[11px] font-semibold transition-colors inline-block"
                            >
                              📞 Call
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Tab 2: AI Assistant Chat Queries Audit ────────────────── */}
        {activeTab === "chat_queries" && (
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="font-bold text-sm font-['Poppins'] text-[#0D47A1]">
              Recent Chatbot Interactions &amp; Service Queries
            </h3>

            {chatQueries.length === 0 ? (
              <p className="text-xs text-slate-500 py-8 text-center">
                No chatbot queries logged yet.
              </p>
            ) : (
              <div className="space-y-3">
                {chatQueries.map((chat) => (
                  <div
                    key={chat.id}
                    className="p-4 rounded-2xl bg-[#F5F9FF] border border-slate-200 space-y-2 text-xs"
                  >
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span>Session: {chat.session_id}</span>
                      <span>
                        {new Date(chat.created_at).toLocaleString([], {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    <div>
                      <strong className="text-slate-800">User Asked:</strong>
                      <p className="text-[#1565C0] mt-0.5">
                        {chat.user_message}
                      </p>
                    </div>

                    <div>
                      <strong className="text-slate-500">
                        Assistant Response:
                      </strong>
                      <p className="text-slate-600 mt-0.5 whitespace-pre-line leading-relaxed">
                        {chat.ai_response}
                      </p>
                    </div>

                    {chat.detected_service && (
                      <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#EAF4FF] text-[#1565C0] border border-[#BFDBFE]">
                        Detected: {chat.detected_service}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  )
}
