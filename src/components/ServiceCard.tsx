import { Link } from "react-router-dom"
import type { Service } from "../data/services"

interface ServiceCardProps {
  service: Service
}

export default function ServiceCard({ service }: ServiceCardProps) {
  const isAvailable = service.status === "available"

  return (
    <Link
      to={`/services/${service.id}`}
      className="group bg-white rounded-2xl border border-slate-200 hover:border-[#1565C0] p-5 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Card Header: Icon & Category/Status Tag */}
        <div className="flex items-start justify-between gap-2 mb-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#EAF4FF] group-hover:bg-[#DBEAFE] border border-[#BFDBFE]/70 flex items-center justify-center text-2xl transition-colors">
            {service.icon}
          </div>
          <span
            className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full border tracking-wide uppercase ${
              isAvailable
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-amber-50 text-amber-700 border-amber-200"
            }`}
          >
            {isAvailable ? "Available" : "Enquire"}
          </span>
        </div>

        {/* Category Label */}
        <div className="text-[11px] font-semibold text-[#1565C0] uppercase tracking-wider mb-1">
          {service.category}
        </div>

        {/* Service Name */}
        <h3 className="font-bold text-base font-['Poppins'] text-[#0D47A1] leading-snug group-hover:text-[#1565C0] transition-colors mb-2">
          {service.name}
        </h3>

        {/* Short Description */}
        <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
          {service.shortDescription}
        </p>
      </div>

      {/* Card Footer: View Details CTA */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-[#1565C0] group-hover:text-[#0D47A1]">
        <span>View Details &amp; Documents</span>
        <svg
          className="w-4 h-4 group-hover:translate-x-1 transition-transform"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </div>
    </Link>
  )
}
