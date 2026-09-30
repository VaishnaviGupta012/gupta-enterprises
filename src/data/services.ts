/**
 * Gupta Enterprises - Services Catalogue Data
 *
 * This file contains the complete list of citizen services offered at
 * Gupta Enterprises (CSC & Digital Seva Kendra, Pipraich, Gorakhpur).
 *
 * Organized into 5 clear categories:
 * 1. Government Documents
 * 2. Certificates & Schemes
 * 3. Financial & Business
 * 4. Education & Online Services
 * 5. Travel & Other Services
 */

export type ServiceStatus = "available" | "enquire"

export type CategoryId = "all" | "aadhaar-identity" | "pan-card" | "voter-id" | "gov-certificates" | "banking-financial" | "gov-schemes" | "passport-travel" | "education-forms" | "business-services" | "printing-lamination" | "gov-documents" | "certificates-schemes" | "financial-business" | "education-online" | "travel-other"

export interface Service {
  id: string
  name: string
  category: string
  categoryId: CategoryId
  icon: string
  status: ServiceStatus
  shortDescription: string
  whatIsThis: string
  documents: string[]
  steps: string[]
  importantNotes?: string[]
  popular?: boolean
}

export interface Category {
  id: CategoryId
  label: string
  icon: string
  description: string
}

export const categories: Category[] = [
  {
    id: "all",
    label: "All Services",
    icon: "⊞",
    description: "Browse all digital and citizen assistance services.",
  },
  {
    id: "aadhaar-identity",
    label: "Aadhaar & Identity",
    icon: "🪪",
    description:
      "Aadhaar update, e-Aadhaar PVC card printing, and Ration card assistance.",
  },
  {
    id: "pan-card",
    label: "PAN Card",
    icon: "💳",
    description:
      "New instant PAN application, correction, reprint, and Aadhaar linking.",
  },
  {
    id: "voter-id",
    label: "Voter ID",
    icon: "🗳️",
    description:
      "New Voter registration, correction, assembly shift, and EPIC card download.",
  },
  {
    id: "gov-certificates",
    label: "Government Certificates",
    icon: "📜",
    description:
      "e-District verified Income, Caste, Domicile, and Birth/Death certificates.",
  },
  {
    id: "banking-financial",
    label: "Banking & Financial Services",
    icon: "🏦",
    description:
      "AePS biometric cash withdrawal, DigiPay banking, electricity and utility bills.",
  },
  {
    id: "gov-schemes",
    label: "Government Schemes",
    icon: "🏛️",
    description:
      "Ayushman Bharat Golden Card, e-Shram, PM Kisan, PM SVANidhi, and Labour Card.",
  },
  {
    id: "passport-travel",
    label: "Passport & Travel",
    icon: "✈️",
    description:
      "Passport seva, Driving licence, Vehicle RC, IRCTC Train, Bus, and Flight booking.",
  },
  {
    id: "education-forms",
    label: "Education & Online Forms",
    icon: "🎓",
    description:
      "Scholarship forms, NIELIT CCC, IGNOU admissions, DigiLocker, and EPFO PF claims.",
  },
  {
    id: "business-services",
    label: "Business Services",
    icon: "💼",
    description:
      "GST, Income Tax Return (ITR), MSME/Udyam, FSSAI, PMEGP, MUDRA loans.",
  },
  {
    id: "printing-lamination",
    label: "Printing / Scanning / Lamination",
    icon: "🖨️",
    description:
      "High-speed color printing, Xerox, document scanning, lamination, and passport photos.",
  },
]

export const services: Service[] = [
  // ──────────────────────────────────────────────────────────────────────────
  // 1. GOVERNMENT DOCUMENTS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "aadhaar-update",
    name: "Aadhaar Related Services",
    category: "Voter ID",
    categoryId: "voter-id",
    icon: "🔐",
    status: "available",
    popular: true,
    shortDescription:
      "Assistance for demographic updates (name, address, DOB), mobile linkage, and 10-year document revalidation.",
    whatIsThis:
      "Aadhaar is India's 12-digit unique identity number. At Gupta Enterprises, we assist citizens in updating demographic details on their Aadhaar card, verifying registered mobile numbers, and uploading mandated 10-year Proof of Identity (POI) and Proof of Address (POA) documents.",
    documents: [
      "Original Aadhaar card or 12-digit UID number",
      "Valid Proof of Address (e.g., Bank Passbook, Ration Card, Voter ID, or Electricity Bill)",
      "Proof of Identity / Date of Birth (for name or DOB corrections)",
      "Active mobile number linked with Aadhaar (for OTP verification)",
    ],
    steps: [
      "Identify the specific correction or document update needed.",
      "Verify eligible supporting documents at Gupta Enterprises.",
      "Complete assisted portal filing and upload clear document scans.",
      "Receive your official acknowledgement slip (URN) to track update status.",
    ],
    importantNotes: [
      "Biometric updates (iris and fingerprints) can only be done at authorized bank/post office enrolment centres.",
      "Mobile number must be active to receive UIDAI OTP.",
    ],
  },
  {
    id: "aadhaar-pvc",
    name: "e-Aadhaar & PVC Card Printing",
    category: "Aadhaar & Identity",
    categoryId: "aadhaar-identity",
    icon: "💳",
    status: "available",
    popular: true,
    shortDescription:
      "Instant download and high-quality durable PVC plastic card printing with QR code.",
    whatIsThis:
      "Order your official UIDAI PVC Aadhaar card or get instant high-resolution plastic card printing for your downloaded e-Aadhaar. PVC cards are wallet-friendly, waterproof, and feature secure holograms and QR codes.",
    documents: [
      "Aadhaar number or Enrolment ID (EID)",
      "Registered mobile phone for receiving OTP",
    ],
    steps: [
      "Provide your Aadhaar number to initiate e-Aadhaar download.",
      "Authenticate with the one-time OTP received on your mobile.",
      "Download secure password-protected e-Aadhaar PDF.",
      "Print on durable PVC plastic card with vivid colors and protective coat.",
    ],
    importantNotes: [
      "If mobile number is not linked, we can assist you with official non-registered mobile PVC ordering through UIDAI.",
    ],
  },
  {
    id: "pan-apply",
    name: "PAN Card (New & Correction)",
    category: "PAN Card",
    categoryId: "pan-card",
    icon: "🪪",
    status: "available",
    popular: true,
    shortDescription:
      "Apply for fresh PAN card (Form 49A), name/DOB corrections (CSF), or instant e-PAN download.",
    whatIsThis:
      "A Permanent Account Number (PAN) is an essential 10-digit alphanumeric identifier required for banking, tax filings, vehicle purchases, and business transactions. We provide complete application assistance for fresh PAN cards, minor PAN, and correction of spelling errors.",
    documents: [
      "Aadhaar Card (name and date of birth must match applicant records)",
      "2 passport-size color photographs (with white or light background)",
      "Copy of existing PAN card (only for correction or reprint)",
      "Active mobile number and email ID",
    ],
    steps: [
      "Fill Form 49A (New) or CSF Form (Correction) with our assisted support.",
      "Verify details against Aadhaar records to prevent mismatches.",
      "Submit government processing fee and capture digital e-sign.",
      "Instant e-PAN is delivered to your email in 2-3 working days; physical PVC card arrives by India Post.",
    ],
    importantNotes: [
      "Linking Aadhaar with PAN is mandatory under Income Tax regulations.",
    ],
  },
  {
    id: "voter-id",
    name: "Voter ID (New & Correction)",
    category: "Voter ID",
    categoryId: "voter-id",
    icon: "🗳️",
    status: "available",
    popular: true,
    shortDescription:
      "New voter registration (Form 6), address change / correction (Form 8), and e-EPIC download.",
    whatIsThis:
      "The Voter Identity Card (EPIC) is issued by the Election Commission of India. We help citizens aged 18+ enroll as new voters, update shifted addresses, correct names or photos, and download digital e-EPIC cards on their mobile phones.",
    documents: [
      "Aadhaar card or Class 10th marksheet for age proof (must be 18+)",
      "Current residence address proof",
      "Passport-size photograph",
      "Existing Voter ID number (for correction or address shift)",
    ],
    steps: [
      "Fill Form 6 (new voter) or Form 8 (correction/shift) on the Election Commission portal.",
      "Upload verified identity, address, and photograph proofs.",
      "Obtain online reference tracking number.",
      "Local BLO (Booth Level Officer) verifies the application before card dispatch.",
    ],
    importantNotes: [
      "Any citizen turning 18 on or before the qualifying date can submit an advance application.",
    ],
  },
  {
    id: "passport-apply",
    name: "Passport Application Assistance",
    category: "Passport & Travel",
    categoryId: "passport-travel",
    icon: "🛂",
    status: "available",
    popular: true,
    shortDescription:
      "End-to-end guidance for fresh passport, renewal, document upload, and PSK appointment booking.",
    whatIsThis:
      "Applying for an Indian Passport involves online portal registration, form filing, government fee payment, and appointment booking at the nearest Passport Seva Kendra (PSK/POPSK). We guide you through the entire process to prevent appointment cancellations or document rejections.",
    documents: [
      "Aadhaar card (matching name, father's name, and date of birth)",
      "Proof of Date of Birth (Birth Certificate or 10th Marksheet/TC)",
      "Current address proof (Bank passbook with photo, Voter ID, or Electricity bill)",
      "Old passport (if applying for reissue/renewal)",
    ],
    steps: [
      "Create Passport Seva online profile and fill application form.",
      "Upload required documents in prescribed formats.",
      "Pay official passport fee and book PSK Gorakhpur or Lucknow slot.",
      "Receive printed application receipt and document checklist for PSK visit.",
    ],
    importantNotes: [
      "Police verification is conducted at your permanent address after the PSK appointment.",
    ],
  },
  {
    id: "ration-card",
    name: "Ration Card Assistance",
    category: "Aadhaar & Identity",
    categoryId: "aadhaar-identity",
    icon: "📦",
    status: "available",
    shortDescription:
      "New UP FCS ration card application, addition of newborn family members, and e-ration slip download.",
    whatIsThis:
      "Ration cards under the National Food Security Act (NFSA) ensure subsidized grains and serve as primary family identity proof. We assist families in Uttar Pradesh with new card applications (AAY/PHH), adding daughter-in-law or newborn members, and splitting cards.",
    documents: [
      "Aadhaar cards of all family members",
      "Income Certificate of the head of family (महिला मुखिया)",
      "Bank passbook copy of female head of family",
      "Family photograph (group photo)",
      "LPG gas connection details (if any)",
    ],
    steps: [
      "Compile Aadhaar details of all family members.",
      "Submit online application through UP Food & Civil Supplies portal.",
      "Print copy of online submission form.",
      "Submit hard copies to the local Tehsil / Supply Inspector (Aapoorti Adhikari) for field verification.",
    ],
  },
  {
    id: "driving-licence",
    name: "Driving Licence Assistance",
    category: "Passport & Travel",
    categoryId: "passport-travel",
    icon: "🚗",
    status: "available",
    popular: true,
    shortDescription:
      "Learner's Licence (LL) application, online LL exam assistance, permanent DL slot booking, and renewal.",
    whatIsThis:
      "We provide complete assistance on the Parivahan Sarathi portal for getting a Learner's Driving Licence, booking RTO driving test appointments, renewing expired licences, and applying for duplicate licence or address change.",
    documents: [
      "Aadhaar Card (with active registered mobile number for e-KYC)",
      "Proof of Date of Birth (10th marksheet or Birth certificate)",
      "Blood group details",
      "Passport-size photograph and signature scan",
      "Medical certificate Form 1A (for commercial licence or age 40+)",
    ],
    steps: [
      "Apply online on Sarathi Parivahan with Aadhaar e-KYC.",
      "Pay official RTO fee for motorcycle / light motor vehicle (LMV).",
      "Take online learner license test or book RTO slot.",
      "Download Learner's Licence and book permanent DL driving track test after 30 days.",
    ],
  },
  {
    id: "vehicle-rc",
    name: "Vehicle RC Services",
    category: "Passport & Travel",
    categoryId: "passport-travel",
    icon: "🏍️",
    status: "enquire",
    shortDescription:
      "Registration Certificate (RC) address change, duplicate RC, HP termination (hypothecation loan removal), and road tax.",
    whatIsThis:
      "Assistance for Parivahan Vahan portal citizen services for bikes, cars, and commercial vehicles. We help vehicle owners apply for RC transfer, update their residential address, remove bank loan hypothecation after loan payoff, and pay pending road tax.",
    documents: [
      "Original Vehicle Registration Certificate (RC)",
      "Valid Vehicle Insurance policy",
      "Pollution Under Control Certificate (PUCC)",
      "Owner's Aadhaar card and address proof",
      "Bank NOC and Form 35 (for loan HP removal)",
    ],
    steps: [
      "Review existing vehicle status on Vahan portal.",
      "Fill online application for HP removal, duplicate RC, or address modification.",
      "Pay official transport department fees.",
      "Submit physical dossier to the regional RTO office if required.",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 2. CERTIFICATES & SCHEMES
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "income-cert",
    name: "Income Certificate (आय प्रमाण पत्र)",
    category: "Government Certificates",
    categoryId: "gov-certificates",
    icon: "💰",
    status: "available",
    popular: true,
    shortDescription:
      "Authorized e-District UP application for student scholarships, admissions, welfare schemes, and subsidies.",
    whatIsThis:
      "An Income Certificate is an official document issued by the Revenue Department (Tehsil) certifying the annual earnings of a family. It is strictly required for college scholarships, fee waivers, hospital aid, and government welfare benefits.",
    documents: [
      "Aadhaar card of the applicant",
      "Ration Card copy or Parivar Register Nakal (परिवार रजिस्टर की नकल)",
      "Self-declaration certificate (स्वप्रमाणित घोषणा पत्र — provided at centre)",
      "Passport-size photograph",
      "Salary slip or Patwari / Gram Pradhan verification report (if available)",
    ],
    steps: [
      "Fill e-District Uttar Pradesh application form at Gupta Enterprises.",
      "Upload verified self-declaration, photograph, and identity documents.",
      "Pay nominal government portal fee and receive application registration number.",
      "Lekhpal verifies field earnings; digitally signed certificate is ready for download in 7-12 days.",
    ],
    importantNotes: [
      "Certificate remains valid for 3 years from the date of issue in Uttar Pradesh.",
    ],
  },
  {
    id: "caste-cert",
    name: "Caste Certificate (जाति प्रमाण पत्र)",
    category: "Government Certificates",
    categoryId: "gov-certificates",
    icon: "📋",
    status: "available",
    popular: true,
    shortDescription:
      "State & Central SC, ST, and OBC caste certificates through e-District for reservations and government jobs.",
    whatIsThis:
      "A Caste Certificate validates that an individual belongs to a particular category (SC, ST, or OBC). It is essential for claiming educational quotas, fee concessions, government job reservations, and targeted social welfare schemes.",
    documents: [
      "Applicant's Aadhaar card",
      "Paternal family caste proof (father/uncle caste certificate or old land record)",
      "Ration card or Parivar Register copy",
      "Passport-size photograph and signed self-declaration form",
    ],
    steps: [
      "Select State (UP) or Central Government format.",
      "Upload applicant details and ancestral lineage proof.",
      "Submit application to the respective Tehsil through e-District.",
      "Download digitally signed barcode-verified certificate upon approval.",
    ],
  },
  {
    id: "domicile-cert",
    name: "Domicile / Residence Certificate (निवास प्रमाण पत्र)",
    category: "Government Certificates",
    categoryId: "gov-certificates",
    icon: "🏠",
    status: "available",
    popular: true,
    shortDescription:
      "Official proof of residence in Uttar Pradesh for educational admissions, government recruitments, and legal work.",
    whatIsThis:
      "A Domicile Certificate (Niwas Praman Patra) is issued by the Sub-Divisional Magistrate (SDM) / Tehsildar certifying permanent residence in the state. It is mandatory for state police recruitments, teacher hiring, and state quota college seats.",
    documents: [
      "Aadhaar card showing local address",
      "Electricity bill, Ration card, or Land Registry copy",
      "Educational certificate showing schooling in Uttar Pradesh",
      "Passport-size photograph & self-declaration",
    ],
    steps: [
      "Submit residence application on e-District portal.",
      "Attach address proof showing minimum required years of living in the area.",
      "Lekhpal verifies local dwelling status.",
      "Receive official digital certificate with QR code validation.",
    ],
  },
  {
    id: "birth-death-cert",
    name: "Birth & Death Certificate Assistance",
    category: "Government Certificates",
    categoryId: "gov-certificates",
    icon: "👶",
    status: "available",
    shortDescription:
      "Assistance with municipal and panchayat birth registration, late registration orders, and death certificate copies.",
    whatIsThis:
      "Official certificates issued under the Registration of Births and Deaths Act. A Birth Certificate is the ultimate proof of age for schooling and passports; a Death Certificate is required for insurance claims, property succession, and bank account settlement.",
    documents: [
      "Hospital discharge summary or institutional birth/death slip",
      "Parents' or deceased person's Aadhaar card",
      "Applicant's Aadhaar and relationship affidavit (if delayed registration)",
      "Gram Panchayat / Ward Member verification letter",
    ],
    steps: [
      "Verify whether registration is timely (within 21 days) or delayed.",
      "Prepare portal filing on Civil Registration System (CRS) or e-Nagarsewa.",
      "Obtain SDM verification order for delayed registrations beyond 1 year.",
      "Download official digital certificate.",
    ],
  },
  {
    id: "ayushman-bharat",
    name: "Ayushman Bharat (PM-JAY)",
    category: "Government Schemes",
    categoryId: "gov-schemes",
    icon: "🏥",
    status: "available",
    popular: true,
    shortDescription:
      "Eligibility check, e-KYC, and Golden Card printing for up to ₹5 Lakh free hospital treatment per year.",
    whatIsThis:
      "Ayushman Bharat Pradhan Mantri Jan Arogya Yojana (PM-JAY) provides cashless medical coverage of up to ₹5 Lakh per year for secondary and tertiary hospitalization across empaneled government and private hospitals in India.",
    documents: [
      "Aadhaar card of the beneficiary (with mobile OTP or biometric fingerprint)",
      "Ration Card (PHH or Antyodaya) or PM-JAY eligibility letter (HHID)",
      "Active mobile phone",
    ],
    steps: [
      "Search name in the SECC-2011 / PMJAY beneficiary database.",
      "Perform biometric or OTP-based e-KYC.",
      "Submit approval request to the district health authority.",
      "Download and print durable plastic Ayushman Golden Card.",
    ],
  },
  {
    id: "eshram-card",
    name: "e-Shram Card Registration",
    category: "Government Schemes",
    categoryId: "gov-schemes",
    icon: "👷",
    status: "available",
    shortDescription:
      "National database registration for unorganized sector workers with 12-digit UAN and accidental cover benefits.",
    whatIsThis:
      "The e-Shram portal by the Ministry of Labour & Employment registers unorganized workers (construction workers, farmers, gig workers, domestic helpers, rickshaw drivers) to ensure direct delivery of social security welfare benefits and accidental insurance.",
    documents: [
      "Aadhaar card",
      "Aadhaar-linked mobile number",
      "Bank savings account number and IFSC code",
      "Occupation details and skill category",
    ],
    steps: [
      "Enter Aadhaar number and complete OTP authentication.",
      "Fill address, educational qualification, and occupation details.",
      "Enter active bank account details for direct benefit transfers (DBT).",
      "Instant generation and laminated printout of 12-digit e-Shram UAN Card.",
    ],
  },
  {
    id: "pm-kisan",
    name: "PM Kisan Samman Nidhi",
    category: "Government Schemes",
    categoryId: "gov-schemes",
    icon: "🌾",
    status: "available",
    popular: true,
    shortDescription:
      "Registration, biometric e-KYC, Aadhaar-bank account seeding check, and land Khatauni verification for ₹6,000/year.",
    whatIsThis:
      "PM-Kisan provides ₹6,000 annually in three equal installments of ₹2,000 directly into the bank accounts of landholding farmer families. We help farmers with mandatory e-KYC, resolving land seeding issues, NPCI Aadhaar bank account mapping, and grievance filing.",
    documents: [
      "Farmer's Aadhaar card",
      "Land revenue records (Khatauni / Khasra copy)",
      "Bank passbook (must be NPCI/DBT active)",
      "Mobile number linked to Aadhaar",
    ],
    steps: [
      "Verify farmer status on PM-Kisan portal.",
      "Perform mandatory biometric fingerprint or OTP e-KYC.",
      "Check NPCI bank mapping to ensure installment amounts are credited.",
      "Submit correction requests for land seeding or bank rejections if installments are stuck.",
    ],
  },
  {
    id: "pm-svanidhi",
    name: "PM SVANidhi Scheme",
    category: "Government Schemes",
    categoryId: "gov-schemes",
    icon: "🛒",
    status: "enquire",
    shortDescription:
      "Collateral-free working capital loan assistance (₹10,000 to ₹50,000) for urban street vendors with cashback incentives.",
    whatIsThis:
      "PM Street Vendor's AtmaNirbhar Nidhi (PM SVANidhi) provides affordable working capital loans to urban street vendors and small stall owners. It starts with ₹10,000 for the 1st tranche and escalates to ₹20,000 and ₹50,000 on timely repayments with digital transaction cashbacks.",
    documents: [
      "Aadhaar card and mobile number",
      "Vending Certificate / Identity Card issued by Nagar Panchayat / Municipal Corporation",
      "Letter of Recommendation (LoR) if vending certificate is absent",
      "Bank passbook and UPI QR code",
    ],
    steps: [
      "Verify vendor registration with local Nagar Panchayat Pipraich records.",
      "Submit loan application on PM SVANidhi portal.",
      "Select preferred lending bank or microfinance institution.",
      "Track loan sanction and disbursement directly into vendor's account.",
    ],
  },
  {
    id: "labour-card",
    name: "Labour Card / Majdur Registration (BOCW)",
    category: "Government Schemes",
    categoryId: "gov-schemes",
    icon: "🔨",
    status: "available",
    shortDescription:
      "UP Building & Other Construction Workers (BOCW) board registration for maternity, cycle, toolkit, and housing aid.",
    whatIsThis:
      "Registered construction and daily-wage labourers under the UP BOCW Board are entitled to multiple financial assistance schemes, including daughter's marriage aid, maternity benefits, children scholarship aid, death/disability compensation, and free bicycle/toolkits.",
    documents: [
      "Aadhaar card of worker",
      "Bank passbook copy",
      "Passport-size photograph",
      "90-day work certificate (नियोजक / ठेकेदार द्वारा 90 दिन कार्य का प्रमाण पत्र)",
      "Ration card or Parivar register copy",
    ],
    steps: [
      "Register on UPBOCW portal with verified work declaration.",
      "Pay nominal annual contribution fee.",
      "Generate Shramik Card with unique registration number.",
      "Apply for specific welfare schemes (Marriage aid, Education scholarship, Toolkit assistance).",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 3. FINANCIAL & BUSINESS
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "gst-services",
    name: "GST Registration & Return Filing",
    category: "Business Services",
    categoryId: "business-services",
    icon: "📊",
    status: "available",
    popular: true,
    shortDescription:
      "New GST number registration for shops and businesses, monthly/quarterly GSTR-1 and GSTR-3B return filing.",
    whatIsThis:
      "Goods and Services Tax (GST) is compulsory for businesses exceeding turnover thresholds or conducting inter-state / e-commerce sales. We assist local merchants, contractors, and startups with new GST registration, composition scheme selection, monthly return filings, and tax challan payments.",
    documents: [
      "PAN card and Aadhaar card of proprietor / partners",
      "Electricity bill of business premises and Rent agreement / NOC",
      "Bank passbook or cancelled cheque with business/owner name",
      "Passport-size photograph",
    ],
    steps: [
      "Collect business details and verify business trade name.",
      "Apply online on the GST portal (Form GST REG-01) with Aadhaar authentication.",
      "Track ARN (Application Reference Number) until GSTIN certificate is granted.",
      "Assist with ongoing monthly/quarterly GSTR-1, GSTR-3B filings.",
    ],
  },
  {
    id: "itr-filing",
    name: "Income Tax Return (ITR) Filing",
    category: "Business Services",
    categoryId: "business-services",
    icon: "📑",
    status: "available",
    popular: true,
    shortDescription:
      "Annual ITR-1, ITR-2, and ITR-4 filing for salaried employees, business owners, pension holders, and loan seekers.",
    whatIsThis:
      "Filing your Income Tax Return is essential for claiming tax refunds (TDS), getting business and personal loans approved, processing foreign visas, and maintaining compliant financial records. We assist individuals and small business owners in computing income and submitting error-free returns.",
    documents: [
      "PAN card and Aadhaar card",
      "Bank statements of all active accounts for the financial year",
      "Form 16 (for salaried persons) or business gross turnover details",
      "Investment receipts (Life insurance, PPF, health insurance) for deductions",
    ],
    steps: [
      "Gather annual income details, interest income, and deductions.",
      "Download Form 26AS and Annual Information Statement (AIS/TIS) from the Income Tax portal.",
      "Compute net taxable income and tax liability.",
      "E-file return and verify instantly via Aadhaar OTP.",
    ],
  },
  {
    id: "msme-udyam",
    name: "MSME / Udyam Registration",
    category: "Business Services",
    categoryId: "business-services",
    icon: "🏭",
    status: "available",
    shortDescription:
      "Government recognition certificate for micro, small, and medium businesses to avail priority bank loans and subsidies.",
    whatIsThis:
      "Udyam Registration is the official zero-fee recognition provided by the Ministry of MSME, Government of India. Having an Udyam certificate makes your enterprise eligible for collateral-free bank loans, subsidized interest rates, electricity tariff concessions, and government tender benefits.",
    documents: [
      "Aadhaar card of the business owner",
      "PAN card of proprietor / business",
      "Business name, type of activity (manufacturing or service), and enterprise address",
      "Bank account number and IFSC code",
    ],
    steps: [
      "Enter Aadhaar number of entrepreneur with OTP verification.",
      "Input business address, employee count, and investment in plant/machinery.",
      "Select relevant National Industry Classification (NIC) code.",
      "Instant issuance of official Udyam Certificate with permanent QR code.",
    ],
  },
  {
    id: "fssai-licence",
    name: "FSSAI Food Safety Licence",
    category: "Business Services",
    categoryId: "business-services",
    icon: "🥗",
    status: "available",
    shortDescription:
      "Food safety registration and state licence for grocery shops, hotels, sweet shops, bakeries, and street food carts.",
    whatIsThis:
      "Under the Food Safety and Standards Authority of India (FSSAI), every food business operator (FBO) must hold an official 14-digit registration or licence number. We assist local eateries, dairy shops, dhabas, grocery stores, and food manufacturers with compliant licensing.",
    documents: [
      "Photo of the business owner",
      "Aadhaar card / Voter ID of applicant",
      "Shop establishment proof (electricity bill, rent agreement, or panchayat NOC)",
      "List of food categories handled",
    ],
    steps: [
      "Determine appropriate category: Basic Registration (turnover up to ₹12 Lakh) or State Licence.",
      "Submit Form A/B on the FoSCoS portal.",
      "Pay official government fee for 1 to 5 years validity.",
      "Download 14-digit FSSAI certificate to display at your food establishment.",
    ],
  },
  {
    id: "shop-establishment",
    name: "Shop & Establishment Registration",
    category: "Business Services",
    categoryId: "business-services",
    icon: "🏪",
    status: "available",
    shortDescription:
      "UP Labour Department shop registration (Gumasta) for retail shops, offices, and commercial establishments.",
    whatIsThis:
      "The Uttar Pradesh Dookan Aur Vanijya Adhisthan Act requires all commercial establishments and shops to register with the Labour Department. This certificate serves as legal proof of business existence for opening current bank accounts.",
    documents: [
      "Owner's PAN and Aadhaar card",
      "Photograph of shop exterior with nameboard in clear view",
      "Electricity bill or rental deed of shop premises",
      "Number of employees and working hours schedule",
    ],
    steps: [
      "Apply online on the UP Nivesh Mitra / Labour portal.",
      "Upload shop photographs and owner credentials.",
      "Pay state government prescribed fees.",
      "Download official registration certificate for commercial banking compliance.",
    ],
  },
  {
    id: "company-registration",
    name: "Company Registration Assistance",
    category: "Business Services",
    categoryId: "business-services",
    icon: "🏢",
    status: "enquire",
    shortDescription:
      "Guidance and document preparation for Partnership, Sole Proprietorship, LLP, and Private Limited company setup.",
    whatIsThis:
      "Starting a new business requires choosing the right legal entity. We assist budding entrepreneurs with name availability checks, drafting partnership deeds, obtaining Digital Signature Certificates (DSC), Director Identification Numbers (DIN), and Ministry of Corporate Affairs (MCA) filings.",
    documents: [
      "PAN card and Aadhaar card of all partners/directors",
      "Passport-size photographs",
      "Bank statements with latest 2 months entries",
      "Registered office address electricity bill and owner NOC",
    ],
    steps: [
      "Consultation on suitable entity type (Proprietorship vs Partnership vs Pvt Ltd).",
      "Name reservation application on MCA portal.",
      "Preparation of MOA, AOA, and partnership deeds.",
      "Filing incorporation documents and obtaining Certificate of Incorporation.",
    ],
  },
  {
    id: "loan-assistance",
    name: "Loan Assistance (Personal, Business, Agri)",
    category: "Business Services",
    categoryId: "business-services",
    icon: "💵",
    status: "enquire",
    shortDescription:
      "Document dossier preparation, CIBIL report check, and application support for bank personal, business, and vehicle loans.",
    whatIsThis:
      "Applying for bank loans can be overwhelming due to rigorous document criteria. We help applicants organize complete loan application dossiers, verify CIBIL credit scores, gather IT returns, and submit loan requests through verified banking partner channels.",
    documents: [
      "KYC documents (Aadhaar & PAN card)",
      "Last 6 months bank statements with clear transactions",
      "Last 2-3 years ITR with computation of income",
      "Property or collateral papers (for secured loans)",
      "Business registration certificate (Udyam/GST for business loans)",
    ],
    steps: [
      "Review loan requirement, eligibility, and credit profile.",
      "Compile audited financials, ITRs, and bank statements.",
      "Submit application through authorized digital lending / bank partner portals.",
      "Track loan approval and sanction letters.",
    ],
  },
  {
    id: "pmegp-scheme",
    name: "PMEGP Scheme Assistance",
    category: "Business Services",
    categoryId: "business-services",
    icon: "🏭",
    status: "enquire",
    shortDescription:
      "Prime Minister's Employment Generation Programme with 15% to 35% government subsidy for new enterprises.",
    whatIsThis:
      "PMEGP is a major credit-linked subsidy programme administered by KVIC. Individuals can get loans up to ₹50 Lakh for manufacturing units and up to ₹20 Lakh for service units, with government margin money subsidy ranging between 15% and 35%.",
    documents: [
      "Aadhaar card and PAN card",
      "Project Report (DPR - Detailed Project Report showing project costs)",
      "Educational certificate (minimum 8th pass for projects above ₹10 Lakh)",
      "Caste certificate / Special category proof (for 35% subsidy rate)",
      "EDP training certificate (if completed)",
    ],
    steps: [
      "Formulate Detailed Project Report (DPR) with capital expenditure and operational costs.",
      "Submit online application on KVIC PMEGP portal.",
      "District Level Task Force Committee (DLTFC) reviews proposal.",
      "Application forwarded to designated bank branch for loan sanction and subsidy release.",
    ],
  },
  {
    id: "mudra-loan",
    name: "MUDRA Loan Assistance",
    category: "Business Services",
    categoryId: "business-services",
    icon: "🤝",
    status: "enquire",
    shortDescription:
      "Collateral-free micro loans under Shishu (up to ₹50,000), Kishore (up to ₹5 Lakh), and Tarun (up to ₹10 Lakh).",
    whatIsThis:
      "Pradhan Mantri MUDRA Yojana (PMMY) enables non-corporate, non-farm small/micro enterprises to access collateral-free institutional credit up to ₹10 Lakh through public and private sector banks.",
    documents: [
      "Identity and address proof (Aadhaar, PAN, Voter ID)",
      "Proof of business identity (Udyam registration, Shop act, GST)",
      "Bank statement for last 6 months",
      "Quotation of machinery / items to be purchased",
    ],
    steps: [
      "Identify loan tier: Shishu (up to ₹50K), Kishore (₹50K-₹5L), or Tarun (₹5L-₹10L).",
      "Fill standardized MUDRA application form.",
      "Submit file to bank with projected business cashflows.",
      "Track sanction and MUDRA debit card issuance.",
    ],
  },
  {
    id: "kcc-assistance",
    name: "Kisan Credit Card (KCC) Assistance",
    category: "Business Services",
    categoryId: "business-services",
    icon: "🌾",
    status: "enquire",
    shortDescription:
      "Concessional crop loan assistance at 4% effective interest rate for farmers and animal husbandry / dairy owners.",
    whatIsThis:
      "The Kisan Credit Card (KCC) provides farmers with timely, flexible credit for cultivation expenses, post-harvest costs, and maintenance of farm assets at highly subsidized interest rates (down to 4% with prompt repayment incentives).",
    documents: [
      "Farmer's Aadhaar card and PAN card",
      "Land revenue Khatauni copy with updated sowing details",
      "No Dues Certificate (NDC) from local bank branches if applicable",
      "Passport-size photographs",
    ],
    steps: [
      "Fill single-page simplified KCC application form.",
      "Attach certified land records from the local Lekhpal / Tehsil.",
      "Submit file to the farmer's PM-Kisan bank branch.",
      "Card limit is sanctioned based on landholding and crop patterns.",
    ],
  },
  {
    id: "aeps-banking",
    name: "AePS Cash Withdrawal & DigiPay Banking",
    category: "Banking & Financial Services",
    categoryId: "banking-financial",
    icon: "🏧",
    status: "available",
    popular: true,
    shortDescription:
      "Biometric fingerprint Aadhaar ATM — instant cash withdrawal, balance check, and 24/7 money transfer for all banks.",
    whatIsThis:
      "As an authorized DigiPay / CSP branchless banking partner, we provide banking convenience right in Pipraich. Citizens can withdraw money from ANY Indian bank account simply by placing their thumb on our certified biometric scanner — no ATM card or cheque book needed.",
    documents: [
      "Original Aadhaar card",
      "Bank account linked with Aadhaar (NPCI enabled)",
      "Biometric fingerprint authentication at centre",
    ],
    steps: [
      "Citizen provides their bank name and Aadhaar number.",
      "Select service: Cash Withdrawal, Balance Enquiry, or Mini Statement.",
      "Place finger on certified biometric scanner to authenticate.",
      "Cash dispensed instantly with genuine printed / SMS transaction receipt.",
    ],
    importantNotes: [
      "Safe, RBI-regulated, and instant. Works for SBI, PNB, Baroda, Union Bank, Post Office Bank, and 50+ other banks.",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 4. EDUCATION & ONLINE SERVICES
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "scholarships",
    name: "Scholarships (UP & National Portal)",
    category: "Education & Online Forms",
    categoryId: "education-forms",
    icon: "🎓",
    status: "available",
    popular: true,
    shortDescription:
      "Pre-matric, post-matric, and dashmottar scholarship form submission on UP Scholarship and NSP portals.",
    whatIsThis:
      "Uttar Pradesh Scholarship portal and the National Scholarship Portal (NSP) provide financial fee reimbursement and stipends to SC, ST, OBC, Minority, and General category students from class 9th up to higher education (ITI, Polytechnic, BA, BSc, BTech). We ensure accurate form filling without disqualification errors.",
    documents: [
      "Student's Aadhaar card (Aadhaar must be linked with active mobile and bank account)",
      "Latest Income Certificate (in name of father/guardian)",
      "Caste Certificate (for SC/ST/OBC categories)",
      "Domicile Certificate of Uttar Pradesh",
      "College fee receipt and admission enrolment number",
      "Previous year marksheet, passport photo & bank passbook",
    ],
    steps: [
      "Online registration with student credentials.",
      "Accurate entry of fee details, marks, and bank IFSC details.",
      "Aadhaar biometric / OTP authentication.",
      "Print preliminary draft for college verification, followed by final lock and submission.",
    ],
    importantNotes: [
      "Bank account must have NPCI Aadhaar Seeding active, or scholarship funds cannot be credited.",
    ],
  },
  {
    id: "nielit-courses",
    name: "NIELIT Registration (CCC / O-Level)",
    category: "Education & Online Forms",
    categoryId: "education-forms",
    icon: "💻",
    status: "available",
    popular: true,
    shortDescription:
      "Online exam registration, student profile creation, and admit card download for CCC, BCC, and O-Level IT courses.",
    whatIsThis:
      "Course on Computer Concepts (CCC) by NIELIT is mandatory for major Uttar Pradesh government job recruitments (such as VDO, Lekhpal, Junior Assistant). We help candidates fill online exam application forms, pay exam fees, and download examination admit cards.",
    documents: [
      "Aadhaar card of candidate",
      "Passport-size photo and signature scan",
      "Left thumb impression scan",
      "Active mobile number and email ID",
    ],
    steps: [
      "Register on NIELIT student portal.",
      "Fill personal and educational details and select preferred exam centre.",
      "Upload photo, signature, and thumb impression in exact pixel specifications.",
      "Pay official exam fee and track admit card release for the upcoming exam cycle.",
    ],
  },
  {
    id: "ignou-admission",
    name: "IGNOU Admission & Online Services",
    category: "Education & Online Forms",
    categoryId: "education-forms",
    icon: "📚",
    status: "available",
    shortDescription:
      "Fresh admission form filing, re-registration for next semesters, exam form submission, and assignment download.",
    whatIsThis:
      "Indira Gandhi National Open University (IGNOU) offers open distance learning degree and diploma programs. We assist students with fresh admissions (BA, B.Com, MA, MBA), semester re-registration, term-end examination (TEE) form filling, and hall ticket downloads.",
    documents: [
      "Previous marksheets (10th, 12th, or Graduation)",
      "Aadhaar card and passport photograph",
      "Category certificate (if applying for fee exemption)",
      "Scanned signature",
    ],
    steps: [
      "Select desired academic program and regional study centre.",
      "Upload academic records and personal details on Samarth portal.",
      "Pay course fees via online gateway.",
      "Track admission confirmation and enrollment number allotment.",
    ],
  },
  {
    id: "online-job-forms",
    name: "Government Job & Competitive Exam Forms",
    category: "Education & Online Forms",
    categoryId: "education-forms",
    icon: "📝",
    status: "available",
    popular: true,
    shortDescription:
      "Form filling for UPSSSC, UP Police, SSC, Railways (RRB), Teaching (TET), UPSC, and defense recruitments.",
    whatIsThis:
      "Filling competitive exam forms requires strict adherence to photo dimensions, signature sizes, category certificates, and eligibility details. A single mistake can lead to permanent rejection. Our experienced staff ensures error-free, prompt form submissions before portal deadlines.",
    documents: [
      "All relevant educational marksheets & certificates",
      "Aadhaar card",
      "Recent passport photos matching notification specifications",
      "Category and domicile certificates",
      "Active mobile phone and email address",
    ],
    steps: [
      "Read official recruitment notification guidelines carefully.",
      "Resize photographs and signatures to exact KB/pixel limits.",
      "Fill qualification details, exam centres, and post preferences.",
      "Pay online exam fee and provide printed confirmation receipt.",
    ],
  },
  {
    id: "digilocker-services",
    name: "DigiLocker Account & Document Fetching",
    category: "Education & Online Forms",
    categoryId: "education-forms",
    icon: "📂",
    status: "available",
    shortDescription:
      "Account setup, mobile linking, and instant retrieval of legally valid digital marksheet, DL, RC, and insurance policies.",
    whatIsThis:
      "DigiLocker is the Government of India's secure cloud document storage platform. Documents in DigiLocker (Driving Licence, Vehicle RC, Class 10/12 Marksheets, PAN card) are legally recognized on par with original physical documents under the IT Act.",
    documents: [
      "Aadhaar card",
      "Active Aadhaar-registered mobile phone for OTP",
      "Roll number or vehicle registration number for document fetching",
    ],
    steps: [
      "Create and secure DigiLocker 6-digit security PIN.",
      "Link verified Aadhaar profile.",
      "Pull authentic digital records from CBSE, UP Board, Parivahan, and Income Tax databases.",
      "Print high-definition verified documents with official digital signatures.",
    ],
  },
  {
    id: "epfo-uan",
    name: "EPFO / UAN & PF Claim Assistance",
    category: "Education & Online Forms",
    categoryId: "education-forms",
    icon: "💼",
    status: "available",
    shortDescription:
      "Universal Account Number (UAN) activation, KYC seeding, online PF withdrawal, advance claims, and passbook view.",
    whatIsThis:
      "Employees' Provident Fund (EPF) provides retirement savings for organized sector workers. We help private sector and industrial workers activate their UAN, link Aadhaar/PAN/Bank KYC, and submit online claims for PF advance, full PF withdrawal, and pension settlement (Form 19, 10C, 31).",
    documents: [
      "12-digit Universal Account Number (UAN)",
      "Aadhaar card linked with active mobile number for EPFO OTP",
      "Bank passbook or cancelled cheque with applicant's name and account number",
      "PAN card (for withdrawals above ₹50,000 to prevent higher TDS)",
    ],
    steps: [
      "Check UAN activation status and verify Member Portal access.",
      "Update and approve bank account and PAN KYC.",
      "Fill appropriate online withdrawal claim (Advance Form 31 or Full Settlement Form 19).",
      "Track claim settlement until funds are credited to your bank account.",
    ],
  },
  {
    id: "esic-services",
    name: "ESIC Registration & Health Card",
    category: "Education & Online Forms",
    categoryId: "education-forms",
    icon: "🏥",
    status: "enquire",
    shortDescription:
      "Employee State Insurance (ESI) e-Pehchan card download, family member addition, and medical dispensary linkage.",
    whatIsThis:
      "The ESI scheme provides comprehensive social security and medical care benefits to industrial and private workers earning up to ₹21,000/month. We assist insured persons (IP) with downloading their e-Pehchan health card and updating family dependants for free dispensary treatment.",
    documents: [
      "Insurance Number (IP Number)",
      "Aadhaar card of employee and dependants (spouse, children, parents)",
      "Photographs of all family members",
      "Employer code / Company joining details",
    ],
    steps: [
      "Access ESIC Insured Person (IP) portal.",
      "Verify dependant family details and medical dispensary location.",
      "Generate and print official e-Pehchan card.",
      "Get card stamped by employer for cashless dispensary treatment.",
    ],
  },

  // ──────────────────────────────────────────────────────────────────────────
  // 5. TRAVEL & OTHER SERVICES
  // ──────────────────────────────────────────────────────────────────────────
  {
    id: "train-booking",
    name: "Train Ticket Booking (IRCTC)",
    category: "Passport & Travel",
    categoryId: "passport-travel",
    icon: "🚂",
    status: "available",
    popular: true,
    shortDescription:
      "Authorized IRCTC booking for Sleeper, 3AC, 2AC, and Tatkal quotas with instant confirmed PNR status.",
    whatIsThis:
      "We provide prompt and transparent train ticket reservations across India. Whether you need travel booking to Delhi, Mumbai, Kolkata, or southern cities, we check real-time seat availability, route options, and print genuine confirmed tickets.",
    documents: [
      "Passenger full names, ages, and gender",
      "Aadhaar / ID proof of passengers",
      "Preferred travel date, train name, and berth preference",
      "Contact mobile number for IRCTC journey alerts",
    ],
    steps: [
      "Check seat availability and fastest train routes.",
      "Enter verified passenger roster and berth preferences.",
      "Process payment through secure official merchant portal.",
      "Print confirmed e-ticket with PNR number, coach, and berth details.",
    ],
  },
  {
    id: "flight-booking",
    name: "Flight Ticket Booking",
    category: "Passport & Travel",
    categoryId: "passport-travel",
    icon: "✈️",
    status: "available",
    shortDescription:
      "Domestic and international flight bookings, baggage add-ons, seat selection, and web check-in support.",
    whatIsThis:
      "Book low-fare domestic and international flights departing from Gorakhpur (GOP), Varanasi (VNS), or Lucknow (LKO). We assist travelers with finding the best airfares, seat selection, extra baggage, meal preferences, and hassle-free web check-in.",
    documents: [
      "Government ID (Aadhaar / Voter ID for domestic travel; Passport for international)",
      "Travel dates and destination city",
      "Passenger mobile number and email address",
    ],
    steps: [
      "Compare airfares across airlines (IndiGo, Air India, SpiceJet, Akasa).",
      "Enter passenger details strictly matching government travel ID.",
      "Add meals, check-in baggage, and seat preferences if required.",
      "Instant e-ticket generation and boarding pass printing.",
    ],
  },
  {
    id: "bus-booking",
    name: "Bus Ticket Booking",
    category: "Passport & Travel",
    categoryId: "passport-travel",
    icon: "🚌",
    status: "available",
    shortDescription:
      "Online reservation for UPSRTC government buses and private AC Volvo / sleeper coaches across North India.",
    whatIsThis:
      "Inter-city bus bookings for travel across Uttar Pradesh, Bihar, Delhi, Nepal border, and Uttarakhand. Choose between budget roadways buses or luxury private Volvo multi-axle sleepers with verified pick-up and drop points.",
    documents: [
      "Passenger name and contact mobile number",
      "Boarding point and destination details",
    ],
    steps: [
      "Select travel route and boarding timing.",
      "Choose seat / sleeper berth layout.",
      "Complete booking and receive SMS ticket with driver / bus tracking details.",
    ],
  },
  {
    id: "fastag-services",
    name: "FASTag Issuance & Wallet Recharge",
    category: "Banking & Financial Services",
    categoryId: "banking-financial",
    icon: "🏷️",
    status: "available",
    popular: true,
    shortDescription:
      "New FASTag purchase for cars and commercial vehicles, instant sticker activation, and toll wallet top-ups.",
    whatIsThis:
      "FASTag uses RFID technology to make toll payments automatically at National and State Highway toll plazas without stopping. We issue authentic bank-partnered FASTag stickers for cars, vans, trucks, and recharge blacklisted or low-balance FASTag wallets.",
    documents: [
      "Vehicle Registration Certificate (RC copy)",
      "Owner's Aadhaar card and PAN card",
      "Vehicle front photo showing clear registration number plate",
      "Active mobile number",
    ],
    steps: [
      "Verify vehicle registration number on NPCI National Electronic Toll Collection portal.",
      "Pair new RFID tag with vehicle chassis and owner KYC.",
      "Add initial toll wallet balance.",
      "Fix RFID tag correctly on the vehicle front windshield.",
    ],
  },
  {
    id: "utility-bills",
    name: "Electricity & Utility Bill Payments (UPPCL)",
    category: "Banking & Financial Services",
    categoryId: "banking-financial",
    icon: "⚡",
    status: "available",
    popular: true,
    shortDescription:
      "Pay UPPCL rural & urban electricity bills, water bills, and LPG cylinder refills with instant official receipts.",
    whatIsThis:
      "Pay all household and commercial utility bills via the Bharat Bill Payment System (BBPS). We handle UPPCL Rural (10-digit account ID) and Urban (10/12-digit) electricity bills, water bills, Indane/Bharat/HP gas cylinder booking, and mobile/DTH recharges with instant official receipts.",
    documents: [
      "Electricity Consumer Account ID (10 or 12 digits)",
      "LPG consumer number or registered mobile (for gas cylinder booking)",
      "Bill payment amount in cash or UPI",
    ],
    steps: [
      "Fetch current due bill amount from the official discom server.",
      "Verify consumer name and billing cycle.",
      "Accept payment and process through BBPS gateway.",
      "Hand over genuine printed official payment receipt with transaction ID.",
    ],
  },
  {
    id: "printing-services",
    name: "High-Quality Printing (B&W / Colour)",
    category: "Printing / Scanning / Lamination",
    categoryId: "printing-lamination",
    icon: "🖨️",
    status: "available",
    shortDescription:
      "Crisp black & white and full-colour printing on 75 GSM to 250 GSM paper, project reports, and certificates.",
    whatIsThis:
      "Fast, high-resolution printing from WhatsApp, pen drives, email, or Google Drive. We print legal documents, student assignments, project dossiers, official forms, certificates, and colored brochures with crisp text and vivid colors.",
    documents: ["Digital document file in PDF, Word, Excel, or image format"],
    steps: [
      "Send document to our WhatsApp or email, or connect via USB.",
      "Select paper type (Standard 75 GSM, Heavy 100 GSM, or Glossy Card).",
      "Choose single-sided or double-sided printing.",
      "Inspect printed copies on the spot.",
    ],
  },
  {
    id: "scanning-services",
    name: "Document Scanning (PDF / JPG)",
    category: "Printing / Scanning / Lamination",
    categoryId: "printing-lamination",
    icon: "🔍",
    status: "available",
    shortDescription:
      "High-resolution multi-page document scanning, custom file size compression (under 100KB/200KB), and PDF creation.",
    whatIsThis:
      "Online portals frequently reject documents that exceed strict file size limits (like under 100KB or 200KB) or have blurry resolution. Our flatbed and sheet-fed scanners produce clean, readable, perfectly sized PDF and image files tailored for government uploads.",
    documents: [
      "Original physical documents to scan",
      "Target file size requirement specified by the job/college portal",
    ],
    steps: [
      "Clean scan of original documents with auto-straightening and color optimization.",
      "Merge multiple pages into a single organized PDF file.",
      "Compress to specified KB limits without degrading legibility.",
      "Deliver file via WhatsApp or email.",
    ],
  },
  {
    id: "photocopy-services",
    name: "Photocopy / Xerox Services",
    category: "Printing / Scanning / Lamination",
    categoryId: "printing-lamination",
    icon: "📄",
    status: "available",
    shortDescription:
      "Fast, clear, high-speed photocopying for single and bulk documents, Aadhaar cards, and book pages.",
    whatIsThis:
      "Reliable, clear photocopies on quality white paper. We offer front-and-back copying, booklet copying, Aadhaar front-and-back alignment on single page, and bulk copying for legal files, court work, and student notes.",
    documents: ["Original documents to photocopy"],
    steps: [
      "Provide documents for copying.",
      "Specify number of copies and single/double-sided preference.",
      "High-speed digital duplication with deep contrast.",
    ],
  },
  {
    id: "lamination-services",
    name: "Document Lamination",
    category: "Printing / Scanning / Lamination",
    categoryId: "printing-lamination",
    icon: "🃏",
    status: "available",
    shortDescription:
      "Thermal pouch lamination for marksheets, land registries, birth certificates, and ID cards to protect against wear and water.",
    whatIsThis:
      "Protect your valuable permanent certificates from moisture, dust, tearing, and fading. We use premium thermal lamination pouches (80 micron to 250 micron) that preserve certificates, land Khatauni copies, degrees, and identity cards for years.",
    documents: ["Original certificate or card to be laminated"],
    steps: [
      "Inspect document for folds or surface dust.",
      "Enclose document in premium clear lamination sleeve.",
      "Pass through temperature-controlled thermal roll lamination.",
      "Neatly trimmed and smoothed corner finish.",
    ],
  },
  {
    id: "passport-photos",
    name: "Instant Passport Size Photos",
    category: "Printing / Scanning / Lamination",
    categoryId: "printing-lamination",
    icon: "📸",
    status: "available",
    popular: true,
    shortDescription:
      "Professional studio lighting photos printed in 5 minutes with white, blue, or custom backgrounds for all official uses.",
    whatIsThis:
      "Get instant passport-size photos taken and printed in minutes. We provide standard Indian passport photo dimensions (3.5 x 4.5 cm), white background photos for US/Schengen visas, and custom background sets for UP police recruitments, school admissions, and bank accounts.",
    documents: ["Just visit the centre in formal or semi-formal attire."],
    steps: [
      "Quick photo capture with proper studio lighting and posture.",
      "Instant digital touch-up and background replacement.",
      "Print set of 8, 16, or 32 photos on high-gloss archival photo paper.",
      "Cut and ready in under 5 minutes.",
    ],
  },
]

/**
 * Filtered helper for popular services displayed on the Home page
 */
export const popularServices = services.filter((s) => s.popular)

/**
 * Quick Category navigation list
 */
export const quickCategories = categories.filter((c) => c.id !== "all")

/**
 * Helper to find a service by exact ID or common legacy aliases
 */
export function findServiceById(id: string): Service | undefined {
  if (!id) return undefined
  const normalized = id.toLowerCase().trim()

  // Direct match
  const direct = services.find((s) => s.id === normalized)
  if (direct) return direct

  // Legacy ID mapping to guarantee no broken links
  const legacyMap: Record<string, string> = {
    "eaadhaar-download": "aadhaar-pvc",
    "pan-correction": "pan-apply",
    "pan-reprint": "pan-apply",
    "voter-register": "voter-id",
    "voter-correction": "voter-id",
    "voter-download": "voter-id",
    "voter-apply": "voter-id",
    "passport-renew": "passport-apply",
    "electricity-bill": "utility-bills",
    "water-bill": "utility-bills",
    "gas-bill": "utility-bills",
    "broadband-bill": "utility-bills",
    "mobile-prepaid": "utility-bills",
    "mobile-postpaid": "utility-bills",
    "dth-recharge": "utility-bills",
    fastag: "fastag-services",
    "learners-licence": "driving-licence",
    "dl-renewal": "driving-licence",
    "dl-apply": "driving-licence",
    "road-tax": "vehicle-rc",
    "rc-address-change": "vehicle-rc",
    "flight-domestic": "flight-booking",
    "flight-international": "flight-booking",
    "caste-certificate": "caste-cert",
    "income-certificate": "income-cert",
    "domicile-certificate": "domicile-cert",
    "birth-cert": "birth-death-cert",
    "death-cert": "birth-death-cert",
    "ayushman-assist": "ayushman-bharat",
    "ayushman-card": "ayushman-bharat",
    eshram: "eshram-card",
    "cash-withdrawal": "aeps-banking",
    aeps: "aeps-banking",
    "money-transfer": "aeps-banking",
    "micro-atm": "aeps-banking",
    "bank-account-open": "aeps-banking",
    scholarship: "scholarships",
    "nielit-assist": "nielit-courses",
    "govt-job-forms": "online-job-forms",
    "competitive-exam-forms": "online-job-forms",
    "school-college-forms": "online-job-forms",
    "university-forms": "online-job-forms",
    "admit-result-print": "online-job-forms",
    "general-forms": "online-job-forms",
    "bw-printing": "printing-services",
    "colour-printing": "printing-services",
    photocopy: "photocopy-services",
    scanning: "scanning-services",
    lamination: "lamination-services",
    "passport-photo": "passport-photos",
  }

  const mappedId = legacyMap[normalized]
  if (mappedId) {
    return services.find((s) => s.id === mappedId)
  }

  // Substring match
  return services.find((s) => s.name.toLowerCase().includes(normalized))
}

/**
 * Helper to match a service with a category ID, supporting legacy category IDs
 */
export function isServiceInCategory(
  service: Service,
  categoryId: string,
): boolean {
  if (categoryId === "all") return true
  if (service.categoryId === categoryId) return true

  // Backward compatible mappings for legacy category filters
  if (categoryId === "gov-documents") {
    return [
      "aadhaar-identity",
      "pan-card",
      "voter-id",
      "passport-travel",
    ].includes(service.categoryId)
  }
  if (categoryId === "certificates-schemes") {
    return ["gov-certificates", "gov-schemes"].includes(service.categoryId)
  }
  if (categoryId === "financial-business") {
    return ["banking-financial", "business-services"].includes(
      service.categoryId,
    )
  }
  if (categoryId === "education-online") {
    return service.categoryId === "education-forms"
  }
  if (categoryId === "travel-other") {
    return [
      "passport-travel",
      "printing-lamination",
      "banking-financial",
    ].includes(service.categoryId)
  }

  return false
}
