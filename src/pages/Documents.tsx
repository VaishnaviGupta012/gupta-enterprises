import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { services, popularServices } from '../data/services';
import { CONTACT, waLink } from '../data/contact';

export default function Documents() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(params.get('service') || '');

  useEffect(() => {
    const serviceParam = params.get('service');
    if (serviceParam) {
      setSelected(serviceParam);
    }
  }, [params]);

  const handleSelectService = (serviceId: string) => {
    setSelected(serviceId);
    if (serviceId) {
      setParams({ service: serviceId }, { replace: true });
    } else {
      setParams({}, { replace: true });
    }
  };

  const service = services.find(s => s.id === selected);

  // Search filtered services
  const searchResults = search.trim()
    ? services.filter(s => {
        const q = search.toLowerCase().trim();
        const docText = (s.documents || []).join(' ');
        const text = `${s.name} ${s.category} ${s.description} ${docText}`.toLowerCase();
        return text.includes(q);
      })
    : [];

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-12">
      {/* Header */}
      <div className="bg-[#1a3a8f] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold font-['Poppins'] mb-1">Documents Required</h1>
          <p className="text-blue-200 text-sm">
            Check the required documents before visiting our centre in Pipraich.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Selector Card */}
        <div className="bg-[#f0f4ff] rounded-2xl p-6 mb-8 border border-blue-50">
          <h2 className="font-semibold font-['Poppins'] text-slate-800 text-base mb-2">
            Select a Service to View Required Documents
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Search by keyword or select from our full catalogue of 50+ services.
          </p>

          {/* Search bar */}
          <div className="relative mb-3">
            <svg
              className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search service name (e.g. PAN, Passport, Income, Caste, FASTag)..."
              className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f] text-slate-700"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Dropdown selector */}
          <select
            value={selected}
            onChange={e => handleSelectService(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f] text-slate-700 font-medium"
          >
            <option value="">— Or select from all {services.length} services —</option>
            {services.map(s => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.category})
              </option>
            ))}
          </select>

          {/* Quick popular service tags */}
          <div className="mt-4 pt-4 border-t border-blue-100/60">
            <span className="text-xs text-slate-500 font-medium mr-2 block sm:inline mb-1.5 sm:mb-0">
              Popular Services:
            </span>
            <div className="inline-flex flex-wrap gap-1.5">
              {popularServices.slice(0, 7).map(pop => (
                <button
                  key={pop.id}
                  onClick={() => {
                    handleSelectService(pop.id);
                    setSearch('');
                  }}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                    selected === pop.id
                      ? 'bg-[#1a3a8f] text-white border-[#1a3a8f]'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-[#1a3a8f] hover:text-[#1a3a8f]'
                  }`}
                >
                  {pop.icon} {pop.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* If search query has results and no specific service is selected */}
        {search.trim() && !selected && (
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">
              Search Results ({searchResults.length})
            </h3>
            {searchResults.length === 0 ? (
              <div className="text-center py-8 bg-slate-50 rounded-xl border border-slate-100 text-slate-500 text-sm">
                No matching services found for "{search}". Try selecting from the dropdown above.
              </div>
            ) : (
              <div className="space-y-2">
                {searchResults.map(res => (
                  <button
                    key={res.id}
                    onClick={() => {
                      handleSelectService(res.id);
                      setSearch('');
                    }}
                    className="w-full text-left p-3.5 bg-white border border-slate-200 hover:border-[#1a3a8f] rounded-xl flex items-center justify-between group transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{res.icon}</span>
                      <div>
                        <div className="font-semibold text-sm text-slate-800 group-hover:text-[#1a3a8f]">
                          {res.name}
                        </div>
                        <div className="text-xs text-slate-500">{res.category}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold text-[#1a3a8f] group-hover:underline">
                      View Documents →
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Selected Service Documents Card */}
        {service && service.documents ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8">
            <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-slate-100">
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl bg-[#f0f4ff] flex items-center justify-center text-3xl shrink-0">
                  {service.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-slate-500">{service.category}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                        service.status === 'available'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : service.status === 'enquire'
                          ? 'bg-amber-50 text-amber-700 border-amber-200'
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      }`}
                    >
                      {service.status === 'available' ? 'Available' : service.status === 'enquire' ? 'Enquire' : 'Coming Soon'}
                    </span>
                  </div>
                  <h3 className="font-bold font-['Poppins'] text-xl text-slate-800">{service.name}</h3>
                  <p className="text-slate-500 text-xs mt-1 leading-relaxed">{service.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleSelectService('')}
                className="text-xs text-slate-400 hover:text-slate-600 underline shrink-0 cursor-pointer"
              >
                Clear
              </button>
            </div>

            <h4 className="font-semibold font-['Poppins'] text-slate-800 text-sm mb-3 flex items-center gap-2">
              <span>📋</span> Documents Usually Required
            </h4>

            <ul className="space-y-2.5 mb-6">
              {service.documents.map((doc, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-slate-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span>{doc}</span>
                </li>
              ))}
            </ul>

            {service.steps && service.steps.length > 0 && (
              <div className="mb-6 bg-slate-50 rounded-xl p-4 border border-slate-100">
                <h5 className="font-semibold text-xs text-slate-700 mb-2 uppercase tracking-wider">
                  Typical Application Steps:
                </h5>
                <ol className="space-y-1.5 text-xs text-slate-600 list-decimal list-inside">
                  {service.steps.map((st, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {st}
                    </li>
                  ))}
                </ol>
              </div>
            )}

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
              <p className="text-amber-800 text-xs leading-relaxed">
                <strong>Important Note:</strong> Document requirements may vary depending on the applicant's specific situation and the relevant issuing authority. This list serves as a general guide. Please contact or visit Gupta Enterprises to confirm current requirements before submitting.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <a
                href={waLink(service.name)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-3 px-4 bg-[#25d366] text-white font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors text-sm justify-center shadow-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Ask on WhatsApp
              </a>

              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="flex items-center gap-2 py-3 px-4 bg-[#1a3a8f] text-white font-semibold rounded-xl hover:bg-[#122878] transition-colors text-sm justify-center shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
            </div>

            <div className="mt-4 text-center">
              <Link
                to={`/services/${service.id}`}
                className="text-xs text-[#1a3a8f] font-semibold hover:underline inline-flex items-center gap-1"
              >
                View Full Service Information &amp; Overview →
              </Link>
            </div>
          </div>
        ) : (
          !selected &&
          !search.trim() && (
            <div className="text-center py-16 bg-slate-50/70 rounded-2xl border border-slate-100">
              <div className="text-5xl mb-3">📋</div>
              <p className="font-semibold text-slate-700 text-base">Select a service above to view required documents</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                We'll display the complete checklist of what documents you need to bring or prepare.
              </p>
            </div>
          )
        )}
      </div>
    </div>
  );
}
