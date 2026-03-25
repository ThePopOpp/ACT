import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, Building2, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ACT_LOGO = 'https://arizonachristiantuition.com/wp-content/uploads/2025/12/ACT-Logo-Color.svg';

export function RegisterBusiness() {
  const { registerBusiness } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: '', lastName: '',
    businessName: '', businessTitle: '', ein: '',
    email: '', phone: '',
    password: '', confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const set = (field: string, val: string) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.businessName.trim()) errs.businessName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreed) errs.agreed = 'You must agree to the terms';
    return errs;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 700));
    const result = registerBusiness({
      firstName: form.firstName, lastName: form.lastName,
      businessName: form.businessName, businessTitle: form.businessTitle, ein: form.ein,
      email: form.email, phone: form.phone, password: form.password,
    });
    setLoading(false);
    if (result.success) {
      toast.success('Business account created! 🏢');
      navigate('/dashboard');
    } else {
      setErrors({ email: result.message });
    }
  };

  const inp = (err?: string) =>
    `w-full px-4 py-3 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-all ${
      err ? 'border-red-300 focus:ring-red-100' : 'border-gray-200 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/50'
    } bg-white`;

  return (
    <div className="min-h-screen bg-[#e8eef5] py-10 px-4">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <Link to="/">
            <img src={ACT_LOGO} alt="ACT" className="h-12 w-auto mx-auto mb-4" />
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#1a2d5a]/10 rounded-full mb-3">
            <Building2 size={14} className="text-[#1a2d5a]" />
            <span className="text-xs font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>Business / Corporate Donor Account</span>
          </div>
          <h1 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.6rem' }}>
            Business Donor Registration
          </h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Corporations, LLCs, and organizations funding Arizona Christian education.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Business info */}
            <div className="pb-4 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Business Information</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Business / Organization Name *</label>
                  <input value={form.businessName} onChange={e => set('businessName', e.target.value)} placeholder="Desert Sun Construction LLC" className={inp(errors.businessName)} />
                  {errors.businessName && <p className="text-xs text-red-500 mt-1">{errors.businessName}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Business Title (optional)</label>
                    <input value={form.businessTitle} onChange={e => set('businessTitle', e.target.value)} placeholder="CEO / Owner" className={inp()} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>EIN (optional)</label>
                    <input value={form.ein} onChange={e => set('ein', e.target.value)} placeholder="XX-XXXXXXX" className={inp()} />
                  </div>
                </div>
              </div>
            </div>

            {/* Contact person */}
            <div className="pb-4 border-b border-gray-100">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Contact Person</h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>First Name *</label>
                    <input value={form.firstName} onChange={e => set('firstName', e.target.value)} placeholder="John" className={inp(errors.firstName)} />
                    {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Last Name *</label>
                    <input value={form.lastName} onChange={e => set('lastName', e.target.value)} placeholder="Smith" className={inp(errors.lastName)} />
                    {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Business Email *</label>
                  <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="john@desertsun.com" className={inp(errors.email)} autoComplete="email" />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Business Phone (optional)</label>
                  <input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(602) 555-0100" className={inp()} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>Account Security</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Password *</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min 8 characters" className={inp(errors.password) + ' pr-10'} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Confirm Password *</label>
                  <div className="relative">
                    <input type={showCPw ? 'text' : 'password'} value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="Re-enter password" className={inp(errors.confirmPassword) + ' pr-10'} autoComplete="new-password" />
                    <button type="button" onClick={() => setShowCPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {showCPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                </div>
              </div>
            </div>

            {/* Corporate tax credit info */}
            <div className="p-4 bg-[#e8eef5] rounded-xl border border-[#1a2d5a]/10">
              <p className="text-xs text-[#1a2d5a] leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                🏛️ <strong>Arizona Corporate Tax Credit:</strong> Arizona corporations may contribute to Certified STO's and receive a dollar-for-dollar credit up to 20% of their AZ tax liability. Contributions are capped statewide at $2M annually.
              </p>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(er => ({ ...er, agreed: '' })); }} className="mt-0.5 w-4 h-4 accent-[#1a2d5a]" />
              <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                I agree to the{' '}
                <a href="#" className="text-[#c8202d] hover:underline">ACT Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-[#c8202d] hover:underline">Privacy Policy</a>.
              </span>
            </label>
            {errors.agreed && <p className="text-xs text-red-500 -mt-3">{errors.agreed}</p>}

            <button
              type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-60 text-white rounded-lg font-semibold text-sm transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account…</>
                : <><Building2 size={16} /> Create Business Account</>
              }
            </button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
              Already have an account?{' '}
              <Link to="/login" className="text-[#c8202d] font-semibold hover:underline">Sign in</Link>
            </p>
          </div>
        </div>

        <Link to="/register" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2d5a] mt-5 justify-center transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
          <ChevronLeft size={15} /> Back to account types
        </Link>
      </div>
    </div>
  );
}
