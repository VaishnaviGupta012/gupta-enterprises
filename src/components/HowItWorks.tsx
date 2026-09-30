const STEPS = [
  {
    step: "01",
    title: "Find Your Service",
    description:
      "Explore our categorized directory or use instant search to find your required service.",
    icon: "🔍",
  },
  {
    step: "02",
    title: "Check Required Documents",
    description:
      "View the exact document list beforehand so you bring all original papers in one trip.",
    icon: "📋",
  },
  {
    step: "03",
    title: "Visit Centre or WhatsApp",
    description:
      "Walk into our Pipraich centre or send your documents/query via WhatsApp for guidance.",
    icon: "🏢",
  },
  {
    step: "04",
    title: "Assisted Form Filing",
    description:
      "Our staff accurately fills the official government portal forms and validates proofs.",
    icon: "✍️",
  },
  {
    step: "05",
    title: "Receipt & Tracking",
    description:
      "Receive your official acknowledgment slip and reference number to track updates easily.",
    icon: "✅",
  },
]

export default function HowItWorks() {
  return (
    <section className="py-16 bg-white border-b border-slate-200">
      <div className="site-container">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="section-badge">Simple &amp; Transparent Process</div>
          <h2 className="section-title">How It Works</h2>
          <p className="section-subtitle mx-auto">
            Get your digital citizen services completed in five easy,
            stress-free steps with complete personal guidance.
          </p>
        </div>

        {/* 5 Steps Grid with Connecting Line */}
        <div className="relative">
          {/* Subtle line across desktop cards */}
          <div className="hidden lg:block absolute top-12 left-12 right-12 h-0.5 bg-[#BFDBFE]/50 z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 relative z-10">
            {STEPS.map((item) => (
              <div
                key={item.step}
                className="bg-white rounded-2xl border border-slate-200 p-5 text-center flex flex-col items-center hover:border-[#1565C0] hover:shadow-md transition-all group"
              >
                {/* Step Icon with Number Tag */}
                <div className="relative mb-4">
                  <div className="w-16 h-16 rounded-2xl bg-[#EAF4FF] group-hover:bg-[#DBEAFE] border border-[#BFDBFE]/70 flex items-center justify-center text-3xl shadow-2xs transition-colors">
                    {item.icon}
                  </div>
                  <span className="absolute -bottom-2.5 -right-2.5 px-2.5 py-0.5 rounded-full bg-[#1565C0] text-white text-[11px] font-bold font-['Poppins'] shadow-xs">
                    {item.step}
                  </span>
                </div>

                {/* Step Title & Details */}
                <h3 className="font-bold text-sm font-['Poppins'] text-[#0D47A1] mb-1.5 mt-2 group-hover:text-[#1565C0] transition-colors">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
