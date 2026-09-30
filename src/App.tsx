import { useEffect } from "react"
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  Link,
} from "react-router-dom"
import { CONTACT, waLink } from "./data/contact"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import WhatsAppButton from "./components/WhatsAppButton"
import Chatbot from "./components/Chatbot"
import { EnquiryProvider } from "./context/EnquiryContext"

// Pages
import Home from "./pages/Home"
import Services from "./pages/Services"
import ServiceDetail from "./pages/ServiceDetail"
import Documents from "./pages/Documents"
import About from "./pages/About"
import FAQ from "./pages/FAQ"
import Contact from "./pages/Contact"
import AdminLogin from "./pages/admin/AdminLogin"
import AdminDashboard from "./pages/admin/AdminDashboard"

/**
 * Scroll to top on every route transition
 */
function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

/**
 * Mobile Bottom Navigation Bar for quick access on smartphones
 */
function MobileBottomBar() {
  const location = useLocation()

  const isServicesActive =
    location.pathname === "/services" ||
    location.pathname.startsWith("/services/")
  const isDocumentsActive = location.pathname.startsWith("/documents")
  const isContactActive = location.pathname.startsWith("/contact")

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 z-40 flex shadow-lg pb-safe"
      aria-label="Mobile Bottom Navigation"
    >
      {/* Call Button */}
      <a
        href={`tel:${CONTACT.phoneTel}`}
        className="flex-1 flex flex-col items-center py-2 text-slate-600 hover:text-[#1565C0] active:bg-[#F5F9FF] transition-colors"
      >
        <span className="text-lg">📞</span>
        <span className="text-[10px] font-semibold leading-tight mt-0.5">
          Call
        </span>
      </a>

      {/* Services Link */}
      <Link
        to="/services"
        className={`flex-1 flex flex-col items-center py-2 transition-colors ${
          isServicesActive
            ? "text-[#1565C0] font-bold bg-[#EAF4FF]"
            : "text-slate-600 hover:text-[#1565C0]"
        }`}
      >
        <span className="text-lg">📂</span>
        <span className="text-[10px] font-semibold leading-tight mt-0.5">
          Services
        </span>
      </Link>

      {/* Documents Link */}
      <Link
        to="/documents"
        className={`flex-1 flex flex-col items-center py-2 transition-colors ${
          isDocumentsActive
            ? "text-[#1565C0] font-bold bg-[#EAF4FF]"
            : "text-slate-600 hover:text-[#1565C0]"
        }`}
      >
        <span className="text-lg">📋</span>
        <span className="text-[10px] font-semibold leading-tight mt-0.5">
          Documents
        </span>
      </Link>

      {/* WhatsApp Link */}
      <a
        href={waLink()}
        target="_blank"
        rel="noopener noreferrer"
        className="flex-1 flex flex-col items-center py-2 text-[#25D366] hover:text-[#1EBE5D] active:bg-emerald-50 transition-colors"
      >
        <svg className="w-5 h-5 mt-0.5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
        <span className="text-[10px] font-semibold leading-tight mt-0.5">
          WhatsApp
        </span>
      </a>

      {/* Contact Link */}
      <Link
        to="/contact"
        className={`flex-1 flex flex-col items-center py-2 transition-colors ${
          isContactActive
            ? "text-[#1565C0] font-bold bg-[#EAF4FF]"
            : "text-slate-600 hover:text-[#1565C0]"
        }`}
      >
        <span className="text-lg">📍</span>
        <span className="text-[10px] font-semibold leading-tight mt-0.5">
          Contact
        </span>
      </Link>
    </nav>
  )
}

/**
 * Main Layout wrapper
 */
function Layout({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin")

  if (isAdminRoute) {
    return (
      <div className="min-h-screen bg-[#F5F9FF] font-['Inter'] text-[#172033] w-full overflow-x-hidden">
        <ScrollToTop />
        <main>{children}</main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-white w-full overflow-x-hidden">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>
      <Footer />
      <WhatsAppButton />
      <Chatbot />
      <MobileBottomBar />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <EnquiryProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/documents" element={<Documents />} />
            <Route path="/about" element={<About />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </Layout>
      </EnquiryProvider>
    </BrowserRouter>
  )
}
