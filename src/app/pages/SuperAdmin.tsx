import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import {
  LayoutDashboard, BookOpen, Users, DollarSign, Megaphone,
  MessageSquare, Settings, LogOut, Menu, X, Shield,
  ChevronRight, Eye, EyeOff, Lock
} from 'lucide-react';
import { useAuth, AuthProvider } from '../context/AuthContext';
import { useApp, AppProvider } from '../context/AppContext';
import { Toaster } from 'sonner';
import { toast } from 'sonner';

import { OverviewTab } from '../components/superadmin/OverviewTab';
import { CampaignsTab } from '../components/superadmin/CampaignsTab';
import { UsersTab } from '../components/superadmin/UsersTab';
import { PaymentsTab } from '../components/superadmin/PaymentsTab';
import { MarketingTab } from '../components/superadmin/MarketingTab';
import { CommunicationsTab } from '../components/superadmin/CommunicationsTab';
import { SettingsTab } from '../components/superadmin/SettingsTab';

const ACT_LOGO_WHITE = 'https://arizonachristiantuition.com/wp-content/uploads/2024/12/ACT-Logo-White.svg';

type AdminTab = 'overview' | 'campaigns' | 'users' | 'payments' | 'marketing' | 'communications' | 'settings';

const NAV_ITEMS: { key: AdminTab; label: string; icon: React.ReactNode; badge?: string }[] = [
  { key: 'overview', label: 'Overview', icon: <LayoutDashboard size={17} /> },
  { key: 'campaigns', label: 'Campaigns', icon: <BookOpen size={17} />, badge: '4' },
  { key: 'users', label: 'Users', icon: <Users size={17} /> },
  { key: 'payments', label: 'Payments', icon: <DollarSign size={17} /> },
  { key: 'marketing', label: 'Marketing', icon: <Megaphone size={17} /> },
  { key: 'communications', label: 'Communications', icon: <MessageSquare size={17} />, badge: '3' },
  { key: 'settings', label: 'Settings', icon: <Settings size={17} /> },
];

const TAB_LABELS: Record<AdminTab, string> = {
  overview: 'Platform Overview',
  campaigns: 'Campaign Management',
  users: 'User Management',
  payments: 'Payments & Transactions',
  marketing: 'Marketing & Growth',
  communications: 'Communications & Support',
  settings: 'Settings & Access Control',
};

// ─── ACCESS GATE ──────────────────────────────────────────────────────────────
function AccessGate({ onSuccess }: { onSuccess: () => void }) {
  const { login, currentUser, isSuperAdmin, isAdmin } = useAuth();
  const [email, setEmail] = useState(currentUser?.email || '');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 600));
    if (currentUser && (isSuperAdmin || isAdmin)) {
      setLoading(false);
      onSuccess();
      return;
    }
    const result = login(email, password);
    setLoading(false);
    if (result.success) {
      // Check after login - will be reflected on next render cycle
      setTimeout(() => {
        const stored = sessionStorage.getItem('act_current_user_id');
        const users = JSON.parse(localStorage.getItem('act_users') || '[]');
        const u = users.find((x: any) => x.id === stored);
        if (u && (u.role === 'super_admin' || u.role === 'admin')) {
          onSuccess();
        } else {
          setError('You do not have administrator privileges.');
        }
      }, 100);
    } else {
      setError(result.message);
    }
  };

  const inp = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/50 bg-white transition-all';

  return (
    <div className="min-h-screen bg-[#0f1d3a] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#c8202d] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield size={32} className="text-white" />
          </div>
          <h1 className="text-white mb-1" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.5rem' }}>
            Super Admin Access
          </h1>
          <p className="text-white/50 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
            Arizona Christian Tuition · Control Panel
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-300" style={{ fontFamily: 'Inter, sans-serif' }}>
                🚫 {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Admin Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@arizonachristiantuition.com"
                className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all"
                style={{ fontFamily: 'Inter, sans-serif' }} />
            </div>

            <div>
              <label className="block text-xs font-semibold text-white/60 mb-1.5 uppercase tracking-wider" style={{ fontFamily: 'Inter, sans-serif' }}>Password</label>
              <div className="relative">
                <input type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••••••"
                  className="w-full px-4 py-3 bg-white/10 border border-white/10 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all pr-11"
                  style={{ fontFamily: 'Inter, sans-serif' }} />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#c8202d] hover:bg-[#a01825] disabled:opacity-60 text-white rounded-xl font-semibold text-sm transition-colors mt-2"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {loading
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Verifying…</>
                : <><Lock size={15} /> Enter Admin Panel</>
              }
            </button>
          </form>

          <div className="mt-5 p-3 bg-white/5 rounded-xl border border-white/10">
            <p className="text-xs text-white/40 text-center" style={{ fontFamily: 'Inter, sans-serif' }}>
              🔒 Demo credentials: <strong className="text-white/60">admin@arizonachristiantuition.com</strong><br />
              Password: <strong className="text-white/60">ACTAdmin2026!</strong>
            </p>
          </div>
        </div>

        <Link to="/" className="flex items-center justify-center gap-1.5 text-white/40 hover:text-white/70 text-xs mt-6 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
          ← Return to Platform
        </Link>
      </div>
    </div>
  );
}

// ─── SUPER ADMIN DASHBOARD ────────────────────────────────────────────────────
export function SuperAdmin() {
  return (
    <AuthProvider>
      <AppProvider>
        <Toaster position="bottom-right" richColors closeButton />
        <SuperAdminInner />
      </AppProvider>
    </AuthProvider>
  );
}

function SuperAdminInner() {
  const { currentUser, allUsers, isSuperAdmin, isAdmin, logout, updateUserRole, updateUserStatus, deleteUser } = useAuth();
  const { campaigns } = useApp();
  const navigate = useNavigate();

  const [authorized, setAuthorized] = useState(() => isSuperAdmin || isAdmin);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Featured campaigns state
  const [featuredOverrides, setFeaturedOverrides] = useState<Record<string, boolean>>({});

  const allCampaigns = campaigns.map(c => ({
    ...c,
    featured: c.id in featuredOverrides ? featuredOverrides[c.id] : c.featured,
  }));

  const toggleFeature = (id: string, featured: boolean) => {
    setFeaturedOverrides(prev => ({ ...prev, [id]: featured }));
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!authorized) {
    return <AccessGate onSuccess={() => setAuthorized(true)} />;
  }

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className={`flex flex-col h-full ${mobile ? '' : ''}`}>
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <Link to="/" className="block">
          <img src={ACT_LOGO_WHITE} alt="ACT" className="h-10 w-auto" onError={e => { e.currentTarget.style.display = 'none'; }} />
          <p className="text-white/40 text-xs mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Super Admin Panel</p>
        </Link>
      </div>

      {/* Admin identity */}
      <div className="p-4 mx-3 mt-4 bg-white/5 rounded-xl border border-white/10">
        <div className="flex items-center gap-3">
          <img src={currentUser?.avatar || 'https://i.pravatar.cc/40?u=admin'} alt="" className="w-9 h-9 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate" style={{ fontFamily: 'Inter, sans-serif' }}>
              {currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : 'Administrator'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
              <span className="text-white/50 text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                {currentUser?.role === 'super_admin' ? 'Super Admin' : 'Admin'}
              </span>
            </div>
          </div>
          {currentUser?.role === 'super_admin' && (
            <span className="ml-auto text-amber-400 text-lg">👑</span>
          )}
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(item => (
          <button
            key={item.key}
            onClick={() => { setActiveTab(item.key); setSidebarOpen(false); }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.key
                ? 'bg-white text-[#1a2d5a] shadow-md'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <span className={activeTab === item.key ? 'text-[#1a2d5a]' : 'text-white/50'}>
              {item.icon}
            </span>
            <span className="flex-1 text-left">{item.label}</span>
            {item.badge && (
              <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold leading-none ${
                activeTab === item.key ? 'bg-[#c8202d] text-white' : 'bg-white/20 text-white'
              }`}>
                {item.badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-white/10 space-y-2">
        <Link to="/" className="flex items-center gap-2 px-3 py-2 text-white/50 hover:text-white text-xs rounded-xl hover:bg-white/10 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
          <ChevronRight size={14} className="rotate-180" /> Back to Platform
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 text-white/50 hover:text-red-300 text-xs rounded-xl hover:bg-red-500/10 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
          <LogOut size={14} /> Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#e8eef5]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-[#1a2d5a] shrink-0 sticky top-0 h-screen overflow-y-auto">
        <Sidebar />
      </aside>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <>
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
          <aside className="fixed left-0 top-0 bottom-0 w-72 bg-[#1a2d5a] z-50 lg:hidden flex flex-col overflow-y-auto">
            <div className="p-4 flex justify-end">
              <button onClick={() => setSidebarOpen(false)} className="text-white/60 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <Sidebar mobile />
            </div>
          </aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
          <div className="flex items-center gap-4 px-6 py-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-2 text-gray-500 hover:text-[#1a2d5a] hover:bg-gray-100 rounded-lg transition-colors">
              <Menu size={20} />
            </button>

            <div className="flex items-center gap-2">
              <Shield size={16} className="text-[#c8202d]" />
              <div>
                <h1 className="text-[#1a2d5a] leading-tight" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1rem' }}>
                  {TAB_LABELS[activeTab]}
                </h1>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Arizona Christian Tuition · Admin Panel · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-3">
              {/* Quick stats */}
              <div className="hidden sm:flex items-center gap-4 px-4 py-2 bg-[#e8eef5] rounded-xl">
                <div className="text-center">
                  <p className="text-xs font-bold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>{campaigns.length}</p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>Campaigns</p>
                </div>
                <div className="w-px h-6 bg-gray-200" />
                <div className="text-center">
                  <p className="text-xs font-bold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>{allUsers.length}</p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>Users</p>
                </div>
                <div className="w-px h-6 bg-gray-200" />
                <div className="text-center">
                  <p className="text-xs font-bold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                    ${(campaigns.reduce((s, c) => s + c.raised, 0) / 1000).toFixed(0)}K
                  </p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>Raised</p>
                </div>
              </div>

              <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-full border border-emerald-100" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> Live
              </span>
            </div>
          </div>
        </header>

        {/* Tab content */}
        <main className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && (
            <OverviewTab campaigns={allCampaigns} users={allUsers} />
          )}
          {activeTab === 'campaigns' && (
            <CampaignsTab campaigns={allCampaigns} onToggleFeature={toggleFeature} />
          )}
          {activeTab === 'users' && (
            <UsersTab
              users={allUsers}
              onUpdateRole={updateUserRole}
              onUpdateStatus={updateUserStatus}
              onDelete={deleteUser}
            />
          )}
          {activeTab === 'payments' && <PaymentsTab />}
          {activeTab === 'marketing' && (
            <MarketingTab campaigns={allCampaigns} onToggleFeature={toggleFeature} />
          )}
          {activeTab === 'communications' && <CommunicationsTab />}
          {activeTab === 'settings' && (
            <SettingsTab
              currentUser={currentUser}
              allUsers={allUsers}
              onUpdateRole={updateUserRole}
            />
          )}
        </main>
      </div>
    </div>
  );
}