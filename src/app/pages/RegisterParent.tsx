import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Eye, EyeOff, HeartHandshake, ChevronLeft, Plus, Trash2, User, Check } from 'lucide-react';
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

interface StudentDraft {
  firstName: string;
  lastName: string;
  nickname: string;
  gradeLevel: string;
  dateOfBirth: string;
}

const EMPTY_STUDENT: StudentDraft = { firstName: '', lastName: '', nickname: '', gradeLevel: '', dateOfBirth: '' };

export function RegisterParent() {
  const { registerParent, addStudentToParent, currentUser } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'parent' | 'students' | 'done'>('parent');

  // Parent form
  const [form, setForm] = useState({
    firstName: '', lastName: '', nickname: '',
    email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPw, setShowPw] = useState(false);
  const [showCPw, setShowCPw] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [registeredParentId, setRegisteredParentId] = useState('');

  // Students
  const [students, setStudents] = useState<StudentDraft[]>([{ ...EMPTY_STUDENT }]);

  const setF = (field: string, val: string) => {
    setForm(f => ({ ...f, [field]: val }));
    setErrors(e => ({ ...e, [field]: '' }));
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.firstName.trim()) errs.firstName = 'Required';
    if (!form.lastName.trim()) errs.lastName = 'Required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Valid email required';
    if (form.password.length < 8) errs.password = 'Min 8 characters';
    if (form.password !== form.confirmPassword) errs.confirmPassword = 'Passwords do not match';
    if (!agreed) errs.agreed = 'You must agree to the terms';
    return errs;
  };

  const handleParentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setLoading(true);
    const result = await registerParent({
      firstName: form.firstName, lastName: form.lastName, nickname: form.nickname,
      email: form.email, phone: form.phone, password: form.password,
    });
    setLoading(false);
    if (result.success) {
      setStep('students');
    } else {
      setErrors({ email: result.message });
    }
  };

  const updateStudent = (i: number, field: keyof StudentDraft, val: string) => {
    setStudents(prev => prev.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  };
  const addStudent = () => setStudents(prev => [...prev, { ...EMPTY_STUDENT }]);
  const removeStudent = (i: number) => setStudents(prev => prev.filter((_, idx) => idx !== i));

  const handleStudentsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // currentUser should be set by now
    const parentId = currentUser?.id;
    if (parentId) {
      for (const s of students.filter(st => st.firstName && st.lastName)) {
        await addStudentToParent(parentId, {
          firstName: s.firstName,
          lastName: s.lastName,
          nickname: s.nickname || undefined,
          gradeLevel: s.gradeLevel || 'Unknown',
          dateOfBirth: s.dateOfBirth || '',
        });
      }
    }
    setLoading(false);
    setStep('done');
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
            <HeartHandshake size={14} className="text-[#1a2d5a]" />
            <span className="text-xs font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>Parent / Guardian Account</span>
          </div>
          <h1 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.6rem' }}>
            Parent Registration
          </h1>
          <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
            Create your account, then add your students to start a campaign.
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-3 mb-6 justify-center">
          {['Your Info', 'Add Students', 'Done'].map((label, i) => {
            const stepKey = ['parent', 'students', 'done'][i] as typeof step;
            const done = (step === 'students' && i === 0) || (step === 'done' && i <= 1);
            const active = step === stepKey;
            return (
              <div key={label} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${done ? 'bg-emerald-500 text-white' : active ? 'bg-[#1a2d5a] text-white' : 'bg-gray-200 text-gray-400'}`}>
                  {done ? <Check size={12} /> : i + 1}
                </div>
                <span className={`text-xs font-medium ${active ? 'text-[#1a2d5a]' : done ? 'text-emerald-600' : 'text-gray-400'}`} style={{ fontFamily: 'Inter, sans-serif' }}>{label}</span>
                {i < 2 && <div className={`w-8 h-0.5 ${done ? 'bg-emerald-400' : 'bg-gray-200'}`} />}
              </div>
            );
          })}
        </div>

        {/* ─── STEP 1: PARENT INFO ─────────────────────────────────────── */}
        {step === 'parent' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8">
            <form onSubmit={handleParentSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>First Name *</label>
                  <input value={form.firstName} onChange={e => setF('firstName', e.target.value)} placeholder="Sarah" className={inp(errors.firstName)} />
                  {errors.firstName && <p className="text-xs text-red-500 mt-1">{errors.firstName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Last Name *</label>
                  <input value={form.lastName} onChange={e => setF('lastName', e.target.value)} placeholder="Mitchell" className={inp(errors.lastName)} />
                  {errors.lastName && <p className="text-xs text-red-500 mt-1">{errors.lastName}</p>}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Nickname (optional)</label>
                <input value={form.nickname} onChange={e => setF('nickname', e.target.value)} placeholder="What should we call you?" className={inp()} />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Email Address *</label>
                <input type="email" value={form.email} onChange={e => setF('email', e.target.value)} placeholder="sarah@example.com" className={inp(errors.email)} autoComplete="email" />
                {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Phone Number (optional)</label>
                <input type="tel" value={form.phone} onChange={e => setF('phone', e.target.value)} placeholder="(602) 555-0100" className={inp()} />
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
                  <input type={showCPw ? 'text' : 'password'} value={form.confirmPassword} onChange={e => setF('confirmPassword', e.target.value)} placeholder="Re-enter password" className={inp(errors.confirmPassword) + ' pr-10'} autoComplete="new-password" />
                  <button type="button" onClick={() => setShowCPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"><EyeOff size={16} /></button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
              </div>

              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={agreed} onChange={e => { setAgreed(e.target.checked); setErrors(er => ({ ...er, agreed: '' })); }} className="mt-0.5 w-4 h-4 accent-[#1a2d5a]" />
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  I agree to the <a href="#" className="text-[#c8202d] hover:underline">ACT Terms of Service</a> and <a href="#" className="text-[#c8202d] hover:underline">Privacy Policy</a>.
                </span>
              </label>
              {errors.agreed && <p className="text-xs text-red-500 -mt-3">{errors.agreed}</p>}

              <button type="submit" disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-60 text-white rounded-lg font-semibold text-sm transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {loading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Creating Account…</>
                  : <><HeartHandshake size={16} /> Create Parent Account &amp; Continue</>
                }
              </button>
            </form>
            <div className="mt-5 pt-5 border-t border-gray-100 text-center">
              <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                Already have an account? <Link to="/login" className="text-[#c8202d] font-semibold hover:underline">Sign in</Link>
              </p>
            </div>
          </div>
        )}

        {/* ─── STEP 2: ADD STUDENTS ─────────────────────────────────────── */}
        {step === 'students' && (
          <div className="space-y-5">
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4 p-3 bg-[#e8eef5] rounded-xl">
                <div className="w-8 h-8 bg-[#1a2d5a]/10 rounded-full flex items-center justify-center">
                  <User size={14} className="text-[#1a2d5a]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>Welcome, {form.firstName}!</p>
                  <p className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Now add your student(s) to your account.</p>
                </div>
              </div>

              <form onSubmit={handleStudentsSubmit} className="space-y-5">
                {students.map((student, i) => (
                  <div key={i} className="p-5 border border-gray-100 rounded-xl space-y-4 relative">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>Student {i + 1}</h4>
                      {students.length > 1 && (
                        <button type="button" onClick={() => removeStudent(i)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>First Name *</label>
                        <input value={student.firstName} onChange={e => updateStudent(i, 'firstName', e.target.value)} placeholder="Emma" className={inp()} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Last Name *</label>
                        <input value={student.lastName} onChange={e => updateStudent(i, 'lastName', e.target.value)} placeholder="Mitchell" className={inp()} />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Nickname (optional)</label>
                      <input value={student.nickname} onChange={e => updateStudent(i, 'nickname', e.target.value)} placeholder="Em" className={inp()} />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Grade Level</label>
                        <select value={student.gradeLevel} onChange={e => updateStudent(i, 'gradeLevel', e.target.value)} className={inp() + ' bg-white'}>
                          <option value="">Select grade</option>
                          {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Date of Birth</label>
                        <input type="date" value={student.dateOfBirth} onChange={e => updateStudent(i, 'dateOfBirth', e.target.value)} className={inp()} />
                      </div>
                    </div>
                  </div>
                ))}

                <button type="button" onClick={addStudent}
                  className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 hover:border-[#1a2d5a]/40 rounded-xl text-sm text-gray-500 hover:text-[#1a2d5a] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Plus size={15} /> Add Another Student
                </button>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => { navigate('/dashboard'); toast.success('Parent account created! Add students from your dashboard anytime.'); }}
                    className="flex-1 py-3 border border-gray-200 rounded-lg text-sm text-gray-500 hover:bg-gray-50 transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Skip for Now
                  </button>
                  <button type="submit" disabled={loading}
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-60 text-white rounded-lg font-semibold text-sm transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Check size={15} /> Save Students</>}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ─── STEP 3: DONE ─────────────────────────────────────────────── */}
        {step === 'done' && (
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 text-center">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-emerald-200">
              <Check size={36} className="text-emerald-500" />
            </div>
            <h2 className="text-[#1a2d5a] mb-2" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.5rem' }}>
              Account Created! 🙏
            </h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
              Your parent account and student profile(s) are ready. You can now start a campaign for your child's Christian school tuition.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => navigate('/create')}
                className="w-full py-3.5 bg-[#1a2d5a] hover:bg-[#142248] text-white rounded-lg font-semibold text-sm transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Start a Campaign Now
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className="w-full py-3 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Go to My Dashboard
              </button>
            </div>
          </div>
        )}

        {step === 'parent' && (
          <Link to="/register" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1a2d5a] mt-5 justify-center transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
            <ChevronLeft size={15} /> Back to account types
          </Link>
        )}
      </div>
    </div>
  );
}
