import { Link } from 'react-router-dom';
import type { Service } from '../data/services';

const statusConfig = {
  available: { label: 'Available', class: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  enquire: { label: 'Enquire', class: 'bg-amber-50 text-amber-700 border-amber-200' },
  'coming-soon': { label: 'Coming Soon', class: 'bg-slate-100 text-slate-500 border-slate-200' },
};

export default function ServiceCard({ service }: { service: Service }) {
  const status = statusConfig[service.status] || statusConfig.available;
  return (
    <Link
      to={`/services/${service.id}`}
      className="group bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-4 sm:p-5 flex flex-col"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-11 h-11 rounded-xl bg-[#f0f4ff] flex items-center justify-center text-2xl">
          {service.icon}
        </div>
        <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${status.class}`}>
          {status.label}
        </span>
      </div>
      <h3 className="font-semibold text-slate-800 text-sm leading-snug mb-1 group-hover:text-[#1a3a8f] transition-colors">
        {service.name}
      </h3>
      <p className="text-slate-500 text-xs leading-relaxed flex-1">{service.description}</p>
      <div className="mt-3 flex items-center gap-1 text-[#1a3a8f] text-xs font-medium">
        View Details
        <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}
