import { Link } from 'react-router-dom';
import { CONTACT, waLink } from '../data/contact';

const values = [
  { icon: '🤝', title: 'Customer-First Approach', desc: 'We prioritise your convenience and ensure every visit to our centre is productive and pleasant.' },
  { icon: '📚', title: 'Knowledgeable Staff', desc: 'Our team stays updated with the latest requirements and procedures for all the services we offer.' },
  { icon: '🔒', title: 'Confidentiality', desc: 'We handle your information with care and respect your privacy at every step.' },
  { icon: '📍', title: 'Local Presence', desc: 'A physical centre in Pipraich you can visit and trust, backed by real people in your community.' },
];

export default function About() {
  return (
    <div className="min-h-screen bg-white pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-[#1a3a8f] text-white py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold font-['Poppins'] mb-1">About Gupta Enterprises</h1>
          <p className="text-blue-200 text-sm">Your trusted local digital service assistance centre in Pipraich, Gorakhpur</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        {/* About */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold font-['Poppins'] text-slate-800 mb-4">About the Centre</h2>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              Gupta Enterprises is a Digital &amp; Online Service Assistance Centre located in Buddh Nagar, Nagar Panchayat Pipraich, Gorakhpur, Uttar Pradesh.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed mb-3">
              We help individuals and families access essential digital services — from government documents and certificates to insurance, bill payments, travel bookings, and educational forms — all under one roof with personalised guidance.
            </p>
            <p className="text-slate-600 text-sm leading-relaxed">
              Our team makes complex online processes simple and stress-free, especially for those who are less familiar with digital platforms.
            </p>
          </div>
          <div className="bg-[#f0f4ff] rounded-2xl p-8 flex items-center justify-center">
            <div className="text-center">
              <div className="text-6xl mb-3">🏬</div>
              <div className="font-bold text-[#1a3a8f] text-lg font-['Poppins']">Gupta Enterprises</div>
              <div className="text-slate-500 text-sm mt-1">Digital &amp; Online Service Assistance Centre</div>
              <div className="mt-4 space-y-2 text-slate-500 text-xs text-left">
                <div className="flex items-start gap-2">
                  <span>📍</span>
                  <div>
                    <span>{CONTACT.addressLine1}<br />{CONTACT.addressLine2}<br />{CONTACT.addressLine3}</span>
                    <a
                      href={CONTACT.mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-[#1a3a8f] font-semibold hover:underline block mt-1"
                    >
                      🗺️ Get Directions →
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span>📞</span>
                  <a href={`tel:${CONTACT.phoneTel}`} className="text-[#1a3a8f] font-medium hover:underline">{CONTACT.phone}</a>
                </div>
                <div className="flex items-center gap-2">
                  <span>🕐</span>
                  <span>Mon–Sat: 9:00 AM – 8:00 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Services we assist */}
        <div className="bg-[#f0f4ff] rounded-2xl p-6 sm:p-8">
          <h2 className="text-xl font-bold font-['Poppins'] text-slate-800 mb-4">Services We Assist With</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              'PAN, Aadhaar, Voter ID, Passport',
              'Income, Caste & Domicile Certificates',
              'Land Records & Bhulekh Assistance',
              'PM-Kisan & Government Schemes',
              'Ayushman Bharat Assistance',
              'e-Shram & Labour Registration',
              'AePS Banking Services',
              'Insurance — Life, Health, Vehicle, Crop',
              'Electricity, Water & Gas Bills',
              'Mobile Recharge & DTH',
              'FASTag & LPG Booking',
              'Vehicle Licence & Transport Services',
              'Train, Bus & Flight Booking',
              'Competitive Exam & Job Forms',
              'Scholarship Applications',
              'Printing, Scanning & Lamination',
              'Passport Photos & PDF Services',
              'General Digital Assistance',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-white rounded-xl p-3">
                <svg className="w-3.5 h-3.5 text-[#1a3a8f] mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                {item}
              </div>
            ))}
          </div>
        </div>

        {/* Our Approach */}
        <div>
          <h2 className="text-xl font-bold font-['Poppins'] text-slate-800 mb-6">Our Approach</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {values.map((v, i) => (
              <div key={i} className="flex gap-4 p-5 rounded-2xl border border-slate-100">
                <div className="w-11 h-11 rounded-xl bg-[#f0f4ff] flex items-center justify-center text-xl shrink-0">
                  {v.icon}
                </div>
                <div>
                  <h3 className="font-semibold font-['Poppins'] text-slate-800 text-sm mb-1">{v.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
          <h3 className="font-semibold text-amber-800 text-sm mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Disclaimer
          </h3>
          <p className="text-amber-700 text-xs leading-relaxed">
            Gupta Enterprises is an independent service assistance centre. We are not affiliated with, endorsed by, or an official representative of any government department or authority. All services are provided as assistance and guidance only. Availability, eligibility, fees, requirements and processing times for individual services may depend on the relevant authority or service provider.
          </p>
        </div>

        {/* CTA */}
        <div className="text-center flex flex-col sm:flex-row gap-3 justify-center">
          <a
            href={`tel:${CONTACT.phoneTel}`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#1a3a8f] text-white font-semibold rounded-xl hover:bg-[#122878] transition-colors text-sm justify-center"
          >
            📞 {CONTACT.phone}
          </a>
          <a
            href={waLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#25d366] text-white font-semibold rounded-xl hover:bg-[#1ebe5d] transition-colors text-sm justify-center"
          >
            💬 WhatsApp Us
          </a>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-[#1a3a8f] hover:text-[#1a3a8f] transition-colors text-sm justify-center"
          >
            📍 Contact Us
          </Link>
          <a
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:border-[#1a3a8f] hover:text-[#1a3a8f] transition-colors text-sm justify-center"
          >
            🗺️ Get Directions
          </a>
        </div>
      </div>
    </div>
  );
}
