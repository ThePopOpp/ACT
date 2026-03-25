import { Link } from 'react-router';
import { ArrowRight, Heart, Shield, Globe, Zap, ChevronRight, Clock } from 'lucide-react';
import { CampaignCard } from '../components/CampaignCard';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

const CATEGORY_ICONS: Record<string, string> = {
  PreSchools: '🧸',
  'Elementary Schools': '✏️',
  'Middle Schools': '📖',
  'High Schools': '🎓',
  'Trade Schools': '🔧',
  'Private Schools': '🏛️',
  STEM: '🔬',
  Vocational: '🛠️',
  Scholarships: '🏅',
  'Business Schools': '💼',
  'Music School': '🎵',
  'All Grades': '🏫',
};

const STATS = [
  { label: 'Tax Credits Donated', value: '$8.2M', sub: 'redirected to Christian schools' },
  { label: 'Students Funded', value: '3,840', sub: 'in 2025–26 school year' },
  { label: 'Partner Schools', value: '94', sub: 'across Arizona' },
  { label: 'Tax Credit Return', value: '100%', sub: 'donors receive full credit back' },
];

const HOW_IT_WORKS = [
  { icon: <Heart size={22} className="text-[#c8202d]" />, title: 'Choose a Campaign', desc: 'Browse certified Arizona Christian schools and select the scholarship campaign that speaks to your heart.' },
  { icon: <Globe size={22} className="text-[#c8202d]" />, title: 'Make Your Donation', desc: 'Give securely through our platform. ACT is a state-certified School Tuition Organization.' },
  { icon: <Shield size={22} className="text-[#c8202d]" />, title: 'Claim Your Tax Credit', desc: 'You receive a receipt to attach to your AZ state return — and get every dollar back as a tax credit.' },
  { icon: <Zap size={22} className="text-[#c8202d]" />, title: 'Change a Child\'s Future', desc: 'Your gift funds a scholarship that opens the door to a Christ-centered education for a deserving student.' },
];

export function Home() {
  const { campaigns } = useApp();
  const featured = campaigns.filter(c => c.featured).slice(0, 4);
  const trending = campaigns
    .filter(c => !c.featured)
    .sort((a, b) => b.backers - a.backers)
    .slice(0, 4);
  const endingSoon = campaigns
    .filter(c => c.daysLeft <= 12 && c.status !== 'funded')
    .sort((a, b) => a.daysLeft - b.daysLeft)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#e8eef5]">
      {/* Hero */}
      <section className="relative bg-[#e8eef5] overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 py-20 md:py-28 text-center">
          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[#1a2d5a] text-sm mb-8">
            <Clock size={14} className="text-[#1a2d5a]" />
            <span>Donate Today</span>
            <span className="text-gray-400">·</span>
            <span>It Only Takes 3 Minutes</span>
          </div>

          {/* Headline — matches ACT site style */}
          <h1
            className="leading-tight tracking-tight mb-6"
            style={{ fontFamily: 'Merriweather, Georgia, serif' }}
          >
            <span className="block text-[#1a2d5a]" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900 }}>
              Turn Your Arizona Taxes
            </span>
            <span
              className="block italic text-gray-400"
              style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 700 }}
            >
              Into Private{' '}
              <span className="not-italic text-[#c8202d]" style={{ fontWeight: 900 }}>
                Christian
              </span>
            </span>
            <span className="block text-[#1a2d5a]" style={{ fontSize: 'clamp(2.4rem, 5vw, 4rem)', fontWeight: 900 }}>
              Education &amp; Tuition
            </span>
          </h1>

          <p className="text-gray-600 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed">
            Your state tax dollars can fund a child's education instead of disappearing into the general fund.
            Through Arizona's tax credit program, you can give and get back—helping students and families
            without spending anything beyond what you already owe in state taxes.
          </p>

          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/create"
              className="flex items-center gap-2 px-8 py-3.5 bg-[#1a2d5a] hover:bg-[#142248] text-white font-bold rounded text-sm transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Get Started
            </Link>
            <Link
              to="/browse"
              className="flex items-center gap-2 px-8 py-3.5 bg-white border-2 border-[#1a2d5a] text-[#1a2d5a] font-bold rounded text-sm hover:bg-[#edf2f8] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Donate Today
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
          {STATS.map(stat => (
            <div key={stat.label} className="text-center">
              <div
                className="text-[#1a2d5a]"
                style={{ fontFamily: 'Merriweather, Georgia, serif', fontSize: '1.75rem', fontWeight: 900 }}
              >
                {stat.value}
              </div>
              <div className="text-xs text-[#c8202d] font-semibold mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.label}</div>
              <div className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Campaigns */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2
              className="text-[#1a2d5a]"
              style={{ fontFamily: 'Merriweather, Georgia, serif', fontSize: '1.6rem', fontWeight: 700 }}
            >
              Featured Campaigns
            </h2>
            <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Certified Arizona Christian schools seeking your tax credit dollars</p>
          </div>
          <Link to="/browse" className="flex items-center gap-1 text-sm text-[#c8202d] hover:text-[#a01825] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
            View all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {featured.map(c => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2
            className="text-[#1a2d5a] mb-6"
            style={{ fontFamily: 'Merriweather, Georgia, serif', fontSize: '1.3rem', fontWeight: 700 }}
          >
            Browse by School Type
          </h2>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-11 gap-3">
            {CATEGORIES.map(cat => (
              <Link
                key={cat}
                to={`/browse?category=${encodeURIComponent(cat)}`}
                className="flex flex-col items-center gap-2 p-3 rounded-xl hover:bg-[#edf2f8] hover:border-[#1a2d5a]/30 border border-gray-100 transition-all group"
              >
                <span className="text-2xl">{CATEGORY_ICONS[cat]}</span>
                <span
                  className="text-xs text-gray-600 group-hover:text-[#1a2d5a] font-medium text-center leading-tight"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {cat}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Trending */}
      <section className="max-w-7xl mx-auto px-6 py-16">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h2
              className="text-[#1a2d5a]"
              style={{ fontFamily: 'Merriweather, Georgia, serif', fontSize: '1.6rem', fontWeight: 700 }}
            >
              🔥 Gaining Momentum
            </h2>
            <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Most active campaigns this week</p>
          </div>
          <Link to="/browse?sort=trending" className="flex items-center gap-1 text-sm text-[#c8202d] hover:text-[#a01825] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
            See all <ChevronRight size={16} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {trending.map(c => <CampaignCard key={c.id} campaign={c} />)}
        </div>
      </section>

      {/* Ending Soon */}
      {endingSoon.length > 0 && (
        <section className="bg-[#fdf6f6] border-y border-[#f0d0d0] py-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2
                  className="text-[#1a2d5a]"
                  style={{ fontFamily: 'Merriweather, Georgia, serif', fontSize: '1.6rem', fontWeight: 700 }}
                >
                  ⏳ Ending Soon
                </h2>
                <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>These campaigns are closing — don't miss your chance to give</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {endingSoon.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2
            className="text-[#1a2d5a]"
            style={{ fontFamily: 'Merriweather, Georgia, serif', fontSize: '2rem', fontWeight: 700 }}
          >
            How the Arizona Tax Credit Works
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
            Arizona's Private School Tax Credit (A.R.S. § 43-1089) lets you redirect your state tax dollars
            directly to certified Christian schools — at zero cost to you.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {HOW_IT_WORKS.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-12 h-12 bg-[#edf2f8] border-2 border-[#1a2d5a]/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                {step.icon}
              </div>
              <div
                className="text-xs font-bold text-[#c8202d] uppercase tracking-widest mb-2"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Step {i + 1}
              </div>
              <h3
                className="text-[#1a2d5a] mb-2"
                style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1rem' }}
              >
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tax credit info banner */}
      <section className="bg-[#1a2d5a] mx-6 mb-16 rounded-2xl overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 py-14 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div
              className="text-[#c8202d] text-xs font-bold uppercase tracking-widest mb-2"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Arizona Tax Credit — A.R.S. § 43-1089
            </div>
            <h2
              className="text-white mb-2"
              style={{ fontFamily: 'Merriweather, Georgia, serif', fontSize: '1.5rem', fontWeight: 700 }}
            >
              Give Today. Owe Less in April.
            </h2>
            <p className="text-blue-200 text-sm max-w-md leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
              Singles can redirect up to $1,459 and married couples up to $2,918 of Arizona state taxes
              to certified Christian school scholarships — completely dollar-for-dollar.
            </p>
          </div>
          <Link
            to="/browse"
            className="shrink-0 flex items-center gap-2 px-8 py-4 bg-white text-[#1a2d5a] font-bold rounded hover:bg-[#edf2f8] transition-colors text-sm"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Donate Today <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}