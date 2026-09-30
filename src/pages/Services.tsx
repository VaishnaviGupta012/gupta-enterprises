import { useState, useEffect, useMemo } from "react"
import { useSearchParams } from "react-router-dom"
import { services, categories, isServiceInCategory } from "../data/services"
import ServiceCard from "../components/ServiceCard"

export default function Services() {
  const [params, setParams] = useSearchParams()
  const [search, setSearch] = useState(params.get("q") || "")
  const [activeCat, setActiveCat] = useState(params.get("cat") || "all")

  useEffect(() => {
    setSearch(params.get("q") || "")
    setActiveCat(params.get("cat") || "all")
  }, [params])

  const handleCategorySelect = (catId: string) => {
    setActiveCat(catId)
    const newParams = new URLSearchParams(params)
    if (catId === "all") {
      newParams.delete("cat")
    } else {
      newParams.set("cat", catId)
    }
    setParams(newParams, { replace: true })
  }

  const handleSearchChange = (val: string) => {
    setSearch(val)
    const newParams = new URLSearchParams(params)
    if (val.trim()) {
      newParams.set("q", val.trim())
    } else {
      newParams.delete("q")
    }
    setParams(newParams, { replace: true })
  }

  const clearFilters = () => {
    setSearch("")
    setActiveCat("all")
    setParams({}, { replace: true })
  }

  // Filter logic supporting both categories and search terms
  const filteredServices = useMemo(() => {
    return services.filter((s) => {
      // Category match
      const matchesCategory = isServiceInCategory(s, activeCat)
      if (!matchesCategory) return false

      // Text search match across name, description, category, and required documents
      if (!search.trim()) return true
      const terms = search.toLowerCase().trim().split(/\s+/)
      const docText = (s.documents || []).join(" ")
      const searchTarget =
        `${s.name} ${s.shortDescription} ${s.category} ${docText}`.toLowerCase()

      return terms.every((term) => searchTarget.includes(term))
    })
  }, [activeCat, search])

  const activeCategoryObj = categories.find((c) => c.id === activeCat)

  return (
    <div className="min-h-screen bg-[#F5F9FF] pb-24 md:pb-16 w-full overflow-x-hidden">
      {/* ── Page Header ────────────────────────────────────────────── */}
      <div className="bg-[#0D47A1] text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-[#0a3880]">
        <div className="site-container max-w-5xl text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-blue-100 text-xs font-semibold uppercase tracking-wider mb-3">
            <span>Gupta Enterprises</span>
            <span>•</span>
            <span>Catalogue</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-['Poppins'] tracking-tight">
            All Digital &amp; Citizen Services
          </h1>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto mt-2 leading-relaxed">
            Browse our complete catalogue across organized categories. Get
            guided, verified application assistance at Pipraich, Gorakhpur.
          </p>
        </div>
      </div>

      <div className="site-container py-8">
        {/* ── Search & Filter Controls ─────────────────────────────── */}
        <div className="max-w-4xl mx-auto mb-8 space-y-4">
          {/* Search Box */}
          <div className="relative max-w-2xl mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg text-slate-400">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search by name or documents required (e.g. PAN, Aadhaar, Income, FASTag)..."
              className="w-full pl-12 pr-10 py-3 rounded-2xl border border-slate-200 bg-white text-sm text-[#172033] placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] shadow-xs transition-all"
            />
            {search && (
              <button
                type="button"
                onClick={() => handleSearchChange("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>

          {/* Category Filter Tabs */}
          <div className="flex gap-2 flex-wrap justify-center">
            {categories.map((cat) => {
              const isSelected = activeCat === cat.id
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => handleCategorySelect(cat.id)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-[#1565C0] text-white border-[#1565C0] shadow-xs"
                      : "bg-white text-slate-600 border-slate-200 hover:border-[#1565C0] hover:text-[#1565C0]"
                  }`}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Status Bar / Result Counters ─────────────────────────── */}
        <div className="flex items-center justify-between gap-4 mb-6 pb-3 border-b border-slate-200">
          <p className="text-xs sm:text-sm text-slate-600 font-medium">
            Showing{" "}
            <strong className="text-[#0D47A1]">
              {filteredServices.length}
            </strong>{" "}
            services
            {activeCat !== "all" && (
              <span>
                {" "}
                in{" "}
                <span className="text-[#1565C0] font-semibold">
                  {activeCategoryObj?.label}
                </span>
              </span>
            )}
            {search && (
              <span>
                {" "}
                matching "<strong className="text-[#0D47A1]">{search}</strong>"
              </span>
            )}
          </p>

          {(activeCat !== "all" || search) && (
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-[#1565C0] hover:text-[#0D47A1] font-semibold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* ── Services Grid ────────────────────────────────────────── */}
        {filteredServices.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 shadow-xs max-w-lg mx-auto">
            <div className="text-5xl mb-3">🔍</div>
            <h3 className="font-bold text-[#0D47A1] font-['Poppins'] text-base mb-1">
              No Services Found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4 leading-relaxed">
              We couldn't find any services matching your search terms. Try
              searching for "Aadhaar", "PAN", "Certificate", or reset filters.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="px-5 py-2.5 rounded-xl bg-[#1565C0] text-white text-xs font-semibold hover:bg-[#0D47A1] transition-colors"
            >
              View All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
