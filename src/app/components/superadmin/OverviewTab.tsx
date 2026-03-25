import { useState } from 'react';
import { TrendingUp, Users, DollarSign, BookOpen, Clock, CheckCircle, AlertTriangle, ArrowUpRight, Award } from 'lucide-react';
import { Campaign } from '../../data/mockData';
import { AuthUser } from '../../context/AuthContext';

const MONTHS = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'];
const REVENUE_DATA = [28400, 34100, 41200, 38900, 52300, 61800, 47200, 58900, 72400];
const DONOR_DATA = [14, 19, 23, 21, 28, 34, 26, 31, 41];

const RECENT_ACTIVITY = [
  { id: 1, type: 'donation', icon: '💳', text: 'Anonymous donated $2,500 to Covenant Christian Academy', time: '4 min ago', color: 'text-emerald-600' },
  { id: 2, type: 'campaign', icon: '🏫', text: 'New campaign submitted: "Desert Ridge Christian — STEM Lab"', time: '22 min ago', color: 'text-blue-600' },
  { id: 3, type: 'user', icon: '👤', text: 'New parent account registered: Sarah Mitchell', time: '1h ago', color: 'text-violet-600' },
  { id: 4, type: 'payment', icon: '✅', text: 'Tax receipt #AZ-20260324-8812 issued to Jordan P.', time: '2h ago', color: 'text-[#1a2d5a]' },
  { id: 5, type: 'campaign', icon: '🎉', text: 'SonRise Academy reached 100% of $45,000 goal!', time: '3h ago', color: 'text-amber-600' },
  { id: 6, type: 'user', icon: '🏢', text: 'Business account approved: Desert Sun Construction LLC', time: '5h ago', color: 'text-gray-600' },
  { id: 7, type: 'donation', icon: '💳', text: 'Desert Sun Construction donated $8,000 to 3 campaigns', time: '6h ago', color: 'text-emerald-600' },
  { id: 8, type: 'campaign', icon: '⏳', text: 'Campaign ending soon: Phoenix Prep Athletic Fund (3 days)', time: '8h ago', color: 'text-[#c8202d]' },
];

interface Props {
  campaigns: Campaign[];
  users: AuthUser[];
}

export function OverviewTab({ campaigns, users }: Props) {
  const [chartView, setChartView] = useState<'revenue' | 'donors'>('revenue');

  const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0);
  const totalGoal = campaigns.reduce((s, c) => s + c.goal, 0);
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const pendingCampaigns = 4; // mock
  const totalUsers = users.length;
  const totalDonors = users.filter(u => u.accountType === 'individual_donor' || u.accountType === 'business_donor').length;

  const data = chartView === 'revenue' ? REVENUE_DATA : DONOR_DATA;
  const maxVal = Math.max(...data);

  const STAT_CARDS = [
    {
      label: 'Total Raised', value: `$${(totalRaised / 1000).toFixed(0)}K`,
      sub: `of $${(totalGoal / 1000).toFixed(0)}K goal`, icon: <DollarSign size={20} />,
      color: 'bg-emerald-50 text-emerald-600', trend: '+18.4% this month',
    },
    {
      label: 'Active Campaigns', value: activeCampaigns.toString(),
      sub: `${pendingCampaigns} pending review`, icon: <BookOpen size={20} />,
      color: 'bg-blue-50 text-blue-600', trend: '+3 this week',
    },
    {
      label: 'Total Users', value: totalUsers.toString(),
      sub: `${totalDonors} donors`, icon: <Users size={20} />,
      color: 'bg-violet-50 text-violet-600', trend: '+12 this week',
    },
    {
      label: 'Avg. Donation', value: '$1,847',
      sub: 'per transaction', icon: <Award size={20} />,
      color: 'bg-amber-50 text-amber-600', trend: '+$203 vs last month',
    },
    {
      label: 'Tax Receipts', value: '238',
      sub: 'issued YTD', icon: <CheckCircle size={20} />,
      color: 'bg-teal-50 text-teal-600', trend: '12 pending',
    },
    {
      label: 'Pending Approvals', value: pendingCampaigns.toString(),
      sub: 'campaigns awaiting review', icon: <AlertTriangle size={20} />,
      color: 'bg-rose-50 text-rose-600', trend: 'Needs attention',
    },
  ];

  const topCampaigns = [...campaigns]
    .sort((a, b) => (b.raised / b.goal) - (a.raised / a.goal))
    .slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {STAT_CARDS.map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
                {card.icon}
              </div>
              <span className="text-xs text-gray-400 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{card.trend}</span>
            </div>
            <div className="text-2xl text-[#1a2d5a] font-bold mb-0.5" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
              {card.value}
            </div>
            <div className="text-sm text-gray-500 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{card.label}</div>
            <div className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1rem' }}>
              Platform Performance
            </h3>
            <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
              <button onClick={() => setChartView('revenue')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${chartView === 'revenue' ? 'bg-white text-[#1a2d5a] shadow-sm' : 'text-gray-500'}`}
                style={{ fontFamily: 'Inter, sans-serif' }}>Revenue</button>
              <button onClick={() => setChartView('donors')}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${chartView === 'donors' ? 'bg-white text-[#1a2d5a] shadow-sm' : 'text-gray-500'}`}
                style={{ fontFamily: 'Inter, sans-serif' }}>Donors</button>
            </div>
          </div>
          <div className="flex items-end gap-2 h-36">
            {data.map((val, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full relative flex items-end justify-center" style={{ height: 120 }}>
                  <div
                    className="w-full rounded-t-lg transition-all duration-500"
                    style={{
                      height: `${(val / maxVal) * 100}%`,
                      background: i === data.length - 1 ? '#1a2d5a' : '#e8eef5',
                    }}
                  />
                </div>
                <span className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>{MONTHS[i]}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-6 pt-3 border-t border-gray-100">
            <div>
              <div className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>This month</div>
              <div className="text-sm font-bold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                {chartView === 'revenue' ? '$72,400' : '41 donors'}
              </div>
            </div>
            <div className="flex items-center gap-1 text-emerald-500">
              <ArrowUpRight size={14} />
              <span className="text-xs font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                {chartView === 'revenue' ? '+22.9%' : '+32.3%'} vs last month
              </span>
            </div>
          </div>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1rem' }}>
              Live Activity
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" /> Live
            </span>
          </div>
          <div className="space-y-4 overflow-y-auto" style={{ maxHeight: 280 }}>
            {RECENT_ACTIVITY.map(item => (
              <div key={item.id} className="flex items-start gap-3">
                <span className="text-base mt-0.5">{item.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs leading-relaxed ${item.color}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                    {item.text}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top campaigns */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1rem' }}>
            Top Performing Campaigns
          </h3>
          <span className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>By funding %</span>
        </div>
        <div className="space-y-4">
          {topCampaigns.map((c, i) => {
            const pct = Math.min(100, Math.round((c.raised / c.goal) * 100));
            return (
              <div key={c.id} className="flex items-center gap-4">
                <div className="w-6 text-xs font-bold text-gray-300 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>#{i + 1}</div>
                <img src={c.image} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-[#1a2d5a] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{c.title}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                      <div className="h-full bg-[#1a2d5a] rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs font-bold text-[#1a2d5a] shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>{pct}%</span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                    ${c.raised.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                    of ${c.goal.toLocaleString()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
