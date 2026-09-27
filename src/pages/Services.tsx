import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { services, categories } from '../data/services';
import ServiceCard from '../components/ServiceCard';

export default function Services() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get('q') || '');
  const [activeCat, setActiveCat] = useState(params.get('cat') || 'all');

  useEffect(() => {
    setSearch(params.get('q') || '');
    setActiveCat(params.get('cat') || 'all');
  }, [params]);

  const handleCategorySelect = (catId: string) => {
    setActiveCat(catId);
    const newParams = new URLSearchParams(params);
    if (catId === 'all') {
      newParams.delete('cat');
    } else {
      newParams.set('cat', catId);
    }
    setParams(newParams, { replace: true });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    const newParams = new URLSearchParams(params);
    if (value.trim()) {
      newParams.set('q', value.trim());
    } else {
      newParams.delete('q');
    }
    setParams(newParams, { replace: true });
  };

  const clearAllFilters = () => {
    setSearch('');
    setActiveCat('all');
    setParams({}, { replace: true });
  };

  const filtered = services.filter(s => {
    const matchCat = activeCat === 'all' || s.categoryId === activeCat;
    if (!matchCat) return false;
    if (!search.trim()) return true;
    const words = search.toLowerCase().trim().split(/\s+/);
    const docText = (s.documents || []).join(' ');
    const fullText = `${s.name} ${s.description} ${s.category} ${docText}`.toLowerCase();
    return words.every(word => fullText.includes(word));
  });

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-12">
      {/* Header */}
      <div className="bg-[#1a3a8f] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold font-['Poppins'] mb-1">Services Catalogue</h1>
          <p className="text-blue-200 text-sm">
            Explore 50+ government and civilian digital services available with personal assistance at Pipraich, Gorakhpur.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search */}
        <div className="relative max-w-xl mb-6">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={e => handleSearchChange(e.target.value)}
            placeholder="Search by service name, documents required (e.g. PAN, Passport, Income, Ration, FASTag)..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f] bg-[#f8fafc]"
          />
          {search && (
            <button
              onClick={() => handleSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 flex-wrap mb-8">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategorySelect(cat.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all cursor-pointer ${
                activeCat === cat.id
                  ? 'bg-[#1a3a8f] text-white border-[#1a3a8f] shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-[#1a3a8f] hover:text-[#1a3a8f]'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results Info */}
        <div className="flex items-center justify-between gap-4 mb-4">
          <p className="text-slate-600 text-sm font-medium">
            Showing <span className="font-semibold text-slate-800">{filtered.length}</span> of {services.length} services
            {activeCat !== 'all' && (
              <span className="text-slate-500 font-normal"> in {categories.find(c => c.id === activeCat)?.label}</span>
            )}
            {search && <span className="text-slate-500 font-normal"> matching "{search}"</span>}
          </p>
          {(activeCat !== 'all' || search) && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#1a3a8f] font-medium hover:underline cursor-pointer"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Results Grid */}
        {filtered.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="text-5xl mb-3">🔍</div>
            <p className="font-medium text-slate-700 text-base">No services found</p>
            <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find any services matching your search. Try different keywords or browse all categories.
            </p>
            <button
              onClick={clearAllFilters}
              className="mt-5 px-5 py-2.5 bg-[#1a3a8f] text-white rounded-xl text-sm font-medium hover:bg-[#122878] transition-colors"
            >
              View All Services
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 min-[440px]:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map(s => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
