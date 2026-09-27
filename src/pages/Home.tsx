import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { quickCategories, popularServices } from '../data/services';
import { CONTACT, waLink } from '../data/contact';
import ServiceCard from '../components/ServiceCard';
import { useEnquiry } from '../context/EnquiryContext';
import { submitEnquiry } from '../lib/supabase';

const howItWorks = [
  { step: '01', title: 'Find Your Service', desc: 'Browse our full catalogue or search for the service you need.', icon: '🔍' },
  { step: '02', title: 'Check Documents', desc: 'See what documents you need to bring or arrange beforehand.', icon: '📋' },
  { step: '03', title: 'Contact the Centre', desc: 'Call, WhatsApp, or visit us to confirm details and requirements.', icon: '📞' },
  { step: '04', title: 'Visit & Submit', desc: 'Visit the centre with your documents for personalised assistance.', icon: '🏬' },
  { step: '05', title: 'Application Done', desc: 'We assist with your complete application process from start to finish.', icon: '✅' },
];

const whyUs = [
  { icon: '🗂️', title: 'Multiple Digital Services', desc: 'Wide range of government and civilian digital services under one roof.' },
  { icon: '🤝', title: 'Simple Process', desc: 'We make complex applications simple and stress-free for everyone.' },
  { icon: '📄', title: 'Document Guidance', desc: 'Know exactly what to bring before you visit — no wasted trips.' },
  { icon: '⚡', title: 'Quick Assistance', desc: 'Efficient and prompt assistance to save your valuable time.' },
  { icon: '💬', title: 'Customer Support', desc: 'Reach us by call, WhatsApp, or in person — we\'re always reachable.' },
  { icon: '📍', title: 'Convenient Location', desc: 'Located in Pipraich, Gorakhpur — easy access for local residents.' },
];

const faqs = [
  { q: 'What documents should I bring?', a: 'Required documents vary by service. Visit the service page or use our "Documents Required" section to check what you need before your visit.' },
  { q: 'How can I know the service charges?', a: 'Service charges vary and may be updated periodically. Please contact us on WhatsApp or call us to get current charge information for the service you need.' },
  { q: 'Do I need to visit the centre?', a: 'For most services, a visit is required to verify your documents and complete the application. However, you can enquire and prepare in advance via call or WhatsApp.' },
  { q: 'Can I contact you on WhatsApp?', a: 'Yes! You can reach us on WhatsApp for queries, document checklists, and service information. Use the WhatsApp button on this website.' },
  { q: 'What are your opening hours?', a: 'We are open Monday to Saturday from 9:00 AM to 8:00 PM. We are closed on Sundays.' },
];

export default function Home() {
  const [search, setSearch] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [enquiry, setEnquiry] = useState({ name: '', mobile: '', service: '', message: '' });
  const [enquirySubmitted, setEnquirySubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { openEnquiryModal } = useEnquiry();

  const handleEnquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: enquiry.name.trim(),
        phone: enquiry.mobile.trim(),
        service: enquiry.service.trim() || 'General Enquiry',
        message: enquiry.message.trim(),
      });
    } catch (err) {
      console.error('Failed to submit enquiry:', err);
    } finally {
      setIsSubmitting(false);
      setEnquirySubmitted(true);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/services?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#1a3a8f] via-[#1e44a8] to-[#2d52b8] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-white translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-white -translate-x-1/2 translate-y-1/2" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-xs font-medium px-3 py-1.5 rounded-full mb-6">
              <span className="w-2 h-2 rounded-full bg-[#25d366] animate-pulse" />
              Digital Service Assistance Centre — Pipraich, Gorakhpur
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Poppins'] leading-tight mb-4">
              All Your Digital Services,<br />
              <span className="text-blue-200">In One Place</span>
            </h1>
            <p className="text-blue-100 text-base sm:text-lg leading-relaxed mb-8 max-w-xl">
              Easy assistance for online applications, documents, certificates, payments and everyday digital services.
            </p>

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2 max-w-xl mb-6">
              <div className="relative flex-1">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search PAN Card, Passport, Certificate, FASTag…"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-white text-slate-800 placeholder-slate-400 text-sm outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
              <button type="submit" className="px-5 py-3 bg-[#f59e0b] text-white font-semibold rounded-xl hover:bg-[#d97706] transition-colors text-sm whitespace-nowrap">
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => openEnquiryModal()}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#f59e0b] hover:bg-[#d97706] text-white font-semibold rounded-xl transition-colors text-sm shadow-md cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Submit Enquiry
              </button>
              <Link to="/services" className="px-5 py-2.5 bg-white text-[#1a3a8f] font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm">
                Explore Services
              </Link>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 bg-[#25d366] text-white font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors text-sm"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp Us
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Quick Categories ──────────────────────────────────── */}
      <section className="py-10 bg-[#f0f4ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-lg font-semibold text-slate-600 mb-6 font-['Poppins']">Browse by Category</h2>
          <div className="grid grid-cols-5 sm:grid-cols-5 lg:grid-cols-10 gap-3">
            {quickCategories.map(cat => (
              <Link
                key={cat.id}
                to={`/services?cat=${cat.id}`}
                className="flex flex-col items-center gap-2 bg-white rounded-2xl p-3 text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className="text-2xl sm:text-3xl">{cat.icon}</div>
                <span className="text-[10px] sm:text-xs text-slate-600 font-medium leading-tight group-hover:text-[#1a3a8f]">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Popular Services ──────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-slate-800">Popular Services</h2>
              <p className="text-slate-500 text-sm mt-1">Most requested services at our centre</p>
            </div>
            <Link to="/services" className="text-[#1a3a8f] text-sm font-semibold hover:underline hidden sm:block">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {popularServices.map(s => (
              <ServiceCard key={s.id} service={s} />
            ))}
          </div>
          <div className="text-center mt-8">
            <Link to="/services" className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a3a8f] text-white font-semibold rounded-xl hover:bg-[#122878] transition-colors text-sm">
              View All Services
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────── */}
      <section className="py-14 bg-[#f0f4ff]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-slate-800">How It Works</h2>
            <p className="text-slate-500 text-sm mt-2">Simple steps to get your digital services done</p>
          </div>
          <div className="relative">
            <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-0.5 bg-[#1a3a8f]/20" />
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6">
              {howItWorks.map((s, i) => (
                <div key={i} className="relative flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-2xl mb-3 relative z-10">
                    {s.icon}
                  </div>
                  <div className="text-[#1a3a8f] text-xs font-bold mb-1">{s.step}</div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1 font-['Poppins']">{s.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-slate-800">Why Choose Gupta Enterprises?</h2>
            <p className="text-slate-500 text-sm mt-2">Your trusted digital assistance partner in Pipraich</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUs.map((item, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100 hover:border-blue-100 hover:shadow-sm transition-all">
                <div className="w-11 h-11 rounded-xl bg-[#f0f4ff] flex items-center justify-center text-xl shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-slate-800 text-sm mb-1 font-['Poppins']">{item.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────── */}
      <section className="py-14 bg-[#f0f4ff]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-slate-800">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                  className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <span className="font-semibold text-slate-800 text-sm pr-4 leading-snug">{faq.q}</span>
                  <svg
                    className={`w-5 h-5 text-[#1a3a8f] shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                    fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div className="text-center mt-6">
            <Link to="/faq" className="text-[#1a3a8f] text-sm font-semibold hover:underline">View All FAQs →</Link>
          </div>
        </div>
      </section>

      {/* ── Enquiry Form ─────────────────────────────────────── */}
      <section className="py-14 bg-white">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-['Poppins'] text-slate-800">Send Us an Enquiry</h2>
            <p className="text-slate-500 text-sm mt-2">We'll get back to you promptly with requirement details</p>
          </div>
          {enquirySubmitted ? (
            <div className="bg-[#f0f4ff] rounded-2xl p-6 sm:p-8 text-center border border-blue-100">
              <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                ✓
              </div>
              <h3 className="font-bold text-slate-800 font-['Poppins'] text-lg">Thank You for Your Enquiry!</h3>
              <p className="text-sm text-slate-600 mt-2 mb-4 max-w-md mx-auto">
                We have received your message. For instant response and document checklist on WhatsApp, click below:
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <a
                  href={waLink(`Hello Gupta Enterprises, my name is ${enquiry.name} (Mobile: ${enquiry.mobile}). I need assistance regarding ${enquiry.service || 'digital services'}. ${enquiry.message}`, true)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#25d366] text-white font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors text-sm justify-center"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Open in WhatsApp
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setEnquirySubmitted(false);
                    setEnquiry({ name: '', mobile: '', service: '', message: '' });
                  }}
                  className="px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors text-sm"
                >
                  Submit Another Enquiry
                </button>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleEnquirySubmit}
              className="bg-[#f0f4ff] rounded-2xl p-6 sm:p-8 space-y-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Full Name</label>
                  <input
                    type="text"
                    required
                    minLength={2}
                    value={enquiry.name}
                    onChange={e => setEnquiry({ ...enquiry, name: e.target.value })}
                    placeholder="Your full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1.5">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    pattern="[0-9]{10}"
                    maxLength={10}
                    title="Please enter a valid 10-digit mobile number"
                    value={enquiry.mobile}
                    onChange={e => setEnquiry({ ...enquiry, mobile: e.target.value.replace(/\D/g, '') })}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Select Service</label>
                <select
                  value={enquiry.service}
                  onChange={e => setEnquiry({ ...enquiry, service: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f] text-slate-700"
                >
                  <option value="">Select a service (optional)</option>
                  <option>PAN Card Assistance</option>
                  <option>Aadhaar Assistance</option>
                  <option>Passport Application</option>
                  <option>Income Certificate</option>
                  <option>Caste Certificate</option>
                  <option>FASTag Services</option>
                  <option>Bill Payment</option>
                  <option>Insurance Services</option>
                  <option>Travel Booking</option>
                  <option>Government Scheme Assistance</option>
                  <option>Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Message</label>
                <textarea
                  value={enquiry.message}
                  onChange={e => setEnquiry({ ...enquiry, message: e.target.value })}
                  placeholder="Describe your requirement briefly…"
                  rows={3}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f] resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-[#1a3a8f] text-white font-semibold rounded-xl hover:bg-[#122878] disabled:opacity-60 transition-colors text-sm cursor-pointer shadow-xs flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin w-4 h-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    Submitting Enquiry...
                  </>
                ) : (
                  'Send Enquiry'
                )}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── CTA Banner ───────────────────────────────────────── */}
      <section className="py-10 bg-[#1a3a8f]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-white mb-4">
            Need help with a digital service? We're here.
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="flex items-center gap-2 px-6 py-3 bg-white text-[#1a3a8f] font-semibold rounded-xl hover:bg-blue-50 transition-colors text-sm w-full sm:w-auto justify-center shadow-xs"
            >
              📞 {CONTACT.phone}
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-[#25d366] text-white font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors text-sm w-full sm:w-auto justify-center shadow-xs"
            >
              💬 WhatsApp Us
            </a>
            <a
              href={CONTACT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/30 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors text-sm w-full sm:w-auto justify-center"
            >
              📍 Get Directions
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
