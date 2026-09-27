import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../../lib/supabase';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  // Check if already authenticated
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/admin', { replace: true });
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate('/admin', { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (!isSupabaseConfigured) {
        // If Supabase credentials are not added yet, allow local admin preview
        sessionStorage.setItem('gupta_admin_local_auth', 'true');
        navigate('/admin', { replace: true });
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrorMsg(error.message || 'Invalid login credentials.');
      } else if (data.session) {
        navigate('/admin', { replace: true });
      }
    } catch (err: any) {
      setErrorMsg(err?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function handleDemoAccess() {
    sessionStorage.setItem('gupta_admin_local_auth', 'true');
    navigate('/admin', { replace: true });
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-['Inter']">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {/* Logo */}
        <Link to="/" className="inline-flex items-center gap-2 group mb-4">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-2xl font-['Poppins'] shadow-lg shadow-blue-500/30">
            G
          </div>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-white font-['Poppins']">
          Gupta Enterprises
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          CSC Admin Portal & Helpdesk Management
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-800 border border-slate-700/80 py-8 px-6 shadow-2xl rounded-2xl sm:px-10 text-slate-200">
          <form className="space-y-5" onSubmit={handleLogin}>
            {errorMsg && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl text-xs flex items-center gap-2.5">
                <span>⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {!isSupabaseConfigured && (
              <div className="bg-amber-500/10 border border-amber-500/30 text-amber-200 px-4 py-3 rounded-xl text-xs space-y-1">
                <div className="font-semibold flex items-center gap-1.5 text-amber-300">
                  <span>ℹ️</span> Supabase Credentials Pending
                </div>
                <p className="text-[11px] text-amber-200/80 leading-relaxed">
                  Add <code className="bg-black/30 px-1 py-0.5 rounded">VITE_SUPABASE_URL</code> &{' '}
                  <code className="bg-black/30 px-1 py-0.5 rounded">VITE_SUPABASE_ANON_KEY</code> in{' '}
                  <code className="bg-black/30 px-1 py-0.5 rounded">.env.local</code> for production cloud authentication.
                </p>
              </div>
            )}

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Admin Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@guptaenterprises.com"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-900/80 border border-slate-700 rounded-xl text-white placeholder:text-slate-500 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <span>Sign In to Admin Portal</span>
              )}
            </button>

            {!isSupabaseConfigured && (
              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full py-2 px-3 bg-slate-700/60 hover:bg-slate-700 text-slate-300 hover:text-white font-medium text-xs rounded-xl border border-slate-600/50 transition-colors"
              >
                Access Demo Dashboard (Preview Mode)
              </button>
            )}
          </form>

          <div className="mt-6 pt-5 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <Link to="/" className="hover:text-blue-400 flex items-center gap-1 transition-colors">
              <span>←</span> Return to Public Website
            </Link>
            <span>Secured with RLS</span>
          </div>
        </div>
      </div>
    </div>
  );
}
