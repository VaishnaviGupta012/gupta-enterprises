import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { services } from '../data/services';
import { CONTACT, waLink } from '../data/contact';

const processSteps = [
  { n: '1', title: 'Check Requirements', desc: 'Review the documents and eligibility criteria for this service.' },
  { n: '2', title: 'Prepare Documents', desc: 'Gather all required documents before visiting or contacting us.' },
  { n: '3', title: 'Contact / Visit Centre', desc: 'Call, WhatsApp, or visit Gupta Enterprises with your documents.' },
  { n: '4', title: 'Application Assistance', desc: 'Our team will assist you through the complete application process.' },
];

export default function ServiceDetail() {
  const { id } = useParams();
  const service = services.find(s => s.id === id);

  const [applyOpen, setApplyOpen] = useState(false);
  const [applyForm, setApplyForm] = useState({ name: '', mobile: '', notes: '' });
  const [applySubmitted, setApplySubmitted] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsApplying(true);
    setTimeout(() => {
      setIsApplying(false);
      setApplySubmitted(true);
    }, 350);
  };

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center p-8 bg-white">
        <div>
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-xl font-bold text-slate-800 font-['Poppins'] mb-2">Service Not Found</h2>
          <p className="text-slate-500 text-sm mb-6">This service doesn't exist or may have been updated.</p>
          <Link to="/services" className="px-5 py-2.5 bg-[#1a3a8f] text-white rounded-xl text-sm font-medium hover:bg-[#122878] transition-colors shadow-xs">
            Browse All Services
          </Link>
        </div>
      </div>
    );
  }

  const applyWaMsg = `Hello Gupta Enterprises, I submitted an application enquiry for ${service.name}. Name: ${applyForm.name}, Mobile: ${applyForm.mobile}. ${applyForm.notes ? 'Note: ' + applyForm.notes : ''} Please share the requirements and next steps.`;

  return (
    <div className="min-h-screen bg-white pb-24 md:pb-12">
      {/* Breadcrumb */}
      <div className="bg-[#f0f4ff] border-b border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/" className="hover:text-[#1a3a8f] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/services" className="hover:text-[#1a3a8f] transition-colors">Services</Link>
          <span>/</span>
          <span className="text-slate-700 font-medium truncate">{service.name}</span>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title card */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-2xl bg-[#f0f4ff] flex items-center justify-center text-3xl shrink-0">
                {service.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs text-slate-500">{service.category}</span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    service.status === 'available' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    service.status === 'enquire' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                    'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    {service.status === 'available' ? 'Available' : service.status === 'enquire' ? 'Enquire' : 'Coming Soon'}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-slate-800 leading-snug">{service.name}</h1>
                <p className="text-slate-500 text-sm mt-1 leading-relaxed">{service.description}</p>
              </div>
            </div>

            {/* About */}
            <div className="bg-[#f0f4ff] rounded-2xl p-5 border border-blue-50">
              <h2 className="font-semibold font-['Poppins'] text-slate-800 mb-2">About This Service</h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Gupta Enterprises provides professional assistance for {service.name.toLowerCase()}. We help individuals and families navigate the application process, ensuring the correct documents are submitted and forms are filled accurately. Our staff will guide you at every step.
              </p>
            </div>

            {/* Documents Usually Required */}
            {service.documents && service.documents.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-semibold font-['Poppins'] text-slate-800 flex items-center gap-2 text-base">
                    <span>📋</span> Documents Usually Required
                  </h2>
                  <Link
                    to={`/documents?service=${service.id}`}
                    className="text-xs text-[#1a3a8f] font-semibold hover:underline"
                  >
                    View in Checklist →
                  </Link>
                </div>
                <ul className="space-y-2">
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
                <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                  * Document requirements may vary depending on individual cases and issuing authorities. Please confirm with us before visiting.
                </p>
              </div>
            )}

            {/* Application Process */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
              <h2 className="font-semibold font-['Poppins'] text-slate-800 mb-4 text-base">Application Process</h2>
              <div className="space-y-4">
                {(service.steps && service.steps.length > 0
                  ? service.steps.map((st, i) => ({ n: (i + 1).toString(), title: `Step ${i + 1}`, desc: st }))
                  : processSteps
                ).map((step, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-7 h-7 rounded-full bg-[#1a3a8f] text-white text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {step.n}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 text-sm">{step.title}</div>
                      <div className="text-slate-500 text-xs mt-0.5 leading-relaxed">{step.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Important Information */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <h2 className="font-semibold font-['Poppins'] text-amber-800 mb-2 flex items-center gap-2 text-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Important Information &amp; Charges
              </h2>
              <p className="text-amber-700 text-xs leading-relaxed">
                Requirements, government fees, and processing times vary based on the specific authority or department. Gupta Enterprises provides application guidance and digital form-filling assistance only. We are an independent service assistance centre and not an official government body.
              </p>
              <div className="mt-3 flex items-center gap-2 text-amber-800 text-xs">
                <span className="font-semibold">Service Charges:</span>
                <span>Contact us via call or WhatsApp for current assistance fees</span>
              </div>
            </div>

            {/* Inline Action Card */}
            <div className="bg-[#f0f4ff] rounded-2xl p-5 sm:p-6 border border-blue-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="font-bold text-slate-800 font-['Poppins'] text-base">Ready to apply for {service.name}?</h3>
                <p className="text-xs text-slate-500 mt-0.5">Visit our Pipraich centre or send an online enquiry.</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => setApplyOpen(true)}
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-[#1a3a8f] text-white text-xs font-semibold rounded-xl hover:bg-[#122878] transition-colors shadow-xs cursor-pointer"
                >
                  Apply / Enquire Now
                </button>
                <a
                  href={waLink(service.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-none px-4 py-2.5 bg-[#25d366] text-white text-xs font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors shadow-xs flex items-center justify-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Sidebar CTAs */}
          <div className="space-y-4">
            <div className="bg-[#f0f4ff] rounded-2xl p-5 sticky top-20 border border-blue-50 shadow-xs">
              <h3 className="font-semibold font-['Poppins'] text-slate-800 mb-3 text-sm">
                Get Assistance for this Service
              </h3>

              <div className="space-y-2.5">
                {/* Apply/Enquire button */}
                <button
                  type="button"
                  onClick={() => setApplyOpen(true)}
                  className="flex items-center gap-2 w-full py-3 px-4 bg-[#1a3a8f] text-white font-semibold rounded-xl hover:bg-[#122878] transition-colors text-sm justify-center shadow-xs cursor-pointer"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Apply / Enquire Now
                </button>

                {/* WhatsApp button */}
                <a
                  href={waLink(service.name)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 w-full py-3 px-4 bg-[#25d366] text-white font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors text-sm justify-center shadow-xs"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  WhatsApp Enquiry
                </a>

                {/* Call button */}
                <a
                  href={`tel:${CONTACT.phoneTel}`}
                  className="flex items-center gap-2 w-full py-2.5 px-4 bg-white border border-[#1a3a8f] text-[#1a3a8f] font-semibold rounded-xl hover:bg-blue-50 transition-colors text-xs sm:text-sm justify-center shadow-xs"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call: {CONTACT.phone}
                </a>

                {/* Check Documents */}
                <Link
                  to={`/documents?service=${service.id}`}
                  className="flex items-center gap-2 w-full py-2.5 px-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-[#1a3a8f] hover:text-[#1a3a8f] transition-colors text-xs sm:text-sm justify-center shadow-xs"
                >
                  📋 Check Documents Required
                </Link>

                {/* Location links */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <Link
                    to="/contact"
                    className="flex items-center gap-1.5 py-2.5 px-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-[#1a3a8f] hover:text-[#1a3a8f] transition-colors text-xs justify-center shadow-xs"
                  >
                    📍 Contact Us
                  </Link>
                  <a
                    href={CONTACT.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 py-2.5 px-3 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-[#1a3a8f] hover:text-[#1a3a8f] transition-colors text-xs justify-center shadow-xs"
                  >
                    🗺️ Directions
                  </a>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-200/80 space-y-1.5 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>Mon–Sat: 9:00 AM – 8:00 PM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Pipraich, Gorakhpur, UP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply / Enquire Modal */}
      {applyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-100 relative animate-in fade-in duration-200">
            <button
              onClick={() => { setApplyOpen(false); setApplySubmitted(false); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1.5 rounded-full hover:bg-slate-100 cursor-pointer"
              aria-label="Close modal"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {applySubmitted ? (
              <div className="text-center py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  ✓
                </div>
                <h3 className="font-bold text-slate-800 font-['Poppins'] text-lg">Enquiry Received!</h3>
                <p className="text-xs text-slate-600 mt-2 mb-4 leading-relaxed">
                  Thank you, <span className="font-semibold">{applyForm.name}</span>! Your enquiry regarding <span className="font-semibold">{service.name}</span> has been noted.
                </p>
                <div className="space-y-2">
                  <a
                    href={waLink(applyWaMsg, true)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#25d366] text-white font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors text-sm shadow-xs"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    Continue Enquiry on WhatsApp
                  </a>
                  <button
                    type="button"
                    onClick={() => { setApplyOpen(false); setApplySubmitted(false); setApplyForm({ name: '', mobile: '', notes: '' }); }}
                    className="mt-2 text-xs text-slate-500 hover:text-slate-700 underline block mx-auto cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="space-y-3.5">
                <div className="flex items-center gap-2.5 mb-1 pb-3 border-b border-slate-100">
                  <span className="text-2xl">{service.icon}</span>
                  <div>
                    <h3 className="font-bold text-slate-800 font-['Poppins'] text-base leading-tight">
                      Apply / Enquire
                    </h3>
                    <p className="text-xs text-[#1a3a8f] font-medium mt-0.5">{service.name}</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Enter your contact details. Our team at Gupta Enterprises will assist you with requirements, verification and form submission.
                </p>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={applyForm.name}
                    onChange={e => setApplyForm({ ...applyForm, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Please enter a valid 10-digit mobile number"
                    value={applyForm.mobile}
                    onChange={e => setApplyForm({ ...applyForm, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Specific Notes / Requirement (Optional)</label>
                  <textarea
                    value={applyForm.notes}
                    onChange={e => setApplyForm({ ...applyForm, notes: e.target.value })}
                    placeholder="Any specific requirement or queries..."
                    rows={2}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f] resize-none"
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setApplyOpen(false)}
                    className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="flex-1 py-2.5 bg-[#1a3a8f] hover:bg-[#122878] disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isApplying ? 'Submitting...' : 'Submit Enquiry'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
