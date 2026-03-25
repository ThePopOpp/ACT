import { Link, useNavigate } from 'react-router';
import { ArrowRight, Users, Building2, HeartHandshake, GraduationCap } from 'lucide-react';

const ACT_LOGO = 'https://arizonachristiantuition.com/wp-content/uploads/2025/12/ACT-Logo-Color.svg';

const ACCOUNT_TYPES = [
  {
    type: 'individual',
    icon: <Users size={32} className="text-[#1a2d5a]" />,
    title: 'Individual Donor',
    subtitle: 'Arizona Taxpayer',
    description:
      'Redirect your Arizona state taxes to fund Christian school scholarships. Get up to $1,459 (single) or $2,918 (married) as a dollar-for-dollar tax credit.',
    badge: 'Most Common',
    badgeColor: 'bg-emerald-100 text-emerald-700',
    to: '/register/individual',
  },
  {
    type: 'business',
    icon: <Building2 size={32} className="text-[#1a2d5a]" />,
    title: 'Business Donor',
    subtitle: 'Corporation / LLC / Organization',
    description:
      'Arizona businesses can contribute up to $1,000 per employee through the Corporate School Tuition Tax Credit — a powerful way to invest in your community.',
    badge: 'Corporate Tax Credit',
    badgeColor: 'bg-blue-100 text-blue-700',
    to: '/register/business',
  },
  {
    type: 'parent',
    icon: <HeartHandshake size={32} className="text-[#1a2d5a]" />,
    title: 'Parent / Guardian',
    subtitle: 'Start a Campaign for Your Child',
    description:
      "Create a tuition scholarship campaign for your child's Christian school. Add your students, set a funding goal, and share with your community.",
    badge: 'Create Campaigns',
    badgeColor: 'bg-violet-100 text-violet-700',
    to: '/register/parent',
  },
  {
    type: 'student',
    icon: <GraduationCap size={32} className="text-[#1a2d5a]" />,
    title: 'Student',
    subtitle: 'Age 16+ or with Parental Permission',
    description:
      'Students 16 and older can create their own scholarship campaigns. Students under 16 may apply with a parent\'s permission — your parent will receive an approval request.',
    badge: 'Age Gate Required',
    badgeColor: 'bg-amber-100 text-amber-700',
    to: '/register/student',
  },
];

export function Register() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#e8eef5] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/">
            <img src={ACT_LOGO} alt="Arizona Christian Tuition" className="h-14 w-auto mx-auto mb-6" />
          </Link>
          <h1
            className="text-[#1a2d5a] mb-3"
            style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '2rem' }}
          >
            Create Your ACT Account
          </h1>
          <p className="text-gray-600 max-w-xl mx-auto text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Choose the account type that best describes you. All account types support Arizona's
            Private School Tax Credit system.
          </p>
          <p className="text-sm text-gray-500 mt-3" style={{ fontFamily: 'Inter, sans-serif' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-[#c8202d] font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* Account type cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {ACCOUNT_TYPES.map(acct => (
            <button
              key={acct.type}
              onClick={() => navigate(acct.to)}
              className="group text-left bg-white rounded-2xl border-2 border-gray-100 hover:border-[#1a2d5a]/30 hover:shadow-md p-6 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-14 h-14 bg-[#e8eef5] rounded-xl flex items-center justify-center group-hover:bg-[#1a2d5a]/10 transition-colors">
                  {acct.icon}
                </div>
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${acct.badgeColor}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                  {acct.badge}
                </span>
              </div>

              <h2
                className="text-[#1a2d5a] mb-0.5"
                style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.1rem' }}
              >
                {acct.title}
              </h2>
              <p className="text-xs text-gray-400 mb-3 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                {acct.subtitle}
              </p>
              <p className="text-sm text-gray-600 leading-relaxed mb-5" style={{ fontFamily: 'Inter, sans-serif' }}>
                {acct.description}
              </p>

              <div className="flex items-center gap-2 text-[#c8202d] font-semibold text-sm group-hover:gap-3 transition-all" style={{ fontFamily: 'Inter, sans-serif' }}>
                Get Started <ArrowRight size={15} />
              </div>
            </button>
          ))}
        </div>

        {/* Tax credit banner */}
        <div className="mt-8 bg-[#1a2d5a] text-white rounded-2xl p-6 text-center">
          <p
            className="text-white/90 text-sm leading-relaxed"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            🏛️ <strong>Arizona Private School Tax Credit (A.R.S. § 43-1089)</strong> — All donations made through ACT
            qualify for a dollar-for-dollar Arizona state tax credit. You aren't just donating — you're redirecting
            taxes you already owe.
          </p>
        </div>
      </div>
    </div>
  );
}