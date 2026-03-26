import { useState } from 'react';
import { Link } from 'react-router';
import { TrendingUp, Users, DollarSign, Clock, ExternalLink, Award, Bell, Settings, Plus, ChevronRight, GraduationCap, UserPlus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { CampaignCard } from '../components/CampaignCard';

type DashTab = 'overview' | 'campaigns' | 'donations' | 'notifications';

const NOTIFICATIONS = [
  { id: 1, icon: '🎉', text: 'Covenant Christian School reached 100% of its goal!', time: '2h ago', unread: true },
  { id: 2, icon: '💳', text: 'Your donation to SonRise Academy\'s Solar STEM Track was confirmed.', time: '1d ago', unread: true },
  { id: 3, icon: '📬', text: 'Grace Christian Academy posted an update: "80% Funded!"', time: '2d ago', unread: false },
  { id: 4, icon: '⏳', text: 'Phoenix Christian Prep Athletic Fund ends in 8 days.', time: '3d ago', unread: false },
  { id: 5, icon: '🙏', text: 'Thank you! Your tax credit receipt for Heritage Christian is ready.', time: '5d ago', unread: false },
];

export function Dashboard() {
  const { campaigns, pledges, user } = useApp();
  const { currentUser, isAuthenticated, addStudentToParent } = useAuth();
  const [activeTab, setActiveTab] = useState<DashTab>('overview');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudent, setNewStudent] = useState({ firstName: '', lastName: '', gradeLevel: '', dateOfBirth: '' });

  const displayUser = currentUser
    ? { name: `${currentUser.firstName} ${currentUser.lastName}`, avatar: currentUser.avatar || `https://i.pravatar.cc/150?u=${currentUser.email}`, email: currentUser.email }
    : { name: user.name, avatar: user.avatar, email: user.email };

  const GRADE_LEVELS = ['Pre-K','Kindergarten','1st Grade','2nd Grade','3rd Grade','4th Grade','5th Grade','6th Grade','7th Grade','8th Grade','9th Grade','10th Grade','11th Grade','12th Grade','Trade/Vocational','College'];

  const handleAddStudent = () => {
    if (!currentUser || !newStudent.firstName || !newStudent.lastName) return;
    addStudentToParent(currentUser.id, {
      firstName: newStudent.firstName, lastName: newStudent.lastName,
      gradeLevel: newStudent.gradeLevel || 'Unknown', dateOfBirth: newStudent.dateOfBirth,
    });
    setNewStudent({ firstName: '', lastName: '', gradeLevel: '', dateOfBirth: '' });
    setShowAddStudent(false);
  };

  const backedCampaigns = pledges
    .map(p => ({ pledge: p, campaign: campaigns.find(c => c.id === p.campaignId) }))
    .filter(x => x.campaign);

  const createdCampaigns = campaigns.filter(c => c.creator.id === 'u1').slice(0, 2);
  const totalDonated = pledges.reduce((sum, p) => sum + p.amount, 0);
  const unreadNotifs = NOTIFICATIONS.filter(n => n.unread).length;

  const TABS: { id: DashTab; label: string; badge?: number }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'campaigns', label: 'My Campaigns', badge: createdCampaigns.length },
    { id: 'donations', label: 'My Donations', badge: pledges.length },
    { id: 'notifications', label: 'Notifications', badge: unreadNotifs || undefined },
  ];

  return (
    <div className="min-h-screen bg-[#e8eef5]">
      {/* Profile header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <img src={displayUser.avatar} alt={displayUser.name} className="w-20 h-20 rounded-full object-cover border-4 border-[#e8eef5]" />
            <div className="flex-1">
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.5rem' }}>
                  {displayUser.name}
                </h1>
                {currentUser && (
                  <span className="px-2.5 py-1 bg-[#1a2d5a]/10 text-[#1a2d5a] text-xs font-semibold rounded-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {currentUser.accountType === 'individual_donor' ? '👤 Individual Donor'
                     : currentUser.accountType === 'business_donor' ? '🏢 Business Donor'
                     : currentUser.accountType === 'parent' ? '👨‍👩‍👧 Parent / Guardian'
                     : currentUser.accountType === 'student' ? '🎒 Student' : ''}
                  </span>
                )}
                {!isAuthenticated && (
                  <Link to="/login" className="px-3 py-1.5 bg-[#c8202d] text-white text-xs font-semibold rounded-full hover:bg-[#a01825] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Sign In to Access Full Dashboard
                  </Link>
                )}
              </div>
              <p className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{displayUser.email}</p>
              {currentUser?.accountType === 'business_donor' && currentUser.businessName && (
                <p className="text-[#1a2d5a] text-sm font-semibold mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>🏢 {currentUser.businessName}</p>
              )}
            </div>
            <div className="flex gap-3">
              <Link to="/create" className="flex items-center gap-1.5 px-5 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] text-white text-sm rounded-xl font-semibold transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Plus size={15} /> New Campaign
              </Link>
              <Link to="/profile" className="p-2.5 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors text-gray-500" title="Manage Profile">
                <Settings size={16} />
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1 overflow-x-auto">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3.5 text-sm whitespace-nowrap relative transition-colors ${activeTab === tab.id ? 'text-[#1a2d5a]' : 'text-gray-500 hover:text-gray-700'}`}
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: activeTab === tab.id ? 700 : 500 }}>
                {tab.label}
                {tab.badge != null && tab.badge > 0 && (
                  <span className={`inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full ${activeTab === tab.id ? 'bg-[#1a2d5a] text-white' : 'bg-gray-200 text-gray-600'}`}>
                    {tab.badge}
                  </span>
                )}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c8202d] rounded-full" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: <DollarSign size={18} className="text-[#1a2d5a]" />, label: 'Total Donated', value: `$${totalDonated.toLocaleString()}`, sub: 'in tax credits', bg: 'bg-[#edf2f8]' },
                { icon: <Users size={18} className="text-emerald-600" />, label: 'Schools Supported', value: pledges.length.toString(), sub: 'campaigns backed', bg: 'bg-emerald-50' },
                { icon: <TrendingUp size={18} className="text-blue-600" />, label: 'Tax Credits', value: `$${totalDonated.toLocaleString()}`, sub: 'AZ credit earned', bg: 'bg-blue-50' },
                { icon: <Award size={18} className="text-[#c8202d]" />, label: 'Impact', value: `${Math.floor(totalDonated / 500)} students`, sub: 'approx. funded', bg: 'bg-red-50' },
              ].map(stat => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center shrink-0`}>{stat.icon}</div>
                  <div>
                    <div className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.2rem' }}>{stat.value}</div>
                    <div className="text-xs text-gray-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.label}</div>
                    <div className="text-xs text-[#c8202d] font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>{stat.sub}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tax credit reminder */}
            <div className="bg-[#1a2d5a] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="flex-1">
                <div className="text-[#c8202d] text-xs font-bold uppercase tracking-widest mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>Arizona Tax Credit Reminder</div>
                <p className="text-white text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  You've donated <strong>${totalDonated.toLocaleString()}</strong> this cycle. Attach your ACT receipts to your AZ state tax return to claim your full dollar-for-dollar credit.
                </p>
              </div>
              <button className="shrink-0 px-4 py-2 bg-white text-[#1a2d5a] text-sm font-bold rounded-lg hover:bg-[#edf2f8] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                View Receipts
              </button>
            </div>

            {/* Recent donations */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.2rem' }}>Recent Donations</h2>
                <button onClick={() => setActiveTab('donations')} className="text-sm text-[#c8202d] hover:text-[#a01825] flex items-center gap-1 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  View all <ChevronRight size={14} />
                </button>
              </div>
              <div className="space-y-3">
                {backedCampaigns.slice(0, 3).map(({ pledge, campaign }) => campaign && (
                  <div key={pledge.campaignId} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-[#1a2d5a]/20 transition-colors">
                    <img src={campaign.image} alt={campaign.title} className="w-14 h-14 rounded-xl object-cover" />
                    <div className="flex-1 min-w-0">
                      <Link to={`/campaign/${campaign.id}`} className="font-semibold text-gray-900 text-sm hover:text-[#1a2d5a] transition-colors line-clamp-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {campaign.title}
                      </Link>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <span className="text-emerald-600 font-semibold">Donated ${pledge.amount}</span>
                        <span>•</span>
                        <span>{pledge.date}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1"><Clock size={10} /> {campaign.daysLeft}d left</span>
                      </div>
                    </div>
                    <div className="shrink-0">
                      <div className="w-24 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#1a2d5a] rounded-full" style={{ width: `${Math.min(100, Math.round(campaign.raised / campaign.goal * 100))}%` }} />
                      </div>
                      <div className="text-right text-xs text-gray-400 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{Math.round(campaign.raised / campaign.goal * 100)}%</div>
                    </div>
                    <Link to={`/campaign/${campaign.id}`} className="p-2 hover:bg-[#edf2f8] rounded-lg text-gray-400 transition-colors">
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended */}
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.2rem' }}>More Campaigns to Support</h2>
                <Link to="/browse" className="text-sm text-[#c8202d] hover:text-[#a01825] flex items-center gap-1 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Browse all <ChevronRight size={14} />
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {campaigns.filter(c => !pledges.find(p => p.campaignId === c.id)).slice(0, 3).map(c => (
                  <CampaignCard key={c.id} campaign={c} size="sm" />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* My Campaigns */}
        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.3rem' }}>My Campaigns</h2>
              <Link to="/create" className="flex items-center gap-2 px-4 py-2 bg-[#1a2d5a] text-white text-sm rounded-xl hover:bg-[#142248] transition-colors font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                <Plus size={14} /> Create Campaign
              </Link>
            </div>

            {createdCampaigns.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <TrendingUp size={40} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-[#1a2d5a] mb-2" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>No campaigns yet</h3>
                <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>Are you a school administrator? Launch your scholarship campaign today.</p>
                <Link to="/create" className="px-6 py-2.5 bg-[#1a2d5a] text-white text-sm rounded-xl hover:bg-[#142248] transition-colors font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Start a Campaign
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {createdCampaigns.map(campaign => {
                  const pct = Math.round(campaign.raised / campaign.goal * 100);
                  return (
                    <div key={campaign.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-5">
                      <img src={campaign.image} alt={campaign.title} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0 space-y-2">
                        <div className="flex items-start justify-between gap-4">
                          <Link to={`/campaign/${campaign.id}`} className="font-semibold text-gray-900 hover:text-[#1a2d5a] transition-colors leading-snug text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {campaign.title}
                          </Link>
                          <span className={`shrink-0 px-2.5 py-1 text-xs font-semibold rounded-full ${campaign.status === 'funded' ? 'bg-emerald-100 text-emerald-700' : 'bg-[#edf2f8] text-[#1a2d5a]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                            {campaign.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <span className="font-semibold text-gray-900">${campaign.raised.toLocaleString()} donated</span>
                          <span>of ${campaign.goal.toLocaleString()}</span>
                          <span>•</span>
                          <span>{campaign.backers} donors</span>
                          <span>•</span>
                          <span>{campaign.daysLeft} days left</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden w-full">
                          <div className="h-full bg-[#1a2d5a] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <Link to={`/campaign/${campaign.id}`} className="text-xs text-[#1a2d5a] hover:text-[#c8202d] font-semibold flex items-center gap-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          View Campaign <ExternalLink size={11} />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* My Donations */}
        {activeTab === 'donations' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.3rem' }}>My Donations</h2>
              <div className="text-sm text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>{pledges.length} schools supported · ${totalDonated.toLocaleString()} total</div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {backedCampaigns.map(({ pledge, campaign }) => campaign && (
                <div key={pledge.campaignId} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#1a2d5a]/20 transition-colors">
                  <div className="relative h-36">
                    <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50" />
                    <div className="absolute bottom-3 left-3 right-3">
                      <span className="text-white font-semibold text-sm leading-tight line-clamp-2" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>{campaign.title}</span>
                    </div>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="flex justify-between items-center text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span className="text-gray-500">Your donation</span>
                      <span className="text-[#c8202d]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 900, fontSize: '1.1rem' }}>${pledge.amount}</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span>Donated {pledge.date}</span>
                      <span className="flex items-center gap-1"><Clock size={10} /> {campaign.daysLeft}d left</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-[#1a2d5a] rounded-full" style={{ width: `${Math.min(100, Math.round(campaign.raised / campaign.goal * 100))}%` }} />
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                      <span>{Math.round(campaign.raised / campaign.goal * 100)}% funded</span>
                      <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold">✓ Tax Credit Eligible</span>
                    </div>
                    <Link to={`/campaign/${campaign.id}`} className="block text-center text-xs text-[#1a2d5a] hover:text-[#c8202d] font-semibold py-1.5 border border-[#1a2d5a]/20 rounded-lg hover:bg-[#edf2f8] transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                      View Campaign
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications */}
        {activeTab === 'notifications' && (
          <div className="space-y-4 max-w-2xl">
            <div className="flex items-center justify-between">
              <h2 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.3rem' }}>Notifications</h2>
              <button className="text-sm text-[#c8202d] hover:text-[#a01825] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>Mark all as read</button>
            </div>
            {NOTIFICATIONS.map(notif => (
              <div key={notif.id} className={`flex items-start gap-4 p-4 rounded-2xl border transition-colors ${notif.unread ? 'bg-[#edf2f8] border-[#1a2d5a]/20' : 'bg-white border-gray-100'}`}>
                <span className="text-2xl shrink-0 mt-0.5">{notif.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${notif.unread ? 'text-gray-900 font-semibold' : 'text-gray-600'}`} style={{ fontFamily: 'Inter, sans-serif' }}>{notif.text}</p>
                  <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{notif.time}</p>
                </div>
                {notif.unread && <div className="w-2 h-2 bg-[#c8202d] rounded-full mt-1.5 shrink-0" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}