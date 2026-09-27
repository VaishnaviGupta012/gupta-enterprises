import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT, waLink } from '../data/contact';

const faqs = [
  {
    q: 'What documents should I bring?',
    a: 'Required documents vary by service. Visit the specific service page or use our "Documents Required" section to check exactly what you need before your visit. You can also WhatsApp us to confirm.',
  },
  {
    q: 'How can I know the service charges?',
    a: 'Service charges vary and may be updated periodically based on the service required. Please contact us via call or WhatsApp to get current charge information for the specific service you need.',
  },
  {
    q: 'Do I need to visit the centre?',
    a: 'For most services, a visit is required to verify your original documents and complete biometric/signature steps or form submissions. However, you can enquire, check document requirements, and prepare fully in advance via call or WhatsApp.',
  },
  {
    q: 'Can I contact you on WhatsApp?',
    a: 'Yes! WhatsApp is one of the most convenient ways to reach us at +91 87565 57994. You can enquire about required documents, check service availability, and clarify questions before visiting.',
  },
  {
    q: 'How can I check my application status?',
    a: 'Application tracking depends on the specific service and portal. Our staff can guide you on how to check your status online using your acknowledgement number, or we can assist you with the status check at our centre.',
  },
  {
    q: 'What are your opening hours?',
    a: 'We are open Monday to Saturday from 9:00 AM to 8:00 PM. We are closed on Sundays. Please call or WhatsApp to confirm before visiting on a public holiday.',
  },
  {
    q: 'How long does an application take?',
    a: 'Processing times vary depending on the relevant government authority, department or provider. When you visit or enquire, we will explain the standard processing flow for your specific service.',
  },
  {
    q: 'Are all listed services currently available?',
    a: 'Most services listed in our catalogue are available. Some are marked "Enquire" as availability may depend on portal operation or specific eligibility conditions. Please check the service status badge or contact us to confirm.',
  },
  {
    q: 'Is my personal information safe?',
    a: 'Yes. We handle your personal information and documents with care and confidentiality. We only use information necessary to process your application and do not share it with unauthorized third parties.',
  },
  {
    q: 'Can I get a receipt or acknowledgement?',
    a: 'Yes, we provide receipts for service payments and formal acknowledgement slips for applications submitted through our centre. Please ask our staff for a copy during your visit.',
  },
];

export default function FAQ() {
  const [openQuestion, setOpenQuestion] = useState<string | null>(null);
  const [faqSearch, setFaqSearch] = useState('');

  const toggleAccordion = (q: string) => {
    setOpenQuestion(openQuestion === q ? null : q);
  };

  const filteredFaqs = faqs.filter(f => {
    if (!faqSearch.trim()) return true;
    const q = faqSearch.toLowerCase().trim();
    return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen bg-white pb-20 md:pb-12">
      {/* Header */}
      <div className="bg-[#1a3a8f] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold font-['Poppins'] mb-1">Frequently Asked Questions</h1>
          <p className="text-blue-200 text-sm">
            Answers to common questions about services, document requirements, and centre visits.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search bar */}
        <div className="relative mb-6">
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
            value={faqSearch}
            onChange={e => setFaqSearch(e.target.value)}
            placeholder="Search FAQs (e.g. documents, hours, charges, receipts)..."
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 bg-[#f8fafc] text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f] text-slate-700"
          />
          {faqSearch && (
            <button
              onClick={() => setFaqSearch('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
              aria-label="Clear FAQ search"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {/* Accordion list */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-2xl border border-slate-100 text-slate-500">
            <p className="font-medium text-slate-700">No matching questions found</p>
            <p className="text-xs text-slate-500 mt-1">Try a different keyword or contact us directly below.</p>
            <button
              onClick={() => setFaqSearch('')}
              className="mt-3 text-xs text-[#1a3a8f] font-semibold hover:underline cursor-pointer"
            >
              Clear search filter
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredFaqs.map((faq, i) => {
              const isOpen = openQuestion === faq.q;
              return (
                <div
                  key={faq.q}
                  className={`bg-white rounded-2xl border transition-all overflow-hidden ${
                    isOpen ? 'border-[#1a3a8f]/30 shadow-sm' : 'border-slate-100 shadow-xs hover:border-slate-200'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => toggleAccordion(faq.q)}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${i}`}
                    className="w-full px-5 py-4 flex items-center justify-between text-left hover:bg-slate-50/80 transition-colors cursor-pointer"
                  >
                    <span className="font-semibold text-slate-800 text-sm pr-4 leading-snug">
                      {faq.q}
                    </span>
                    <svg
                      className={`w-5 h-5 text-[#1a3a8f] shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div
                      id={`faq-answer-${i}`}
                      className="px-5 pb-5 text-slate-600 text-sm leading-relaxed border-t border-slate-50 pt-3"
                    >
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Still have questions banner */}
        <div className="mt-10 bg-[#f0f4ff] rounded-2xl p-6 sm:p-8 text-center border border-blue-50">
          <h3 className="font-bold font-['Poppins'] text-slate-800 text-lg mb-2">Still have questions?</h3>
          <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto">
            Reach out to Gupta Enterprises directly. We are happy to assist you before your visit.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={`tel:${CONTACT.phoneTel}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a3a8f] text-white font-semibold rounded-xl hover:bg-[#122878] transition-colors text-sm justify-center shadow-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              Call: {CONTACT.phone}
            </a>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-[#25d366] text-white font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors text-sm justify-center shadow-sm"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp Us
            </a>
            <a
              href={CONTACT.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-[#1a3a8f] hover:text-[#1a3a8f] transition-colors text-sm justify-center shadow-xs"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
