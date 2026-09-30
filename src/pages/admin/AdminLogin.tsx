import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import { supabase, isSupabaseConfigured } from "../../lib/supabase"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate("/admin", { replace: true })
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/admin", { replace: true })
      }
    })

    return () => subscription.unsubscribe()
  }, [navigate])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setErrorMsg("")
    setLoading(true)

    try {
      if (!isSupabaseConfigured) {
        // Fallback demo authorization for preview mode before Supabase environment keys are provided
        sessionStorage.setItem("gupta_admin_local_auth", "true")
        navigate("/admin", { replace: true })
        return
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      })

      if (error) {
        setErrorMsg(error.message || "Invalid admin credentials.")
      } else if (data.session) {
        navigate("/admin", { replace: true })
      }
    } catch (err: any) {
      setErrorMsg(err?.message || "Login failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  function handleDemoAccess() {
    sessionStorage.setItem("gupta_admin_local_auth", "true")
    navigate("/admin", { replace: true })
  }

  return (
    <div className="min-h-screen bg-[#F5F9FF] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Inter'] w-full overflow-x-hidden">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Brand Crest */}
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-12 h-12 rounded-2xl bg-[#1565C0] flex items-center justify-center text-white font-bold text-2xl font-['Poppins'] shadow-md shadow-[#1565C0]/20">
            GE
          </div>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-[#0D47A1] font-['Poppins']">
          Gupta Enterprises
        </h1>
        <p className="mt-1 text-xs text-slate-500">
          Authorized CSC Admin Portal &amp; Enquiry Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white border border-slate-200 py-8 px-6 shadow-xl rounded-3xl sm:px-10 text-[#172033]">
          <form className="space-y-5" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-xs flex items-center gap-2.5">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {!isSupabaseConfigured && (
              <div className="bg-[#EAF4FF] border border-[#BFDBFE] text-[#1565C0] px-4 py-3 rounded-xl text-xs space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-[#0D47A1]">
                  <span>ℹ️</span> Supabase Cloud Setup Notice
                </div>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  Configure{" "}
                  <code className="bg-white/80 px-1 py-0.5 rounded text-[#1565C0] font-mono">
                    VITE_SUPABASE_URL
                  </code>{" "}
                  &amp;{" "}
                  <code className="bg-white/80 px-1 py-0.5 rounded text-[#1565C0] font-mono">
                    VITE_SUPABASE_ANON_KEY
                  </code>{" "}
                  in{" "}
                  <code className="bg-white/80 px-1 py-0.5 rounded text-[#1565C0] font-mono">
                    .env.local
                  </code>{" "}
                  for cloud database sync.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@guptaenterprises.com"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[#172033] placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Admin Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-[#172033] placeholder:text-slate-400 text-xs focus:ring-2 focus:ring-[#1565C0]/20 focus:border-[#1565C0] outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#1565C0] hover:bg-[#0D47A1] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Admin Dashboard</span>
              )}
            </button>

            {!isSupabaseConfigured && (
              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full py-2.5 px-3 bg-[#EAF4FF] hover:bg-[#DBEAFE] text-[#1565C0] font-semibold text-xs rounded-xl border border-[#BFDBFE] transition-colors cursor-pointer"
              >
                Access Demo Dashboard (Preview Mode)
              </button>
            )}
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <Link
              to="/"
              className="text-[#1565C0] hover:text-[#0D47A1] flex items-center gap-1 transition-colors"
            >
              <span>←</span> Return to Public Website
            </Link>
            <span>Protected by RLS</span>
          </div>
        </div>
      </div>
    </div>
  )
}
