import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, GraduationCap, ChevronLeft, ShieldAlert, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'sonner';

const ACT_LOGO = 'https://arizonachristiantuition.com/wp-content/uploads/2025/12/ACT-Logo-Color.svg';

const GRADE_LEVELS = [
  'Pre-K', 'Kindergarten',
  '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
  '6th Grade', '7th Grade', '8th Grade',
  '9th Grade', '10th Grade', '11th Grade', '12th Grade',
  'Trade/Vocational', 'College',
];

function calcAge(dob: string): number {
  if (!dob) return 0;
  const today = new Date();
  const birth = new Date(dob);
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

export function RegisterStudent() {
  const { registerStudent } = useAuth();
  const navigate = useNavigate();

  // Age gate first
  const [ageGateStep, setAgeGateStep] = useState<'gate' | 'under16' | 'form'>('gate');
  const [dobCheck, setDobCheck] = useState('');
  const [ageGateError, setAgeGateError] = useState('');

  const [form, setForm] = useState({
    firstName: '', lastName: '', nickname: '',
    email: '', gradeLevel: '', dateOfBirth: '',
    parentEmail: '',
    password: '', confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [permissionRequested, setPermissionRequested] = useState(false);
  const [studentAge, setStudentAge] = useState(0);

  const handleAgeCheck = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dobCheck) { setAgeGateError('Please enter your date of birth.'); return; }
    const age = calcAge(dobCheck);
    setStudentAge(age);
    setForm(f => ({ ...f, dateOfBirth: dobCheck }));
    if (age >= 16) setAgeGateStep('form');
    else setAgeGateStep('under16');
  };

  const handleRequestPermission = async () => {
    if (!form.parentEmail) { setErrors({ parentEmail: 'Parent email required to request permission.' }); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    setLoading(false);
    setPermissionRequested(true);
    toast.success('Permission request sent to your parent! 📧');
  };

  const setF = (field: string, val: string) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (!form.gradeLevel) errs.gradeLevel = 'Required';
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
    const result = registerStudent({
      firstName: form.firstName, lastName: form.lastName, nickname: form.nickname,
      email: form.email, gradeLevel: form.gradeLevel, dateOfBirth: form.dateOfBirth,
      parentEmail: form.parentEmail || undefined,
      password: form.password,
    });
    setLoading(false);
    if (result.success) {
      toast.success('Student account created! 🎒');
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
            <GraduationCap size={14} className="text-[#1a2d5a]" />
            <span className="text-xs font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>Student Account</span>
          </div>
          <h1 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.6rem' }}>
            Student Registration
          </h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Students 16+ can register and create campaigns independently.
          </p>
        </div>

        {/* ─── AGE GATE ─────────────────────────────────────────────── */}
        {ageGateStep === 'gate' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-amber-200">
                <ShieldAlert size={28} className="text-amber-500" />
              </div>
              <h2 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.1rem' }}>Age Verification</h2>
              <p className="text-gray-500 text-sm mt-1 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                Students must be <strong>16 years or older</strong> to independently create a campaign. Please verify your age to continue.
              </p>
            </div>
            <form onSubmit={handleAgeCheck} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Your Date of Birth *</label>
                <input
                  type="date" value={dobCheck}
                  max={new Date().toISOString().split('T')[0]}
                  onChange={e => { setDobCheck(e.target.value); setAgeGateError(''); }}
                  className={inp(ageGateError)}
                />
                {ageGateError && <p className="text-xs text-red-500 mt-1">{ageGateError}</p>}
              </div>
              <div className="flex items-start gap-2 p-3 bg-[#e8eef5] rounded-xl border border-[#1a2d5a]/10">
                <ShieldAlert size={14} className="text-[#1a2d5a] mt-0.5 shrink-0" />
                <p className="text-xs text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  If you're under 16, your parent or guardian must grant permission before you can create a scholarship campaign.
                </p>
              </div>
              <button type="submit"
                className="w-full py-3.5 bg-[#1a2d5a] hover:bg-[#142248] text-white rounded-lg font-semibold text-sm transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Verify My Age
              </button>
            </form>
          </div>
        )}

        {/* ─── UNDER 16 GATE ────────────────────────────────────────── */}
        {ageGateStep === 'under16' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            {permissionRequested ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-200">
                  <Check size={28} className="text-emerald-500" />
                </div>
                <h2 className="text-[#1a2d5a] mb-2" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.1rem' }}>Request Sent!</h2>
                <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  We've notified your parent at <strong>{form.parentEmail}</strong>. Once they approve, you'll receive an email to complete your registration.
                </p>
                <button onClick={() => navigate('/')} className="mt-6 w-full py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Return to Home
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3 border-2 border-amber-200">
                    <ShieldAlert size={28} className="text-amber-500" />
                  </div>
                  <h2 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.1rem' }}>
                    Parental Permission Required
                  </h2>
                  <p className="text-gray-500 text-sm mt-1 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    You're <strong>{studentAge} years old</strong>. Students under 16 need a parent or guardian to approve their campaign creation. Enter your parent's email and we'll send them an approval request.
                  </p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Parent / Guardian Email *</label>
                    <input type="email" value={form.parentEmail} onChange={e => setF('parentEmail', e.target.value)} placeholder="parent@example.com" className={inp(errors.parentEmail)} />
                    {errors.parentEmail && <p className="text-xs text-red-500 mt-1">{errors.parentEmail}</p>}
                  </div>
                  <button onClick={handleRequestPermission} disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#c8202d] hover:bg-[#a01825] disabled:opacity-60 text-white rounded-lg font-semibold text-sm transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {loading
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending Request…</>
                      : '📧 Request Parental Permission'
                    }
                  </button>
                  <p className="text-center text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Your parent can also register and add you directly from their parent account.
                  </p>
                </div>
              </>
            )}
          </div>
        )}

        {/* ─── REGISTRATION FORM (16+) ──────────────────────────────── */}
        {ageGateStep === 'form' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <div className="flex items-center gap-2 mb-5 p-3 bg-emerald-50 rounded-xl border border-emerald-100">
              <Check size={14} className="text-emerald-600" />
              <p className="text-xs text-emerald-700 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                Age verified — you're {studentAge} years old. You may create campaigns independently.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>First Name *</label>
                  <input value={form.firstName} onChange={e => setF('firstName', e.target.value)} placeholder="Alex" className={inp(errors.firstName)} />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Last Name *</label>
                  <input value={form.lastName} onChange={e => setF('lastName', e.target.value)} placeholder="Johnson" className={inp(errors.lastName)} />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Nickname (optional)</label>
                <input value={form.nickname} onChange={e => setF('nickname', e.target.value)} placeholder="AJ" className={inp()} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Email Address *</label>
                <input type="email" value={form.email} onChange={e => setF('email', e.target.value)} placeholder="alex@example.com" className={inp(errors.email)} autoComplete="email" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Grade Level *</label>
                  <select value={form.gradeLevel} onChange={e => setF('gradeLevel', e.target.value)} className={inp(errors.gradeLevel) + ' bg-white'}>
                    <option value="">Select grade</option>
                    {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  {errors.gradeLevel && <p className="text-xs text-red-500 mt-1">{errors.gradeLevel}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Parent's Email (optional)</label>
                  <input type="email" value={form.parentEmail} onChange={e => setF('parentEmail', e.target.value)} placeholder="Link to parent account" className={inp()} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Password *</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => setF('password', e.target.value)} placeholder="Min 8 characters" className={inp(errors.password) + ' pr-10'} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><Eye size={16} /></button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Confirm Password *</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setF('confirmPassword', e.target.value)} placeholder="Re-enter password" className={inp(errors.confirmPassword) + ' pr-10'} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff size={16} /></button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(er => ({ ...er, agreed: '' })); }} className="mt-0.5 w-4 h-4 accent-[#1a2d5a]" />
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  I agree to the <a href="#" className="text-[#c8202d] hover:underline">ACT Terms of Service</a>.
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-red-500 -mt-3">{errors.agreed}</p>}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-60 text-white rounded-lg font-semibold text-sm transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account…</>
                  : <><GraduationCap size={16} /> Create Student Account</>
                }
              </button>
            </form>
          </div>
        )}

        <Link to="/register" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2d5a] mt-5 justify-center transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
          <ChevronLeft size={15} /> Back to account types
        </Link>
      </div>
    </div>
  );
}
