import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { Eye, EyeOff, LogIn, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ACT_LOGO = 'https://arizonachristiantuition.com/wp-content/uploads/2025/12/ACT-Logo-Color.svg';

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  individual_donor: 'Individual Donor',
  business_donor: 'Business Donor',
  parent: 'Parent / Guardian',
  student: 'Student',
};

export function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = (location.state as any)?.from || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email || !password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      toast.success('Welcome back! 🙏');
      navigate(redirectTo, { replace: true });
    } else {
      setError(result.message);
    }
  };

  const inp = 'w-full px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/50 bg-white transition-all';

  return (
    <div className="min-h-screen bg-[#e8eef5] flex flex-col">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <img src={ACT_LOGO} alt="Arizona Christian Tuition" className="h-14 w-auto mx-auto mb-4" />
            </Link>
            <h1
              className="text-[#1a2d5a]"
              style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.6rem' }}
            >
              Sign In
            </h1>
            <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              Access your ACT account to donate, manage campaigns, or track scholarships.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="px-4 py-3 bg-red-50 border border-red-100 rounded-lg text-sm text-red-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Email Address
                </label>
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com" className={inp} autoComplete="email"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>Password</label>
                  <button type="button" className="text-xs text-[#c8202d] hover:underline" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPw ? 'text' : 'password'} value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••" className={inp + ' pr-10'} autoComplete="current-password"
                  />
                  <button
                    type="button" onClick={() => setShowPw(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-60 text-white rounded-lg font-semibold text-sm transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Signing in…</>
                  : <><LogIn size={16} /> Sign In</>
                }
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                Don't have an account?{' '}
                <Link to="/register" className="text-[#c8202d] font-semibold hover:underline">
                  Create Account
                </Link>
              </p>
            </div>
          </div>

          {/* Account types info */}
          <div className="mt-6 grid grid-cols-2 gap-3">
            {Object.entries(ACCOUNT_TYPE_LABELS).map(([type, label]) => (
              <div key={type} className="bg-white/60 rounded-xl p-3 text-center border border-white">
                <div className="text-lg mb-1">
                  {type === 'individual_donor' ? '👤' : type === 'business_donor' ? '🏢' : type === 'parent' ? '👨‍👩‍👧' : '🎒'}
                </div>
                <p className="text-xs text-[#1a2d5a] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-gray-400 mt-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            🔒 Secure login. Donations qualify for Arizona's Private School Tax Credit.
          </p>
        </div>
      </div>
    </div>
  );
}
