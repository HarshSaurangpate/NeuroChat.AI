import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Brain, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen flex items-center justify-center bg-[#0d1117] px-4">
    {/* Card */}
    <div className="w-full max-w-md bg-[#161b22] border border-[#30363d]
                    rounded-2xl p-8 shadow-xl animate-fade-in">
      
      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <div className="w-14 h-14 rounded-xl bg-[#0e1211]
                        flex items-center justify-center shadow-md">
          <Brain size={28} className="text-white" />
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-[#e6edf3]">Welcome back</h1>
          <p className="text-[#8b949e] text-sm mt-1">Sign in to NeuroChat</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-lg
                        bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
          <AlertCircle size={16} className="flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-[#8b949e] mb-1.5">Email</label>
          <input
            id="login-email"
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 text-sm
                       text-[#e6edf3] placeholder-[#6e7681] outline-none
                       focus:border-[#06120e] focus:ring-2 focus:ring-[#10a37f]/20
                       transition-all duration-200"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-[#8b949e] mb-1.5">Password</label>
          <div className="relative">
            <input
              id="login-password"
              type={showPw ? 'text' : 'password'}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              autoComplete="current-password"
              className="w-full bg-[#0d1117] border border-[#30363d] rounded-lg px-4 py-3 pr-11 text-sm
                         text-[#e6edf3] placeholder-[#6e7681] outline-none
                         focus:border-[#06120e] focus:ring-2 focus:ring-[#10a37f]/20
                         transition-all duration-200"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6e7681] hover:text-[#c9d1d9]"
            >
              {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>

        {/* Submit */}
        <button
          id="login-submit"
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[#0e1211]
                     hover:bg-[#030d0a] text-white font-semibold text-sm
                     transition-all duration-200
                     disabled:opacity-60 disabled:cursor-not-allowed mt-2"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Signing in…
            </span>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <p className="text-center text-sm text-[#6e7681] mt-6">
        Don&apos;t have an account?{' '}
        <Link
          to="/register"
          className="text-[#e3e8e7] hover:underline font-medium transition-colors"
        >
          Sign up
        </Link>
      </p>
    </div>
  </div>
);
}
