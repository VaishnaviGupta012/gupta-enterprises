import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CONTACT, waLink } from '../data/contact';
import { services, Service } from '../data/services';
import { useEnquiry } from '../context/EnquiryContext';
import { recordChatQuery } from '../lib/supabase';

export interface ChatLink {
  label: string;
  to?: string;
  href?: string;
  variant?: 'primary' | 'whatsapp' | 'call' | 'secondary';
}

export interface Message {
  id: string;
  role: 'bot' | 'user';
  text: string;
  documents?: string[];
  links?: ChatLink[];
  showQuickOptions?: boolean;
  isAi?: boolean;
  detectedService?: string | null;
  timestamp: string;
}

export const QUICK_OPTIONS = [
  'CSC Services',
  'Aadhaar Services',
  'PAN Card',
  'Government Schemes',
  'Banking Services',
  'Bill Payments',
  'Certificates',
  'Required Documents',
  'Business Hours',
  'Contact Us',
];

const WELCOME_TEXT = 'Hi! 👋 Welcome to Gupta Enterprises. How can I help you today?';

function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function findMatchingService(query: string): Service | null {
  const q = query.toLowerCase().trim();

  // 1. Exact ID or name match
  const exact = services.find(
    s => s.id.toLowerCase() === q || s.name.toLowerCase() === q
  );
  if (exact) return exact;

  // 2. Specific keyword shortcuts for high-frequency citizen services
  if (q.includes('pan') && !q.includes('japan') && !q.includes('company')) {
    return services.find(s => s.id === 'pan-apply') || services.find(s => s.name.toLowerCase().includes('pan')) || null;
  }
  if (q.includes('aadhaar') || q.includes('aadhar') || q.includes('uidai') || q.includes('uid')) {
    return services.find(s => s.id === 'aadhaar-update') || services.find(s => s.name.toLowerCase().includes('aadhaar')) || null;
  }
  if (q.includes('voter') || q.includes('epic') || q.includes('election card') || q.includes('matdata')) {
    return services.find(s => s.id === 'voter-apply') || services.find(s => s.name.toLowerCase().includes('voter')) || null;
  }
  if (q.includes('passport')) {
    return services.find(s => s.id === 'passport-apply') || services.find(s => s.name.toLowerCase().includes('passport')) || null;
  }
  if (q.includes('ration') || q.includes('rashan') || q.includes('kotedar')) {
    return services.find(s => s.id === 'ration-apply') || services.find(s => s.name.toLowerCase().includes('ration')) || null;
  }
  if (q.includes('ayushman') || q.includes('golden card') || q.includes('pmjay') || q.includes('pm-jay')) {
    return services.find(s => s.id === 'ayushman-card') || services.find(s => s.name.toLowerCase().includes('ayushman')) || null;
  }
  if (q.includes('pm kisan') || q.includes('kisan samman') || q.includes('land seeding')) {
    return services.find(s => s.id === 'pm-kisan') || services.find(s => s.name.toLowerCase().includes('kisan')) || null;
  }
  if (q.includes('shram') || q.includes('shramik') || q.includes('labour card')) {
    return services.find(s => s.id === 'eshram-card') || services.find(s => s.name.toLowerCase().includes('shram')) || null;
  }
  if (q.includes('electricity') || q.includes('bijli') || q.includes('light bill') || q.includes('uppcl')) {
    return services.find(s => s.id === 'electricity-bill') || services.find(s => s.name.toLowerCase().includes('electricity')) || null;
  }
  if (q.includes('train') || q.includes('irctc') || q.includes('railway ticket')) {
    return services.find(s => s.id === 'train-booking') || services.find(s => s.name.toLowerCase().includes('train')) || null;
  }
  if (q.includes('flight') || q.includes('air ticket') || q.includes('plane ticket')) {
    return services.find(s => s.id === 'flight-domestic') || services.find(s => s.name.toLowerCase().includes('flight')) || null;
  }
  if (q.includes('income certificate') || q.includes('aay praman') || q.includes('aay praman patra')) {
    return services.find(s => s.id === 'income-certificate') || services.find(s => s.name.toLowerCase().includes('income')) || null;
  }
  if (q.includes('caste certificate') || q.includes('jati praman') || q.includes('jati praman patra')) {
    return services.find(s => s.id === 'caste-certificate') || services.find(s => s.name.toLowerCase().includes('caste')) || null;
  }
  if (q.includes('domicile') || q.includes('niwas') || q.includes('residence certificate')) {
    return services.find(s => s.id === 'domicile-certificate') || services.find(s => s.name.toLowerCase().includes('domicile')) || null;
  }
  if (q.includes('birth certificate') || q.includes('janam praman')) {
    return services.find(s => s.id === 'birth-certificate') || services.find(s => s.name.toLowerCase().includes('birth')) || null;
  }
  if (q.includes('driving') || q.includes('licence') || q.includes('license') || q.includes('dl')) {
    return services.find(s => s.id === 'dl-apply') || services.find(s => s.name.toLowerCase().includes('driving')) || null;
  }
  if (q.includes('itr') || q.includes('income tax return') || q.includes('tax filing')) {
    return services.find(s => s.id === 'itr-filing') || services.find(s => s.name.toLowerCase().includes('itr')) || null;
  }
  if (q.includes('gst')) {
    return services.find(s => s.id === 'gst-registration') || services.find(s => s.name.toLowerCase().includes('gst')) || null;
  }
  if (q.includes('pension') || q.includes('vridha') || q.includes('vidhwa') || q.includes('divyang')) {
    return services.find(s => s.id === 'old-age-pension') || services.find(s => s.name.toLowerCase().includes('pension')) || null;
  }
  if (q.includes('aeps') || q.includes('cash withdrawal') || q.includes('fingerprint atm') || q.includes('aadhaar atm')) {
    return services.find(s => s.id === 'cash-withdrawal') || services.find(s => s.name.toLowerCase().includes('withdrawal')) || null;
  }
  if (q.includes('money transfer') || q.includes('dmt') || q.includes('send money')) {
    return services.find(s => s.id === 'money-transfer') || services.find(s => s.name.toLowerCase().includes('transfer')) || null;
  }

  // 3. Substring match across service name
  const nameMatch = services.find(s => s.name.toLowerCase().includes(q));
  if (nameMatch) return nameMatch;

  // 4. Token match across keywords
  const tokens = q.split(/\s+/).filter(t => t.length > 2);
  for (const token of tokens) {
    const match = services.find(s => s.name.toLowerCase().includes(token));
    if (match) return match;
  }

  return null;
}

export function getBotResponse(rawInput: string): Message {
  const q = rawInput.toLowerCase().trim();
  const time = getCurrentTime();

  // 1. GREETINGS
  if (
    q === 'hi' ||
    q === 'hello' ||
    q === 'hey' ||
    q === 'namaste' ||
    q.startsWith('good morning') ||
    q.startsWith('good afternoon') ||
    q.startsWith('good evening')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `Namaste! 🙏 Welcome to **Gupta Enterprises**.\n\nI am your digital citizen assistant. How can I assist you today? You can select any quick option below or ask about our services, required documents, timings, and location.`,
      showQuickOptions: true,
      timestamp: time,
      links: [
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink(), variant: 'whatsapp' },
        { label: '📞 Call +91 87565 57994', href: `tel:${CONTACT.phoneTel}`, variant: 'call' },
      ],
    };
  }

  // 2. QUICK OPTION: CSC SERVICES
  if (
    q.includes('csc services') ||
    q === 'csc' ||
    q.includes('common service') ||
    q.includes('digital seva') ||
    q.includes('what services') ||
    q.includes('all services') ||
    q.includes('service list')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `**Gupta Enterprises** is your authorized **Common Service Centre (CSC)** & Digital Seva Kendra in Pipraich, Gorakhpur.\n\nWe provide 70+ government and digital citizen services under one roof:\n\n• **🪪 ID & Documents**: Aadhaar updates, PAN Card, Voter ID, Passport\n• **📜 Certificates**: Income, Caste, Domicile, Birth & Death certificates\n• **🏛️ Government Schemes**: Ayushman Bharat, PM Kisan, E-Shram, Pensions\n• **🏦 Banking & AEPS**: Biometric cash withdrawal, DMT, Account opening\n• **⚡ Utility Bills**: UPPCL Electricity, Water, Gas booking, FASTag recharge\n• **✈️ Travel Bookings**: Train (IRCTC), Flights, and Bus tickets`,
      documents: [
        'Original Aadhaar Card (primary identity proof)',
        'Active mobile number (for OTP verification)',
        'Bank Passbook / Cancelled Cheque (for welfare schemes & banking)',
        'Passport-size photographs (2 to 4 copies)',
      ],
      links: [
        { label: '📂 Browse All 70+ Services', to: '/services', variant: 'primary' },
        { label: '📋 Documents Required Hub', to: '/documents', variant: 'secondary' },
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink('CSC Services'), variant: 'whatsapp' },
      ],
      timestamp: time,
    };
  }

  // 3. QUICK OPTION: AADHAAR SERVICES
  if (
    q.includes('aadhaar services') ||
    q.includes('aadhar') ||
    q.includes('aadhaar') ||
    q.includes('uidai') ||
    q.includes('uid')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `We provide complete **Aadhaar-related Assistance** at Gupta Enterprises:\n\n• **Demographic Updates**: Address change, name correction, and date of birth update\n• **Mobile & Email Linking**: Assistance with mobile linkage verification\n• **e-Aadhaar Download & Print**: Instant printout & Official PVC Aadhaar Card ordering\n• **Document Update**: 10-year mandated UIDAI document revalidation`,
      documents: [
        'Existing Aadhaar card or 12-digit UID number',
        'Valid Proof of Identity (POI) / Proof of Address (POA)',
        'Active mobile phone for UIDAI OTP authentication',
      ],
      links: [
        { label: '🔐 Aadhaar Service Details', to: '/services/aadhaar-update', variant: 'primary' },
        { label: '📋 View Required Documents', to: '/documents?service=aadhaar-update', variant: 'secondary' },
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink('Aadhaar Services'), variant: 'whatsapp' },
      ],
      timestamp: time,
    };
  }

  // 4. QUICK OPTION: PAN CARD
  if (
    q.includes('pan card') ||
    q === 'pan' ||
    q.includes('nsdl') ||
    q.includes('uti') ||
    q.includes('utitsl') ||
    q.includes('epan')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `We offer authorized **PAN Card Services** (NSDL / UTIITSL):\n\n• **New PAN Card Application** (Form 49A for Indian citizens)\n• **PAN Correction / Update**: Name, Father's Name, DOB, or Photo/Signature correction (CSF Form)\n• **PAN - Aadhaar Linkage**: Mandatory linkage compliance\n• **Instant e-PAN Download & Physical Reprint**`,
      documents: [
        'Aadhaar Card (matching full name and DOB)',
        '2 recent passport-size color photographs',
        'Existing PAN Card copy (required for updates/corrections)',
        'Registered mobile number for digital e-sign OTP',
      ],
      links: [
        { label: '🪪 PAN Card Service Details', to: '/services/pan-apply', variant: 'primary' },
        { label: '📋 PAN Documents Checklist', to: '/documents?service=pan-apply', variant: 'secondary' },
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink('PAN Card'), variant: 'whatsapp' },
      ],
      timestamp: time,
    };
  }

  // 5. QUICK OPTION: GOVERNMENT SCHEMES
  if (
    q.includes('government schemes') ||
    q.includes('govt scheme') ||
    q.includes('government scheme') ||
    q.includes('yojana') ||
    q.includes('sarkari scheme')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `We help citizens apply and verify benefits for major Central & State Government Welfare Schemes:\n\n• **Ayushman Bharat (PM-JAY)**: Up to ₹5 Lakh free medical cover per eligible family\n• **PM Kisan Samman Nidhi**: ₹6,000/year farmer installment, e-KYC & land seeding\n• **E-Shram Card**: Social security card for unorganized sector workers\n• **UP Pension Schemes**: Old Age (Vridha), Widow (Vidhwa), and Divyang Pension\n• **PM Awas Yojana (PMAY)** & **PM Vishwakarma Yojana**`,
      documents: [
        'Aadhaar Card of all eligible family members',
        'Bank Passbook with active NPCI/DBT mapping',
        'Ration Card / Parivar Register copy',
        'Khatauni (Land Record) for PM Kisan / Income Certificate for Pensions',
      ],
      links: [
        { label: '🏛️ Browse Government Schemes', to: '/services?cat=government', variant: 'primary' },
        { label: '📋 Scheme Documents Hub', to: '/documents', variant: 'secondary' },
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink('Government Schemes'), variant: 'whatsapp' },
      ],
      timestamp: time,
    };
  }

  // 6. QUICK OPTION: BANKING SERVICES
  if (
    q.includes('banking services') ||
    q.includes('banking') ||
    q.includes('aeps') ||
    q.includes('cash withdrawal') ||
    q.includes('dmt') ||
    q.includes('money transfer') ||
    q.includes('atm')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `As a Customer Service Point (CSP) / DigiPay partner, we provide direct branchless banking:\n\n• **AEPS Cash Withdrawal**: Withdraw cash instantly from any bank using Aadhaar biometric fingerprint\n• **Balance Enquiry & Mini Statement**: Check balance across all Indian banks\n• **Domestic Money Transfer (DMT)**: Send money to any bank account in India 24/7\n• **Account Opening Assistance**: Savings and zero-balance accounts\n• **NPCI / DBT Linking Verification**: Verify account status for direct government benefits`,
      documents: [
        'Original Aadhaar Card (for AEPS biometric verification)',
        'Beneficiary Bank Account Number & IFSC (for money transfer)',
        'Active mobile phone for transaction SMS alerts',
      ],
      links: [
        { label: '🏦 View Banking Services', to: '/services?cat=banking', variant: 'primary' },
        { label: '📋 Banking Documents', to: '/documents?service=cash-withdrawal', variant: 'secondary' },
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink('Banking Services'), variant: 'whatsapp' },
      ],
      timestamp: time,
    };
  }

  // 7. QUICK OPTION: BILL PAYMENTS
  if (
    q.includes('bill payments') ||
    q.includes('bill payment') ||
    q.includes('electricity bill') ||
    q.includes('bijli') ||
    q.includes('bills') ||
    q.includes('recharge') ||
    q.includes('dth') ||
    q.includes('fastag')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `We provide instant bill payments and recharges powered by Bharat Bill Payment System (BBPS):\n\n• **Electricity Bills**: UPPCL Rural (Gramin) and Urban (Nagariya) with instant official receipts\n• **Water Bills & Gas Cylinder Booking**: HP, Indane, and Bharat Gas\n• **Mobile & DTH Recharge**: Airtel, Jio, VI, BSNL, Tata Play, Airtel Digital\n• **FASTag Recharge & Traffic Challan Payments**`,
      documents: [
        'Electricity Consumer Account Number (10 or 12-digit Account ID)',
        'Registered consumer mobile number or Gas Consumer ID',
        'Payment amount in Cash or UPI (Instant official receipt provided!)',
      ],
      links: [
        { label: '⚡ View Bill Payment Services', to: '/services?cat=bills', variant: 'primary' },
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink('Bill Payments'), variant: 'whatsapp' },
      ],
      timestamp: time,
    };
  }

  // 8. QUICK OPTION: CERTIFICATES
  if (
    q.includes('certificates') ||
    q.includes('certificate') ||
    q.includes('edistrict') ||
    q.includes('e-district') ||
    q.includes('praman patra')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `We are an authorized e-District Uttar Pradesh centre for government certificate issuance:\n\n• **Income Certificate (आय प्रमाण पत्र)**: For student scholarships, college admissions & subsidies\n• **Caste Certificate (जाति प्रमाण पत्र)**: General / SC / ST / OBC category verification\n• **Domicile / Residence Certificate (निवास प्रमाण पत्र)**: Official proof of UP residency\n• **Birth & Death Certificates**: Registration and application support`,
      documents: [
        'Aadhaar Card of the applicant',
        'Ration Card / Parivar Register Nakal copy',
        'Self-declaration form (स्वप्रमाणित घोषणा पत्र) - available at our centre',
        'Passport-size photograph',
      ],
      links: [
        { label: '📜 View Certificates Catalogue', to: '/services?cat=certificates', variant: 'primary' },
        { label: '📋 Income Certificate Documents', to: '/documents?service=income-certificate', variant: 'secondary' },
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink('Certificates'), variant: 'whatsapp' },
      ],
      timestamp: time,
    };
  }

  // 9. QUICK OPTION: REQUIRED DOCUMENTS
  if (
    q.includes('required documents') ||
    q.includes('documents required') ||
    q === 'documents' ||
    q.includes('what documents') ||
    q.includes('kagaz') ||
    q.includes('what to bring')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `Document requirements vary depending on the service you wish to avail.\n\n**Standard Citizen Kit for Centre Visits:**\n• **Original Aadhaar Card** (make sure your registered mobile is active for OTP)\n• **2 to 4 recent passport-size photographs**\n• **Bank Passbook** or cancelled cheque (with clear IFSC and Account Number)\n• **Existing document copy** (e.g. old PAN card, old voter card, or electricity bill)\n• **Ration Card or Parivar Register copy**\n\nYou can look up the complete checklist for all 73 services directly on our Documents hub:`,
      links: [
        { label: '📋 Open Documents Required Hub', to: '/documents', variant: 'primary' },
        { label: '💬 Ask on WhatsApp (+91 8756557994)', href: waLink('Document Requirements'), variant: 'whatsapp' },
      ],
      timestamp: time,
    };
  }

  // 10. QUICK OPTION: BUSINESS HOURS & TIMINGS
  if (
    q.includes('business hours') ||
    q.includes('opening hours') ||
    q.includes('timings') ||
    q.includes('timing') ||
    q.includes('hours') ||
    q.includes('open') ||
    q.includes('close') ||
    q.includes('sunday')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `📍 **Gupta Enterprises Centre Timings & Location:**\n\n🕒 **Monday – Saturday**: 9:00 AM – 8:00 PM\n📅 **Sunday**: Closed (Available on call for urgent requirements)\n\n🏢 **Centre Address**:\nNear Saint Xavier's School, Bhatahat Road, Buddh Nagar, Nagar Panchayat Pipraich, Gorakhpur, Uttar Pradesh - 273152\n\nYou can walk in directly or call us ahead to confirm your visit.`,
      links: [
        { label: '📞 Call +91 87565 57994', href: `tel:${CONTACT.phoneTel}`, variant: 'call' },
        { label: '🗺️ Get Directions on Google Maps', href: CONTACT.mapsUrl, variant: 'primary' },
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink(), variant: 'whatsapp' },
      ],
      timestamp: time,
    };
  }

  // 11. QUICK OPTION: CONTACT US & LOCATION
  if (
    q.includes('contact us') ||
    q.includes('contact') ||
    q.includes('phone') ||
    q.includes('call') ||
    q.includes('whatsapp') ||
    q.includes('email') ||
    q.includes('address') ||
    q.includes('location') ||
    q.includes('where') ||
    q.includes('direction') ||
    q.includes('directions')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `You can reach **Gupta Enterprises** anytime:\n\n📞 **Phone / Call**: +91 87565 57994\n💬 **WhatsApp**: +91 87565 57994\n✉️ **Email**: cscpipraichgkp@gmail.com\n🏢 **Centre Location**: Near Saint Xavier's School, Bhatahat Road, Buddh Nagar, Pipraich, Gorakhpur, UP\n🕒 **Working Hours**: Monday – Saturday, 9:00 AM – 8:00 PM`,
      links: [
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink(), variant: 'whatsapp' },
        { label: '📞 Call +91 87565 57994', href: `tel:${CONTACT.phoneTel}`, variant: 'call' },
        { label: '🗺️ Get Google Maps Directions', href: CONTACT.mapsUrl, variant: 'primary' },
        { label: '✉️ Visit Contact Page', to: '/contact', variant: 'secondary' },
      ],
      timestamp: time,
    };
  }

  // 12. CHARGES / FEES / PRICING
  if (
    q.includes('charge') ||
    q.includes('charges') ||
    q.includes('fee') ||
    q.includes('fees') ||
    q.includes('cost') ||
    q.includes('price') ||
    q.includes('rate') ||
    q.includes('how much')
  ) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `Service charges at Gupta Enterprises are governed by official government portal norms and transparent nominal service rates.\n\nBecause fee structures vary by specific department, state portal, and application type (e.g. fresh, correction, or reprint), please call or WhatsApp us for the exact quote.`,
      links: [
        { label: '💬 WhatsApp for Fee Enquiry', href: waLink('Service charges enquiry'), variant: 'whatsapp' },
        { label: '📞 Call Helpline (+91 87565 57994)', href: `tel:${CONTACT.phoneTel}`, variant: 'call' },
      ],
      timestamp: time,
    };
  }

  // 13. DYNAMIC SEARCH ACROSS 73 CATALOGUE SERVICES
  const matchedService = findMatchingService(q);
  if (matchedService) {
    const docs = matchedService.documents && matchedService.documents.length > 0
      ? matchedService.documents
      : ['Original Aadhaar Card', 'Passport-size photograph', 'Active registered mobile number'];

    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `Yes! We provide **${matchedService.name}** at Gupta Enterprises.\n\n${matchedService.description}\n\n📂 Category: **${matchedService.category}**`,
      documents: docs,
      links: [
        { label: '📄 View Service Details', to: `/services/${matchedService.id}`, variant: 'primary' },
        { label: '📋 Check Required Documents', to: `/documents?service=${matchedService.id}`, variant: 'secondary' },
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink(matchedService.name), variant: 'whatsapp' },
        { label: '📞 Call Centre', href: `tel:${CONTACT.phoneTel}`, variant: 'call' },
      ],
      timestamp: time,
    };
  }

  // 14. CONVERSATIONAL MESSAGES
  if (q.includes('thank') || q.includes('dhanyawad') || q.includes('shukriya')) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `You're welcome! 😊 Is there anything else I can help you with regarding Gupta Enterprises or CSC services?`,
      timestamp: time,
      links: [
        { label: '💬 Chat on WhatsApp', href: waLink(), variant: 'whatsapp' },
        { label: '📞 Call Now', href: `tel:${CONTACT.phoneTel}`, variant: 'call' },
      ],
    };
  }

  if (q.includes('kaise ho') || q.includes('how are you')) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `Main bilkul theek hoon! 🙏 Aap batayein, Gupta Enterprises par aaj aapki kya sahayata kar sakta hoon?`,
      showQuickOptions: true,
      timestamp: time,
    };
  }

  if (q === 'ok' || q === 'okay' || q === 'theek hai' || q === 'acha' || q === 'achha' || q === 'sahi hai') {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `Ji bilkul! 👍 Agar aapko kisi bhi CSC seva, form ya documents ke baare me kuch aur poochna ho toh batayein.`,
      timestamp: time,
      links: [
        { label: '📂 Browse All Services', to: '/services', variant: 'primary' },
        { label: '💬 Chat on WhatsApp', href: waLink(), variant: 'whatsapp' },
      ],
    };
  }

  if (q.includes('samajh nahi') || q.includes('simple') || q.includes('aasan')) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `Aap bilkul fikar na karein! Aap humare centre **Gupta Enterprises (Pipraich, Gorakhpur)** par aakar ya seedhe call/WhatsApp par poori jankari aasan bhasha me le sakte hain:\n\n• **Centre Address:** Near Saint Xavier's School, Bhatahat Road, Pipraich\n• **Helpline:** +91 87565 57994 (Call & WhatsApp)\n• **Hours:** Mon - Sat, 9:00 AM - 8:00 PM`,
      timestamp: time,
      links: [
        { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink(), variant: 'whatsapp' },
        { label: '📞 Call +91 87565 57994', href: `tel:${CONTACT.phoneTel}`, variant: 'call' },
        { label: '🗺️ Get Directions', href: CONTACT.mapsUrl, variant: 'primary' },
      ],
    };
  }

  if (q.includes('aur batao') || q.includes('kya kya') || q.includes('aur kya')) {
    return {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: `**Gupta Enterprises** par aapko milti hain 70+ Digital & CSC Sevaayein:\n\n• **Aadhaar Services**: Update, Correction, PVC Card Print\n• **PAN Card**: Naya PAN, Sudhar, e-PAN\n• **Certificates**: Aay, Jati, Niwas Praman Patra\n• **Govt Schemes**: Ayushman Bharat (₹5 Lakh muft ilaaj), PM Kisan, Pension\n• **Banking**: Aadhaar se paise nikaalna (AEPS), Money Transfer\n• **Bills & Tickets**: Bijli bill, Train/Flight tickets\n\nAapko kis seva ke baare me jaanna hai?`,
      showQuickOptions: true,
      timestamp: time,
      links: [
        { label: '📂 All 70+ Services', to: '/services', variant: 'primary' },
        { label: '💬 WhatsApp (+91 8756557994)', href: waLink(), variant: 'whatsapp' },
      ],
    };
  }

  // 15. NATURAL HELPFUL RESPONSE
  return {
    id: Math.random().toString(36).substring(2, 9),
    role: 'bot',
    text: `Namaste! 🙏 Welcome to **Gupta Enterprises**.\n\nAap humse kisi bhi CSC seva (Aadhaar, PAN, Certificates, Banking, Government Schemes, Bill Payments) ke baare me pooch sakte hain.\n\nKisi bhi jaankari ya sahayata ke liye aap humari helpline par seedhe sampark kar sakte hain:`,
    showQuickOptions: true,
    links: [
      { label: '💬 Chat on WhatsApp (+91 8756557994)', href: waLink(), variant: 'whatsapp' },
      { label: '📞 Call +91 87565 57994', href: `tel:${CONTACT.phoneTel}`, variant: 'call' },
      { label: '✉️ Visit Contact Page', to: '/contact', variant: 'secondary' },
      { label: '🗺️ Get Directions', href: CONTACT.mapsUrl, variant: 'secondary' },
    ],
    timestamp: time,
  };
}

function detectServiceIntent(text: string): string | null {
  const t = text.toLowerCase();
  if (t.includes('pan')) return 'PAN Card Assistance';
  if (t.includes('aadhaar') || t.includes('aadhar')) return 'Aadhaar Update / Correction';
  if (t.includes('income certificate') || t.includes('aay praman')) return 'Income Certificate (आय प्रमाण पत्र)';
  if (t.includes('caste certificate') || t.includes('jati praman')) return 'Caste Certificate (जाति प्रमाण पत्र)';
  if (t.includes('domicile') || t.includes('niwas')) return 'Domicile Certificate (निवास प्रमाण पत्र)';
  if (t.includes('certificate') || t.includes('praman')) return 'Government Certificate Service';
  if (t.includes('ayushman') || t.includes('golden card')) return 'Ayushman Bharat Golden Card';
  if (t.includes('kisan') || t.includes('pm kisan')) return 'PM Kisan Samman Nidhi';
  if (t.includes('shram') || t.includes('labour')) return 'E-Shram Card Registration';
  if (t.includes('aeps') || t.includes('cash withdrawal') || t.includes('banking')) return 'AEPS Cash Withdrawal (Banking)';
  if (t.includes('bill') || t.includes('bijli') || t.includes('electricity')) return 'Electricity Bill Payment (UPPCL)';
  if (t.includes('passport')) return 'Passport Assistance';
  if (t.includes('voter')) return 'Voter ID Card';
  if (t.includes('ration') || t.includes('rashan')) return 'Ration Card Service';
  if (t.includes('pension')) return 'UP Pension Scheme';
  if (t.includes('train') || t.includes('irctc')) return 'Train Ticket Booking';
  if (t.includes('flight')) return 'Flight Ticket Booking';
  return null;
}

function getChatSessionId(): string {
  try {
    let sid = sessionStorage.getItem('gupta_chat_session_id');
    if (!sid) {
      sid = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      sessionStorage.setItem('gupta_chat_session_id', sid);
    }
    return sid;
  } catch {
    return `sess_${Date.now()}`;
  }
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const { openEnquiryModal } = useEnquiry();
  const sessionId = useRef(getChatSessionId()).current;

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      text: WELCOME_TEXT,
      showQuickOptions: true,
      timestamp: getCurrentTime(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, open, isTyping]);

  async function handleSend(textToSend: string) {
    if (!textToSend.trim() || isTyping) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'user',
      text: textToSend.trim(),
      timestamp: getCurrentTime(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    let finalBotText = '';
    let finalLinks: ChatLink[] | undefined = undefined;
    let finalDocs: string[] | undefined = undefined;
    let isFromAi = false;

    try {
      // 1. Prepare conversation history (up to last 10 messages) for multi-turn context
      const history = newMessages
        .filter(m => m.id !== 'welcome')
        .slice(-10)
        .map(m => ({
          role: m.role === 'user' ? ('user' as const) : ('model' as const),
          text: m.text,
        }));

      // 2. Call server-side Gemini API endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: textToSend.trim(),
          history,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.text && data.text.trim()) {
          finalBotText = data.text;
          finalLinks = data.links;
          finalDocs = data.documents;
          isFromAi = true;
        }
      }
    } catch (err) {
      console.warn('[Chatbot] Gemini API request failed, switching to local engine fallback:', err);
    }

    // 3. Fallback to local intelligent response engine if Gemini API is unavailable, no key, or fails
    if (!finalBotText) {
      const botResponse = getBotResponse(textToSend);
      finalBotText = botResponse.text;
      finalLinks = botResponse.links;
      finalDocs = botResponse.documents;
    }

    // 4. Detect service intent
    const detectedService = detectServiceIntent(textToSend + ' ' + finalBotText);

    const botMessage: Message = {
      id: Math.random().toString(36).substring(2, 9),
      role: 'bot',
      text: finalBotText,
      links: finalLinks,
      documents: finalDocs,
      isAi: isFromAi,
      detectedService,
      timestamp: getCurrentTime(),
    };

    setMessages(prev => [...prev, botMessage]);
    setIsTyping(false);

    // 5. Store conversation record in Supabase / Local storage
    recordChatQuery({
      sessionId,
      userMessage: textToSend.trim(),
      aiResponse: finalBotText,
      detectedService,
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    handleSend(input);
  }

  function handleResetChat() {
    setMessages([
      {
        id: 'welcome-' + Date.now(),
        role: 'bot',
        text: WELCOME_TEXT,
        showQuickOptions: true,
        timestamp: getCurrentTime(),
      },
    ]);
  }

  function formatText(text: string) {
    return text.split('\n').map((line, i) => {
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return (
        <span key={i} className="block leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: formatted }} />
        </span>
      );
    });
  }

  return (
    <>
      {/* ── CHAT WINDOW ──────────────────────────────────────────────────────── */}
      {open && (
        <div
          className="fixed bottom-20 left-3 right-3 sm:left-auto sm:right-6 sm:bottom-24 w-auto sm:w-[410px] h-[550px] max-h-[calc(100vh-100px)] bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden z-[1100] animate-in fade-in zoom-in-95 duration-150"
          role="dialog"
          aria-label="Gupta Enterprises Smart Assistant"
        >
          {/* Header */}
          <div className="bg-[#1a3a8f] text-white px-4 py-3 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-white/15 border border-white/20 flex items-center justify-center text-lg shadow-inner">
                🤖
              </div>
              <div>
                <div className="font-semibold text-sm font-['Poppins'] tracking-tight flex items-center gap-1.5">
                  Gupta Enterprises
                  <span className="text-[10px] font-normal px-1.5 py-0.5 rounded bg-blue-500/40 text-blue-100 border border-blue-300/30">
                    CSC
                  </span>
                </div>
                <div className="text-blue-200 text-[11px] flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Smart Assistant (AI Ready)</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1 text-white/80">
              {/* WhatsApp direct shortcut */}
              <a
                href={waLink()}
                target="_blank"
                rel="noopener noreferrer"
                title="Chat on WhatsApp (+91 8756557994)"
                className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center text-[#25d366] hover:text-[#25d366] transition-colors"
                aria-label="Direct WhatsApp"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>

              {/* Reset conversation */}
              <button
                onClick={handleResetChat}
                title="Restart chat"
                className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center hover:text-white transition-colors"
                aria-label="Restart chat"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>

              {/* Close window */}
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 rounded-lg hover:bg-white/15 flex items-center justify-center hover:text-white transition-colors"
                aria-label="Close assistant"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick WhatsApp Bar (Requirement 7) */}
          <div className="bg-emerald-50 border-b border-emerald-100 px-3.5 py-1.5 flex items-center justify-between text-[11px] text-emerald-800">
            <div className="flex items-center gap-1.5 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Direct WhatsApp Help:</span>
              <span className="font-semibold text-emerald-900">+91 8756557994</span>
            </div>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-emerald-700 hover:text-emerald-900 underline flex items-center gap-0.5"
            >
              Open
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-[#f8fafc]">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs ${
                    msg.role === 'user'
                      ? 'bg-[#1a3a8f] text-white rounded-br-xs shadow-sm'
                      : 'bg-white text-slate-800 border border-slate-200/80 rounded-bl-xs shadow-sm'
                  }`}
                >
                  {/* Message Text */}
                  {msg.isAi && (
                    <div className="flex items-center gap-1 mb-1 text-[10px] font-semibold text-blue-700">
                      <span>✨ Gemini AI Assistant</span>
                    </div>
                  )}
                  <div className="space-y-1">{formatText(msg.text)}</div>

                  {/* Required Documents Checklist (Requirement 6) */}
                  {msg.documents && msg.documents.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100">
                      <div className="text-[11px] font-semibold text-slate-800 mb-1 flex items-center gap-1.5">
                        <span>📋</span> Required Documents:
                      </div>
                      <ul className="space-y-1 text-[11px] text-slate-600 pl-0.5">
                        {msg.documents.map((doc, idx) => (
                          <li key={idx} className="flex items-start gap-1.5">
                            <span className="text-emerald-600 font-bold leading-tight">✓</span>
                            <span className="leading-snug">{doc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Interactive Links / Actions (Requirement 6, 7 & 8) */}
                  {msg.links && msg.links.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100 flex flex-wrap gap-1.5">
                      {msg.links.map((link, j) => {
                        const styleClass =
                          link.variant === 'whatsapp'
                            ? 'bg-[#25d366]/10 text-[#128c7e] border-[#25d366]/30 hover:bg-[#25d366]/20 font-semibold'
                            : link.variant === 'call'
                            ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-semibold'
                            : link.variant === 'secondary'
                            ? 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                            : 'bg-[#1a3a8f]/10 text-[#1a3a8f] border-[#1a3a8f]/20 hover:bg-[#1a3a8f]/20 font-semibold';

                        return link.to ? (
                          <Link
                            key={j}
                            to={link.to}
                            onClick={() => setOpen(false)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors inline-flex items-center gap-1 ${styleClass}`}
                          >
                            {link.label}
                          </Link>
                        ) : (
                          <a
                            key={j}
                            href={link.href}
                            target={link.href?.startsWith('http') ? '_blank' : undefined}
                            rel="noopener noreferrer"
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors inline-flex items-center gap-1 ${styleClass}`}
                          >
                            {link.label}
                          </a>
                        );
                      })}
                    </div>
                  )}

                  {/* Would you like Gupta Enterprises to contact you? Card */}
                  {msg.detectedService && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 bg-blue-50/80 -mx-1 px-3 py-2 rounded-xl text-xs space-y-1.5">
                      <div className="text-[11px] font-semibold text-slate-800 flex items-center gap-1.5">
                        <span>🤝</span> Would you like Gupta Enterprises to contact you?
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            openEnquiryModal(msg.detectedService || undefined);
                            setOpen(false);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[#1a3a8f] text-white text-[11px] font-semibold hover:bg-[#122878] shadow-2xs transition-colors flex items-center gap-1 cursor-pointer"
                        >
                          <span>📝</span> Submit Enquiry
                        </button>
                        <a
                          href={waLink(msg.detectedService)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2.5 py-1 rounded-lg bg-[#25d366] text-white text-[11px] font-semibold hover:bg-[#1ebe5d] shadow-2xs transition-colors flex items-center gap-1"
                        >
                          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                          </svg>
                          WhatsApp Us
                        </a>
                      </div>
                    </div>
                  )}
                </div>

                {/* Message Timestamp */}
                <span className="text-[10px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>

                {/* Quick Options Chips (Requirement 4) */}
                {msg.showQuickOptions && (
                  <div className="mt-2 w-full">
                    <div className="text-[11px] font-semibold text-slate-500 mb-1.5 flex items-center gap-1">
                      <span>⚡</span> Quick Inquiries:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {QUICK_OPTIONS.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => handleSend(opt)}
                          className="text-[11px] px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-[#1a3a8f] text-slate-700 hover:text-[#1a3a8f] hover:bg-blue-50/70 font-medium transition-colors shadow-2xs text-left"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator (Requirement 9) */}
            {isTyping && (
              <div className="flex items-center gap-2 bg-white border border-slate-200 text-slate-500 text-xs px-3.5 py-2 rounded-2xl w-fit shadow-xs">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a8f] animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a8f] animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a3a8f] animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-[11px] text-slate-500 font-medium">Assistant is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick summon buttons bar */}
          <div className="px-3 py-1.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px]">
            <button
              type="button"
              onClick={() => handleSend('CSC Services')}
              className="text-slate-600 hover:text-[#1a3a8f] flex items-center gap-1 transition-colors"
            >
              <span>📂</span> All Services
            </button>
            <button
              type="button"
              onClick={() => handleSend('Required Documents')}
              className="text-slate-600 hover:text-[#1a3a8f] flex items-center gap-1 transition-colors"
            >
              <span>📋</span> Documents
            </button>
            <button
              type="button"
              onClick={() => handleSend('Business Hours')}
              className="text-slate-600 hover:text-[#1a3a8f] flex items-center gap-1 transition-colors"
            >
              <span>🕒</span> Hours
            </button>
            <a
              href={waLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#128c7e] hover:text-emerald-700 font-medium flex items-center gap-1 transition-colors"
            >
              <span>💬</span> WhatsApp
            </a>
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSubmit}
            className="p-2.5 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isTyping}
              placeholder={isTyping ? "Assistant is typing..." : "Ask about services, documents, timings..."}
              className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-[#1a3a8f]/20 focus:border-[#1a3a8f] transition-all disabled:bg-slate-50"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 rounded-xl bg-[#1a3a8f] text-white flex items-center justify-center hover:bg-[#122878] disabled:opacity-40 disabled:hover:bg-[#1a3a8f] transition-all shadow-xs shrink-0"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      )}

      {/* ── FLOATING CHAT LAUNCHER BUTTON (Requirement 1) ────────────────────── */}
      <button
        onClick={() => setOpen(!open)}
        className={`fixed bottom-20 right-4 md:bottom-6 md:right-6 w-14 h-14 rounded-full shadow-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 z-[1000] ${
          open
            ? 'bg-slate-800 text-white hover:bg-slate-900 shadow-slate-400/50'
            : 'bg-[#1a3a8f] text-white hover:bg-[#122878] shadow-blue-900/30'
        }`}
        aria-label={open ? 'Close chat assistant' : 'Open chat assistant'}
        title="Chat with Gupta Assistant"
      >
        {open ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <div className="relative flex items-center justify-center">
            {/* Chat bubble icon */}
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
            </svg>
          </div>
        )}

        {/* Online Status Pulse Beacon */}
        {!open && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-white" />
          </span>
        )}
      </button>
    </>
  );
}
