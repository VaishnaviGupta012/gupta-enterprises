import { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  supabase,
  isSupabaseConfigured,
  fetchEnquiriesAdmin,
  updateEnquiryStatusAdmin,
  fetchChatQueriesAdmin,
  Enquiry,
  ChatQuery,
  EnquiryStatus,
} from '../../lib/supabase';
import { waLink } from '../../data/contact';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'enquiries' | 'chat_queries'>('overview');
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [chatQueries, setChatQueries] = useState<ChatQuery[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminUser, setAdminUser] = useState<string | null>(null);

  // Filters for enquiries
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');

  // Search for chat queries
  const [chatSearch, setChatSearch] = useState('');

  const navigate = useNavigate();

  // Authentication check & live sync
  useEffect(() => {
    let channel: any = null;
    let pollTimer: any = null;

    async function checkAuth() {
      if (isSupabaseConfigured) {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setAdminUser(session.user.email || 'Admin');
        } else {
          navigate('/admin/login', { replace: true });
          return;
        }
      } else {
        // Local fallback check if Supabase is not configured
        const localAuth = sessionStorage.getItem('gupta_admin_local_auth');
        if (!localAuth) {
          navigate('/admin/login', { replace: true });
          return;
        }
        setAdminUser('Demo Admin (Local)');
      }

      await loadData(true);

      // 1. Setup Supabase Realtime channel for instant live updates
      if (isSupabaseConfigured) {
        try {
          const channelName = `dashboard-realtime-${Date.now()}`;
          channel = supabase.channel(channelName);
          channel
            .on('postgres_changes', { event: '*', schema: 'public', table: 'enquiries' }, () => {
              loadData(false);
            })
            .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_queries' }, () => {
              loadData(false);
            })
            .subscribe();
        } catch (e) {
          console.warn('[Realtime Subscription Notice]', e);
        }
      }

      // 2. Setup periodic background refresh (every 6 seconds) for automatic live sync
      pollTimer = setInterval(() => {
        loadData(false);
      }, 6000);
    }

    checkAuth();

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (pollTimer) clearInterval(pollTimer);
    };
  }, [navigate]);

  async function loadData(showLoading: boolean = true) {
    if (showLoading === true) setLoading(true);
    try {
      const [enquiryList, chatList] = await Promise.all([
        fetchEnquiriesAdmin(),
        fetchChatQueriesAdmin(),
      ]);
      setEnquiries(enquiryList);
      setChatQueries(chatList);
    } catch (err) {
      console.error('[Admin] Error loading dashboard data:', err);
    } finally {
      if (showLoading === true) setLoading(false);
    }
  }

  async function handleStatusChange(id: string, newStatus: EnquiryStatus) {
    // Optimistic update
    setEnquiries((prev) =>
      prev.map((e) => (e.id === id || e.reference_id === id ? { ...e, status: newStatus } : e))
    );
    await updateEnquiryStatusAdmin(id, newStatus);
  }

  async function handleLogout() {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    sessionStorage.removeItem('gupta_admin_local_auth');
    navigate('/admin/login', { replace: true });
  }

  // Calculated Stats
  const stats = useMemo(() => {
    const total = enquiries.length;
    const newCount = enquiries.filter((e) => e.status === 'New').length;
    const inProgressCount = enquiries.filter((e) => e.status === 'In Progress').length;
    const completedCount = enquiries.filter((e) => e.status === 'Completed').length;
    const contactedCount = enquiries.filter((e) => e.status === 'Contacted').length;
    const totalChats = chatQueries.length;

    // Service breakdown
    const serviceCounts: Record<string, number> = {};
    enquiries.forEach((e) => {
      serviceCounts[e.service] = (serviceCounts[e.service] || 0) + 1;
    });

    const topServices = Object.entries(serviceCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    return {
      total,
      newCount,
      inProgressCount,
      completedCount,
      contactedCount,
      totalChats,
      topServices,
    };
  }, [enquiries, chatQueries]);

  // Unique services list for filter dropdown
  const uniqueServices = useMemo(() => {
    const s = new Set<string>();
    enquiries.forEach((e) => s.add(e.service));
    return Array.from(s).sort();
  }, [enquiries]);

  // Filtered enquiries
  const filteredEnquiries = useMemo(() => {
    return enquiries.filter((e) => {
      // Search filter
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.reference_id.toLowerCase().includes(q) ||
        e.name.toLowerCase().includes(q) ||
        e.phone.includes(q) ||
        e.service.toLowerCase().includes(q) ||
        e.message.toLowerCase().includes(q);

      // Status filter
      const matchesStatus = statusFilter === 'all' || e.status === statusFilter;

      // Service filter
      const matchesService = serviceFilter === 'all' || e.service === serviceFilter;

      return matchesSearch && matchesStatus && matchesService;
    });
  }, [enquiries, searchQuery, statusFilter, serviceFilter]);

  // Filtered chat queries
  const filteredChatQueries = useMemo(() => {
    if (!chatSearch.trim()) return chatQueries;
    const q = chatSearch.toLowerCase().trim();
    return chatQueries.filter(
      (c) =>
        c.user_message.toLowerCase().includes(q) ||
        c.ai_response.toLowerCase().includes(q) ||
        (c.detected_service && c.detected_service.toLowerCase().includes(q))
    );
  }, [chatQueries, chatSearch]);

  const getStatusBadge = (status: EnquiryStatus) => {
    switch (status) {
      case 'New':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Contacted':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'In Progress':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Completed':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-['Inter'] text-slate-800">
      {/* Top Navigation Bar */}
      <header className="bg-[#1a3a8f] text-white sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center font-bold text-lg font-['Poppins']">
                G
              </div>
              <div>
                <div className="font-bold text-base font-['Poppins'] flex items-center gap-2">
                  Gupta Enterprises
                  <span className="text-[10px] uppercase tracking-wider bg-blue-500/40 text-blue-100 px-1.5 py-0.5 rounded font-normal">
                    Admin
                  </span>
                </div>
                <div className="text-[11px] text-blue-200">
                  CSC Helpdesk & Citizen Query Portal
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-blue-200 bg-blue-900/40 px-2.5 py-1 rounded-full border border-blue-400/20">
                👤 {adminUser}
              </span>

              <Link
                to="/"
                target="_blank"
                className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <span>🌐</span> Public Site
              </Link>

              <button
                onClick={handleLogout}
                className="text-xs bg-red-500/80 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg transition-colors font-medium flex items-center gap-1"
              >
                <span>🚪</span> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 border-t border-blue-800/60 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2.5 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'border-white text-white'
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <span>📊</span> Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`py-2.5 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'enquiries'
                ? 'border-white text-white'
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <span>📝</span> Enquiries Management
            {stats.newCount > 0 && (
              <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {stats.newCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab('chat_queries')}
            className={`py-2.5 px-4 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'chat_queries'
                ? 'border-white text-white'
                : 'border-transparent text-blue-200 hover:text-white'
            }`}
          >
            <span>🤖</span> Chatbot Queries Log
            <span className="bg-blue-700/60 text-blue-100 text-[10px] px-1.5 py-0.2 rounded-full">
              {stats.totalChats}
            </span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex-1 w-full">
        {!isSupabaseConfigured && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-900 flex items-start gap-3 shadow-xs">
            <span className="text-xl">⚠️</span>
            <div className="flex-1">
              <div className="font-semibold text-amber-950">
                Supabase Environment Variables Not Detected
              </div>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                The dashboard is running in <strong>Local Preview Mode</strong>. Enquiries and chat queries are being safely stored in browser storage.
                To connect to your cloud database, add <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_URL</code> and{' '}
                <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">VITE_SUPABASE_ANON_KEY</code> to your <code className="bg-amber-100 px-1 py-0.5 rounded font-mono">.env.local</code> file.
              </p>
            </div>
          </div>
        )}

        {/* ── TAB 1: OVERVIEW ───────────────────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Total Enquiries
                </div>
                <div className="text-2xl font-bold text-slate-900 mt-1 font-['Poppins']">
                  {stats.total}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-blue-200 shadow-xs relative overflow-hidden">
                <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                  New Enquiries
                </div>
                <div className="text-2xl font-bold text-blue-700 mt-1 font-['Poppins'] flex items-center gap-1.5">
                  {stats.newCount}
                  {stats.newCount > 0 && (
                    <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                  )}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-purple-200 shadow-xs">
                <div className="text-[11px] font-semibold text-purple-600 uppercase tracking-wider">
                  Contacted
                </div>
                <div className="text-2xl font-bold text-purple-700 mt-1 font-['Poppins']">
                  {stats.contactedCount}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-amber-200 shadow-xs">
                <div className="text-[11px] font-semibold text-amber-600 uppercase tracking-wider">
                  In Progress
                </div>
                <div className="text-2xl font-bold text-amber-700 mt-1 font-['Poppins']">
                  {stats.inProgressCount}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-emerald-200 shadow-xs">
                <div className="text-[11px] font-semibold text-emerald-600 uppercase tracking-wider">
                  Completed
                </div>
                <div className="text-2xl font-bold text-emerald-700 mt-1 font-['Poppins']">
                  {stats.completedCount}
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
                <div className="text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  AI Chat Queries
                </div>
                <div className="text-2xl font-bold text-slate-800 mt-1 font-['Poppins']">
                  {stats.totalChats}
                </div>
              </div>
            </div>

            {/* Top Services & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Most Enquired Services */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
                <h3 className="font-semibold text-sm text-slate-900 font-['Poppins'] flex items-center gap-2 mb-4">
                  <span>🏆</span> Most Enquired Services
                </h3>
                {stats.topServices.length === 0 ? (
                  <p className="text-xs text-slate-500 py-6 text-center">No service inquiries yet.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.topServices.map(([srv, count], idx) => {
                      const percentage = Math.round((count / (stats.total || 1)) * 100);
                      return (
                        <div key={srv} className="space-y-1">
                          <div className="flex justify-between text-xs font-medium">
                            <span className="text-slate-800 truncate pr-2">
                              {idx + 1}. {srv}
                            </span>
                            <span className="text-slate-500 shrink-0 font-mono">
                              {count} ({percentage}%)
                            </span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-[#1a3a8f] h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Quick Actions & Recent Enquiries Snapshot */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <h3 className="font-semibold text-sm text-slate-900 font-['Poppins'] flex items-center justify-between mb-4">
                    <span className="flex items-center gap-2">
                      <span>⚡</span> Recent Enquiries
                    </span>
                    <button
                      onClick={() => setActiveTab('enquiries')}
                      className="text-xs text-[#1a3a8f] hover:underline font-medium"
                    >
                      View All →
                    </button>
                  </h3>

                  <div className="space-y-2.5">
                    {enquiries.slice(0, 4).map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                      >
                        <div className="truncate pr-3">
                          <div className="font-semibold text-slate-800 truncate">
                            {item.name} • <span className="font-mono text-slate-500">{item.phone}</span>
                          </div>
                          <div className="text-slate-500 text-[11px] truncate">
                            {item.service}
                          </div>
                        </div>
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${getStatusBadge(
                            item.status
                          )}`}
                        >
                          {item.status}
                        </span>
                      </div>
                    ))}

                    {enquiries.length === 0 && (
                      <p className="text-xs text-slate-500 py-6 text-center">No enquiries yet.</p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 flex gap-2">
                  <button
                    onClick={() => loadData(true)}
                    className="flex-1 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>🔄</span> Refresh Data
                  </button>
                  <button
                    onClick={() => setActiveTab('enquiries')}
                    className="flex-1 py-2 px-3 bg-[#1a3a8f] hover:bg-[#122878] text-white text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>📋</span> Manage All Enquiries
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: ENQUIRIES TABLE ────────────────────────────────────────── */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Filter Toolbar */}
            <div className="p-4 border-b border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                {/* Search */}
                <div className="relative flex-1">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                  <input
                    type="text"
                    placeholder="Search by name, phone, ref ID, or message..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#1a3a8f]/20 focus:border-[#1a3a8f] transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Service Filter */}
                <select
                  value={serviceFilter}
                  onChange={(e) => setServiceFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700 outline-none focus:bg-white focus:border-[#1a3a8f]"
                >
                  <option value="all">All Services ({uniqueServices.length})</option>
                  {uniqueServices.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                {/* Refresh */}
                <button
                  onClick={() => loadData(true)}
                  className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors flex items-center justify-center gap-1"
                >
                  <span>🔄</span> Refresh
                </button>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {(['all', 'New', 'Contacted', 'In Progress', 'Completed'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                      statusFilter === st
                        ? 'bg-[#1a3a8f] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st === 'all' ? 'All Enquiries' : st}
                    <span className="ml-1.5 opacity-80 font-mono text-[10px]">
                      {st === 'all'
                        ? enquiries.length
                        : enquiries.filter((e) => e.status === st).length}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Ref ID</th>
                    <th className="py-3 px-4 font-semibold">Customer Details</th>
                    <th className="py-3 px-4 font-semibold">Service</th>
                    <th className="py-3 px-4 font-semibold max-w-xs">Message</th>
                    <th className="py-3 px-4 font-semibold">Date</th>
                    <th className="py-3 px-4 font-semibold">Status</th>
                    <th className="py-3 px-4 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.map((enq) => {
                    const waHref = `https://wa.me/91${enq.whatsapp_number || enq.phone}?text=${encodeURIComponent(
                      `Hello ${enq.name}, regarding your Gupta Enterprises enquiry [${enq.reference_id}] for ${enq.service}: `
                    )}`;

                    return (
                      <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                        {/* Reference ID */}
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1a3a8f] whitespace-nowrap">
                          {enq.reference_id}
                        </td>

                        {/* Customer */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-900">{enq.name}</div>
                          <div className="text-slate-500 font-mono text-[11px] flex items-center gap-1">
                            <span>📞</span> {enq.phone}
                          </div>
                          {enq.email && (
                            <div className="text-slate-400 text-[10px]">{enq.email}</div>
                          )}
                        </td>

                        {/* Service */}
                        <td className="py-3.5 px-4 font-medium text-slate-800">
                          <span className="inline-block max-w-[200px] truncate" title={enq.service}>
                            {enq.service}
                          </span>
                        </td>

                        {/* Message */}
                        <td className="py-3.5 px-4 max-w-xs text-slate-600">
                          <p className="line-clamp-2 leading-relaxed" title={enq.message}>
                            {enq.message}
                          </p>
                        </td>

                        {/* Date */}
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap text-[11px]">
                          <div>{new Date(enq.created_at).toLocaleDateString()}</div>
                          <div className="text-slate-400 text-[10px]">
                            {new Date(enq.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </div>
                        </td>

                        {/* Status Dropdown */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          <select
                            value={enq.status}
                            onChange={(e) =>
                              handleStatusChange(enq.id, e.target.value as EnquiryStatus)
                            }
                            className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg border cursor-pointer outline-none transition-colors ${getStatusBadge(
                              enq.status
                            )}`}
                          >
                            <option value="New">New</option>
                            <option value="Contacted">Contacted</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </td>

                        {/* Actions: Call & WhatsApp */}
                        <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-1.5">
                          <a
                            href={`tel:${enq.phone}`}
                            title="Call Customer"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors"
                          >
                            📞
                          </a>
                          <a
                            href={waHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            title="Chat on WhatsApp"
                            className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-[#25d366]/10 hover:bg-[#25d366]/20 text-[#128c7e] transition-colors"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                            </svg>
                          </a>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredEnquiries.length === 0 && (
                    <tr>
                      <td colSpan={7} className="py-12 text-center text-slate-500">
                        {searchQuery || statusFilter !== 'all' || serviceFilter !== 'all'
                          ? 'No enquiries match your search filters.'
                          : 'No citizen enquiries found yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB 3: CHATBOT QUERIES LOG ────────────────────────────────────── */}
        {activeTab === 'chat_queries' && (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            {/* Search Header */}
            <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
                <input
                  type="text"
                  placeholder="Search user questions or Gemini responses..."
                  value={chatSearch}
                  onChange={(e) => setChatSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-[#1a3a8f]/20 focus:border-[#1a3a8f] transition-all"
                />
              </div>

              <div className="text-xs text-slate-500 font-medium">
                Total Logged Queries: <strong>{filteredChatQueries.length}</strong>
              </div>
            </div>

            {/* Queries Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-600 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4 font-semibold whitespace-nowrap">Timestamp</th>
                    <th className="py-3 px-4 font-semibold whitespace-nowrap">Session ID</th>
                    <th className="py-3 px-4 font-semibold">User Question</th>
                    <th className="py-3 px-4 font-semibold">Gemini AI Response</th>
                    <th className="py-3 px-4 font-semibold whitespace-nowrap">Detected Service</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredChatQueries.map((chat) => (
                    <tr key={chat.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 whitespace-nowrap text-slate-500 text-[11px]">
                        <div>{new Date(chat.created_at).toLocaleDateString()}</div>
                        <div className="text-slate-400 text-[10px]">
                          {new Date(chat.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px] whitespace-nowrap">
                        {chat.session_id.substring(0, 14)}...
                      </td>

                      <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                        <p className="line-clamp-2">{chat.user_message}</p>
                      </td>

                      <td className="py-3.5 px-4 text-slate-600 max-w-sm">
                        <p className="line-clamp-3 leading-relaxed">{chat.ai_response}</p>
                      </td>

                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {chat.detected_service ? (
                          <span className="px-2.5 py-1 bg-blue-50 text-[#1a3a8f] font-semibold text-[10px] rounded-full border border-blue-200">
                            {chat.detected_service}
                          </span>
                        ) : (
                          <span className="text-slate-400 text-[11px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredChatQueries.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-slate-500">
                        {chatSearch ? 'No chat queries match your search.' : 'No chat queries logged yet.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
