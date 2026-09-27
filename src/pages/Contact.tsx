import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { CONTACT, waLink } from '../data/contact';
import { submitEnquiry } from '../lib/supabase';

function ContactEnquiryForm() {
  const [params] = useSearchParams();
  const [form, setForm] = useState({
    name: '',
    mobile: '',
    service: params.get('service') || '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const s = params.get('service');
    if (s) setForm(prev => ({ ...prev, service: s }));
  }, [params]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitEnquiry({
        name: form.name.trim(),
        phone: form.mobile.trim(),
        service: form.service.trim() || 'General Contact Enquiry',
        message: form.message.trim(),
      });
    } catch (err) {
      console.error('Failed to save contact enquiry:', err);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
    }
  };

  const waMsg = `Hello Gupta Enterprises, my name is ${form.name} (Mobile: ${form.mobile}). ${
    form.service ? `I need assistance regarding ${form.service}. ` : ''
  }${form.message ? form.message : 'Please share the requirements and details.'}`;

  if (submitted) {
    return (
      <div className="bg-white rounded-xl p-5 border border-emerald-200 text-center shadow-xs">
        <div className="w-11 h-11 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2 text-lg font-bold">
          ✓
        </div>
        <h4 className="font-semibold text-slate-800 text-sm">Enquiry Recorded!</h4>
        <p className="text-xs text-slate-600 mt-1 mb-4 leading-relaxed">
          Thank you, <span className="font-semibold">{form.name}</span>! For faster response, you can continue this enquiry directly on WhatsApp:
        </p>
        <a
          href={waLink(waMsg, true)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25d366] text-white text-xs font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors shadow-xs"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Continue Enquiry on WhatsApp
        </a>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false);
            setForm({ name: '', mobile: '', service: '', message: '' });
          }}
          className="block w-full text-center text-[11px] text-slate-400 hover:text-slate-600 mt-3 cursor-pointer"
        >
          Submit another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <input
        type="text"
        required
        minLength={2}
        value={form.name}
        onChange={e => setForm({ ...form, name: e.target.value })}
        placeholder="Your full name"
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f]"
      />
      <input
        type="tel"
        required
        pattern="[0-9]{10}"
        maxLength={10}
        title="Please enter a valid 10-digit mobile number"
        value={form.mobile}
        onChange={e => setForm({ ...form, mobile: e.target.value.replace(/\D/g, '') })}
        placeholder="Mobile number (10 digits)"
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f]"
      />
      <input
        type="text"
        value={form.service}
        onChange={e => setForm({ ...form, service: e.target.value })}
        placeholder="Service name (optional, e.g. PAN Card, Passport)"
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f]"
      />
      <textarea
        value={form.message}
        onChange={e => setForm({ ...form, message: e.target.value })}
        placeholder="How can we help you?"
        rows={3}
        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:ring-2 focus:ring-[#1a3a8f]/30 focus:border-[#1a3a8f] resize-none"
      />
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
            Sending Enquiry...
          </>
        ) : (
          'Send Message'
        )}
      </button>
    </form>
  );
}

export default function Contact() {
  return (
    <div className="min-h-screen bg-white pb-20 md:pb-12">
      {/* Header */}
      <div className="bg-[#1a3a8f] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold font-['Poppins'] mb-1">Contact Us</h1>
          <p className="text-blue-200 text-sm">We're here to help — reach out any way you prefer</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Contact info */}
          <div className="space-y-5">
            <div className="bg-[#f0f4ff] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-[#1a3a8f] flex items-center justify-center text-white font-bold text-xl font-['Poppins']">
                  G
                </div>
                <div>
                  <div className="font-bold font-['Poppins'] text-slate-800">Gupta Enterprises</div>
                  <div className="text-slate-500 text-xs">Digital &amp; Online Service Assistance Centre</div>
                </div>
              </div>
              <ul className="space-y-4">
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-lg shrink-0">
                    📍
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-0.5">Address</div>
                    <div className="text-sm text-slate-800">
                      {CONTACT.addressLine1}<br />
                      {CONTACT.addressLine2}<br />
                      {CONTACT.addressLine3}
                    </div>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-lg shrink-0">
                    📞
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-0.5">Phone</div>
                    <a href={`tel:${CONTACT.phoneTel}`} className="text-sm text-[#1a3a8f] font-medium hover:underline">{CONTACT.phone}</a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-[#25d366]/10 border border-[#25d366]/20 flex items-center justify-center text-lg shrink-0">
                    💬
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-0.5">WhatsApp</div>
                    <a
                      href={waLink()}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-[#25d366] font-medium hover:underline"
                    >
                      {CONTACT.phone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-lg shrink-0">
                    ✉️
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-0.5">Email</div>
                    <a href={`mailto:${CONTACT.email}`} className="text-sm text-[#1a3a8f] font-medium hover:underline break-all">
                      {CONTACT.email}
                    </a>
                  </div>
                </li>
                <li className="flex gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-lg shrink-0">
                    🕐
                  </div>
                  <div>
                    <div className="text-xs font-medium text-slate-500 mb-0.5">Opening Hours</div>
                    <div className="text-sm text-slate-800">
                      <div>Monday – Saturday: 9:00 AM – 8:00 PM</div>
                      <div className="text-slate-400 text-xs mt-0.5">Sunday: Closed</div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>

            {/* Action buttons */}
            <div className="grid grid-cols-3 gap-3">
              <a
                href={`tel:${CONTACT.phoneTel}`}
                className="flex flex-col items-center gap-1.5 py-4 bg-[#1a3a8f] text-white font-semibold rounded-2xl hover:bg-[#122878] transition-colors text-xs text-center shadow-xs"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Call Now
              </a>
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 py-4 bg-[#25d366] text-white font-semibold rounded-2xl hover:bg-[#1ebe5d] transition-colors text-xs text-center shadow-xs"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                WhatsApp
              </a>
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-1.5 py-4 bg-white border border-slate-200 text-slate-700 font-semibold rounded-2xl hover:border-[#1a3a8f] hover:text-[#1a3a8f] transition-colors text-xs text-center shadow-xs"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Get Directions
              </a>
            </div>
          </div>

          {/* Map placeholder + form */}
          <div className="space-y-5">
            {/* Map embed placeholder */}
            <div className="bg-[#f0f4ff] rounded-2xl overflow-hidden p-6 flex flex-col items-center justify-center border border-slate-100 text-center">
              <div className="w-12 h-12 rounded-2xl bg-white shadow-xs flex items-center justify-center text-2xl mb-3">
                📍
              </div>
              <p className="text-base font-bold text-slate-800 font-['Poppins']">Gupta Enterprises</p>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">
                Near Saint Xavier's School, Bhatahat Road, Buddh Nagar, Nagar Panchayat Pipraich, Gorakhpur
              </p>
              <a
                href={CONTACT.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-[#1a3a8f] text-white text-xs font-semibold rounded-xl hover:bg-[#122878] transition-colors shadow-xs"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Get Directions in Google Maps →
              </a>
            </div>

            {/* Quick enquiry */}
            <div className="bg-[#f0f4ff] rounded-2xl p-5 sm:p-6 border border-blue-50">
              <h3 className="font-semibold font-['Poppins'] text-slate-800 mb-1">Quick Enquiry</h3>
              <p className="text-xs text-slate-500 mb-4">Send us your enquiry or connect on WhatsApp.</p>
              <ContactEnquiryForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
