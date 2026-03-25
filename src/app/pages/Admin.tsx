import { useState } from 'react';
import { Link } from 'react-router';
import {
  TrendingUp, Users, DollarSign, BarChart2,
  CheckCircle, Clock, Eye, Search, ChevronUp, ChevronDown,
} from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';

const MONTHLY_DATA = [
  { month: 'Sep', raised: 620000, campaigns: 68, donors: 2100 },
  { month: 'Oct', raised: 840000, campaigns: 82, donors: 2900 },
  { month: 'Nov', raised: 780000, campaigns: 74, donors: 2600 },
  { month: 'Dec', raised: 1100000, campaigns: 98, donors: 3900 },
  { month: 'Jan', raised: 980000, campaigns: 88, donors: 3400 },
  { month: 'Feb', raised: 1340000, campaigns: 114, donors: 4600 },
  { month: 'Mar', raised: 1580000, campaigns: 132, donors: 5400 },
];

const CATEGORY_DATA = [
  { name: 'Elementary', value: 24, color: '#1a2d5a' },
  { name: 'High School', value: 20, color: '#c8202d' },
  { name: 'Special Needs', value: 16, color: '#2d6eb5' },
  { name: 'STEM', value: 14, color: '#10B981' },
  { name: 'All Grades', value: 12, color: '#6366F1' },
  { name: 'Other', value: 14, color: '#94A3B8' },
];

function StatCard({ icon, label, value, change, color }: { icon: React.ReactNode; label: string; value: string; change: string; color: string }) {
  const isPositive = change.startsWith('+');
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>{icon}</div>
        <span className={`flex items-center gap-1 text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
          {isPositive ? <ChevronUp size={12} /> : <ChevronDown size={12} />} {change}
        </span>
      </div>
      <div className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.5rem' }}>{value}</div>
      <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</div>
    </div>
  );
}

type AdminTab = 'overview' | 'campaigns' | 'donors';

export function Admin() {
  const { campaigns } = useApp();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [campaignSearch, setCampaignSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalRaised = campaigns.reduce((s, c) => s + c.raised, 0);
  const totalDonors = campaigns.reduce((s, c) => s + c.backers, 0);

  const filteredCampaigns = campaigns.filter(c => {
    const matchSearch = c.title.toLowerCase().includes(campaignSearch.toLowerCase()) ||
      c.creator.name.toLowerCase().includes(campaignSearch.toLowerCase());
    const matchStatus = statusFilter === 'all' || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const TABS: { id: AdminTab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'campaigns', label: `Campaigns (${campaigns.length})` },
    { id: 'donors', label: 'Donors' },
  ];

  return (
    <div className="min-h-screen bg-[#e8eef5]">
      {/* Header */}
      <div className="bg-[#1a2d5a] text-white">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-xs text-blue-200 font-semibold uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Admin Panel</span>
              </div>
              <h1 style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.5rem' }}>
                Arizona Christian Tuition — Admin
              </h1>
              <p className="text-blue-200 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Platform analytics — March 2026</p>
            </div>
            <div className="text-right">
              <div className="text-[#c8202d] text-xs font-bold uppercase tracking-widest mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>AZ Tax Credit Program</div>
              <div style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.5rem' }}>
                ${(totalRaised / 1000000).toFixed(1)}M
              </div>
              <div className="text-blue-200 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>total tax credits redirected</div>
            </div>
          </div>

          <div className="flex gap-1 mt-8">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 text-sm rounded-lg transition-colors ${activeTab === tab.id ? 'bg-white/15 text-white font-bold' : 'text-blue-200 hover:text-white hover:bg-white/5'}`}
                style={{ fontFamily: 'Inter, sans-serif' }}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* ── Overview ── */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={<DollarSign size={18} className="text-[#1a2d5a]" />} label="Tax Credits Donated" value={`$${(totalRaised / 1000000).toFixed(1)}M`} change="+19%" color="bg-[#edf2f8]" />
              <StatCard icon={<Users size={18} className="text-emerald-600" />} label="Total Donors" value={totalDonors.toLocaleString()} change="+15%" color="bg-emerald-50" />
              <StatCard icon={<TrendingUp size={18} className="text-blue-600" />} label="Active Campaigns" value={campaigns.filter(c => c.status === 'active').length.toString()} change="+8%" color="bg-blue-50" />
              <StatCard icon={<BarChart2 size={18} className="text-[#c8202d]" />} label="Students Funded" value="3,840" change="+22%" color="bg-red-50" />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>Monthly Tax Credits Redirected</h3>
                    <p className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Sep 2025 – Mar 2026</p>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full" style={{ fontFamily: 'Inter, sans-serif' }}>+19% MoM</span>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={MONTHLY_DATA}>
                    <defs>
                      <linearGradient id="navyGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1a2d5a" stopOpacity={0.2} />
                        <stop offset="100%" stopColor="#1a2d5a" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} />
                    <Tooltip formatter={(v: number) => [`$${(v / 1000).toFixed(0)}k`, 'Raised']} contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
                    <Area type="monotone" dataKey="raised" stroke="#1a2d5a" strokeWidth={2} fill="url(#navyGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <h3 className="text-[#1a2d5a] mb-6" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>By School Type</h3>
                <ResponsiveContainer width="100%" height={140}>
                  <PieChart>
                    <Pie data={CATEGORY_DATA} cx="50%" cy="50%" innerRadius={40} outerRadius={65} paddingAngle={3} dataKey="value">
                      {CATEGORY_DATA.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                    </Pie>
                    <Tooltip formatter={(v: number) => [`${v}%`, '']} contentStyle={{ borderRadius: 8, border: '1px solid #E5E7EB', fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-4">
                  {CATEGORY_DATA.slice(0, 4).map(item => (
                    <div key={item.name} className="flex items-center justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ background: item.color }} />
                        <span className="text-gray-600">{item.name}</span>
                      </div>
                      <span className="font-semibold text-gray-900">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-[#1a2d5a] mb-6" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>Monthly Donor Activity</h3>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={MONTHLY_DATA} barSize={20}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
                  <Bar dataKey="donors" fill="#1a2d5a" opacity={0.9} radius={[4, 4, 0, 0]} name="Donors" />
                  <Bar dataKey="campaigns" fill="#c8202d" opacity={0.85} radius={[4, 4, 0, 0]} name="Campaigns" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}

        {/* ── Campaigns ── */}
        {activeTab === 'campaigns' && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative flex-1 min-w-[200px] max-w-xs">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search campaigns or schools…"
                  value={campaignSearch} onChange={e => setCampaignSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 bg-white"
                  style={{ fontFamily: 'Inter, sans-serif' }} />
              </div>
              {['all', 'active', 'funded', 'ending_soon'].map(s => (
                <button key={s} onClick={() => setStatusFilter(s)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors ${statusFilter === s ? 'bg-[#1a2d5a] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1a2d5a]/40'}`}
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {s === 'all' ? 'All' : s.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-100">
                      {['Campaign', 'School', 'Type', 'Raised / Goal', 'Donors', 'Days Left', 'Status', ''].map(h => (
                        <th key={h} className="text-left text-xs font-semibold text-gray-500 px-4 py-3 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredCampaigns.map(c => {
                      const pct = Math.round(c.raised / c.goal * 100);
                      return (
                        <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <img src={c.image} alt="" className="w-9 h-9 rounded-lg object-cover" />
                              <span className="font-medium text-gray-900 text-sm line-clamp-1 max-w-[160px]" style={{ fontFamily: 'Inter, sans-serif' }}>{c.title}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <img src={c.creator.avatar} alt="" className="w-6 h-6 rounded-full" />
                              <span className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{c.creator.name}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span className="text-xs text-gray-500 bg-[#edf2f8] text-[#1a2d5a] px-2 py-0.5 rounded font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{c.category}</span>
                          </td>
                          <td className="px-4 py-3">
                            <div className="text-xs space-y-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                              <div className="flex justify-between">
                                <span className="font-semibold text-gray-900">${(c.raised / 1000).toFixed(0)}k</span>
                                <span className="text-gray-400">${(c.goal / 1000).toFixed(0)}k</span>
                              </div>
                              <div className="w-24 h-1 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-[#1a2d5a] rounded-full" style={{ width: `${pct}%` }} />
                              </div>
                              <div className="text-[#1a2d5a] font-semibold">{pct}%</div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{c.backers.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            <span className={`flex items-center gap-1 text-xs ${c.daysLeft <= 7 ? 'text-[#c8202d] font-semibold' : 'text-gray-500'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                              <Clock size={11} /> {c.daysLeft}d
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${c.status === 'funded' ? 'bg-emerald-100 text-emerald-700' : c.status === 'ending_soon' ? 'bg-red-100 text-[#c8202d]' : 'bg-[#edf2f8] text-[#1a2d5a]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                              {c.status === 'funded' ? <span className="flex items-center gap-1"><CheckCircle size={10} /> Funded</span> :
                               c.status === 'ending_soon' ? 'Ending Soon' : 'Active'}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <Link to={`/campaign/${c.id}`} className="p-1.5 hover:bg-[#edf2f8] rounded-lg text-gray-400 hover:text-[#1a2d5a] transition-colors inline-block">
                              <Eye size={14} />
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── Donors ── */}
        {activeTab === 'donors' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Donors', value: '38,412', color: 'text-[#1a2d5a]' },
                { label: 'School Administrators', value: '94', color: 'text-blue-600' },
                { label: 'Individual Donors', value: '38,318', color: 'text-emerald-600' },
                { label: 'New This Month', value: '+2,140', color: 'text-[#c8202d]' },
              ].map(s => (
                <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
                  <div className={`${s.color}`} style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.5rem' }}>{s.value}</div>
                  <div className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-[#1a2d5a] mb-6" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>Donor Growth</h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={MONTHLY_DATA.map(d => ({ ...d, totalDonors: d.donors * 7 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#94A3B8' }} axisLine={false} tickLine={false} tickFormatter={v => `${(v / 1000).toFixed(0)}k`} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #E5E7EB', fontSize: 12 }} />
                  <Line type="monotone" dataKey="totalDonors" stroke="#1a2d5a" strokeWidth={2.5} dot={false} name="Donors" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="text-[#1a2d5a] mb-4" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>Top Arizona Donors</h3>
              <div className="space-y-3">
                {[
                  { name: 'James R.', avatar: '10', donated: 4820, schools: 12 },
                  { name: 'Priya K.', avatar: '20', donated: 3650, schools: 9 },
                  { name: 'Felix H.', avatar: '30', donated: 2940, schools: 7 },
                  { name: 'Amara T.', avatar: '40', donated: 2310, schools: 6 },
                  { name: 'Li W.', avatar: '50', donated: 1980, schools: 5 },
                ].map((u, i) => (
                  <div key={u.name} className="flex items-center gap-4">
                    <span className="text-sm font-bold text-gray-300 w-5" style={{ fontFamily: 'Inter, sans-serif' }}>#{i + 1}</span>
                    <img src={`https://i.pravatar.cc/40?img=${u.avatar}`} alt="" className="w-8 h-8 rounded-full" />
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>{u.name}</div>
                      <div className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>{u.schools} schools supported</div>
                    </div>
                    <div className="text-[#c8202d]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>${u.donated.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
