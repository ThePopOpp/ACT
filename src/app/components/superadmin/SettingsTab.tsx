import { useState } from 'react';
import { Shield, ShieldOff, Plus, Trash2, Eye, EyeOff, Save, RotateCcw, Lock } from 'lucide-react';
import { AuthUser, UserRole } from '../../context/AuthContext';
import { toast } from 'sonner';

interface AdminEntry {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  addedDate: string;
  lastLogin: string;
  permissions: string[];
}

const ALL_PERMISSIONS = [
  'View Overview',
  'Manage Campaigns',
  'Manage Users',
  'View Payments',
  'Process Refunds',
  'Issue Tax Receipts',
  'Manage Marketing',
  'Communications',
  'Platform Settings',
  'Manage Admins',
];

const MOCK_ADMINS: AdminEntry[] = [
  {
    id: 'super_admin_1', name: 'ACT Administrator', email: 'admin@arizonachristiantuition.com', role: 'super_admin',
    avatar: 'https://i.pravatar.cc/40?u=superadmin', addedDate: '2025-01-01', lastLogin: '2026-03-24',
    permissions: ALL_PERMISSIONS,
  },
];

interface PlatformSettings {
  platformName: string;
  supportEmail: string;
  platformFeePercent: string;
  individualDonorCap: string;
  marriedDonorCap: string;
  businessDonorCap: string;
  requireCampaignApproval: boolean;
  allowStudentCampaigns: boolean;
  studentMinAge: string;
  taxCreditYear: string;
}

const DEFAULT_SETTINGS: PlatformSettings = {
  platformName: 'Arizona Christian Tuition',
  supportEmail: 'support@arizonachristiantuition.com',
  platformFeePercent: '2.9',
  individualDonorCap: '1459',
  marriedDonorCap: '2918',
  businessDonorCap: '200000',
  requireCampaignApproval: true,
  allowStudentCampaigns: true,
  studentMinAge: '16',
  taxCreditYear: '2026',
};

interface Props {
  currentUser: AuthUser | null;
  allUsers: AuthUser[];
  onUpdateRole: (userId: string, role: UserRole) => void;
}

export function SettingsTab({ currentUser, allUsers, onUpdateRole }: Props) {
  const [section, setSection] = useState<'platform' | 'access' | 'security' | 'integrations'>('platform');
  const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
  const [admins, setAdmins] = useState<AdminEntry[]>(MOCK_ADMINS);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<'admin'>('admin');
  const [expandPerms, setExpandPerms] = useState<string | null>(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  const setSetting = (key: keyof PlatformSettings, val: string | boolean) => {
    setSettings(p => ({ ...p, [key]: val }));
  };

  // Merge real admin/super_admin users with mock admin list
  const realAdmins = allUsers.filter(u => u.role === 'admin' && !admins.find(a => a.id === u.id));

  const handleInvite = () => {
    if (!inviteEmail.trim() || !/\S+@\S+\.\S+/.test(inviteEmail)) { toast.error('Valid email required.'); return; }
    const existing = admins.find(a => a.email === inviteEmail) || allUsers.find(u => u.email === inviteEmail);
    if (existing) { toast.error('This user is already an admin.'); return; }
    const newAdmin: AdminEntry = {
      id: `admin_${Date.now()}`,
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      avatar: `https://i.pravatar.cc/40?u=${inviteEmail}`,
      addedDate: new Date().toISOString().split('T')[0],
      lastLogin: 'Never',
      permissions: inviteRole === 'admin' ? ALL_PERMISSIONS.filter(p => p !== 'Manage Admins' && p !== 'Platform Settings') : ALL_PERMISSIONS,
    };
    setAdmins(prev => [...prev, newAdmin]);
    setInviteEmail('');
    toast.success(`Invite sent to ${inviteEmail}! 📧`);
  };

  const removeAdmin = (id: string) => {
    setAdmins(prev => prev.filter(a => a.id !== id));
    const user = allUsers.find(u => u.id === id);
    if (user) onUpdateRole(id, 'user');
    setConfirmDelete(null);
    toast('Admin access revoked.');
  };

  const togglePermission = (adminId: string, perm: string) => {
    setAdmins(prev => prev.map(a => {
      if (a.id !== adminId) return a;
      const has = a.permissions.includes(perm);
      return { ...a, permissions: has ? a.permissions.filter(p => p !== perm) : [...a.permissions, perm] };
    }));
  };

  const SECTIONS = [
    { key: 'platform' as const, label: '⚙️ Platform' },
    { key: 'access' as const, label: '🛡️ Access Control' },
    { key: 'security' as const, label: '🔒 Security' },
    { key: 'integrations' as const, label: '🔗 Integrations' },
  ];

  const inp = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40 bg-white';
  const toggle = (checked: boolean, onChange: () => void) => (
    <button onClick={onChange} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${checked ? 'bg-[#1a2d5a]' : 'bg-gray-200'}`}>
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
  );

  return (
    <div className="space-y-5">
      {/* Sub-nav */}
      <div className="flex gap-2 flex-wrap bg-white rounded-xl border border-gray-100 p-1.5">
        {SECTIONS.map(s => (
          <button key={s.key} onClick={() => setSection(s.key)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${section === s.key ? 'bg-[#1a2d5a] text-white shadow-sm' : 'text-gray-500 hover:text-[#1a2d5a]'}`}
            style={{ fontFamily: 'Inter, sans-serif' }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ── Platform Settings ─────────────────────────────────────────── */}
      {section === 'platform' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h3 className="text-[#1a2d5a] font-bold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>General Settings</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Platform Name</label>
              <input value={settings.platformName} onChange={e => setSetting('platformName', e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Support Email</label>
              <input type="email" value={settings.supportEmail} onChange={e => setSetting('supportEmail', e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Platform Fee (%)</label>
              <input type="number" value={settings.platformFeePercent} onChange={e => setSetting('platformFeePercent', e.target.value)} step="0.1" min="0" max="10" className={inp} />
              <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Applied on top of payment processor fees (2.9% + $0.30)</p>
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-xs font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>Require Campaign Approval</p>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>New campaigns reviewed before going live</p>
              </div>
              {toggle(settings.requireCampaignApproval, () => setSetting('requireCampaignApproval', !settings.requireCampaignApproval))}
            </div>
            <div className="flex items-center justify-between py-1">
              <div>
                <p className="text-xs font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>Allow Student Campaigns</p>
                <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>Students 16+ can create their own campaigns</p>
              </div>
              {toggle(settings.allowStudentCampaigns, () => setSetting('allowStudentCampaigns', !settings.allowStudentCampaigns))}
            </div>
            {settings.allowStudentCampaigns && (
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Student Minimum Age</label>
                <input type="number" value={settings.studentMinAge} onChange={e => setSetting('studentMinAge', e.target.value)} min="13" max="21" className={inp} style={{ maxWidth: 100 }} />
              </div>
            )}
          </div>

          {/* Tax Credit Settings */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h3 className="text-[#1a2d5a] font-bold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>Arizona Tax Credit Limits</h3>
            <div className="p-3 bg-[#e8eef5] rounded-xl border border-[#1a2d5a]/10">
              <p className="text-xs text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                🏛️ These values reflect <strong>A.R.S. § 43-1089</strong> and are updated annually by ADOR. Adjust for the current tax year.
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Tax Credit Year</label>
              <input type="number" value={settings.taxCreditYear} onChange={e => setSetting('taxCreditYear', e.target.value)} className={inp} style={{ maxWidth: 120 }} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Individual / Single Filer Cap ($)</label>
              <input type="number" value={settings.individualDonorCap} onChange={e => setSetting('individualDonorCap', e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Married Filing Jointly Cap ($)</label>
              <input type="number" value={settings.marriedDonorCap} onChange={e => setSetting('marriedDonorCap', e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Business / Corporate Cap ($)</label>
              <input type="number" value={settings.businessDonorCap} onChange={e => setSetting('businessDonorCap', e.target.value)} className={inp} />
              <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>Subject to statewide aggregate cap per ADOR</p>
            </div>
            <div className="flex gap-3 pt-2">
              <button onClick={() => toast.success('Settings saved!')}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] text-white text-sm font-semibold rounded-xl transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                <Save size={14} /> Save All Settings
              </button>
              <button onClick={() => { setSettings(DEFAULT_SETTINGS); toast('Settings reset to defaults.'); }}
                className="flex items-center gap-2 px-5 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Access Control ────────────────────────────────────────────── */}
      {section === 'access' && (
        <div className="space-y-5">
          {/* Invite */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-[#1a2d5a] mb-4" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>Grant Admin Access</h3>
            <div className="flex gap-3">
              <input
                type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                placeholder="Email address to grant access…"
                className="flex-1 px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 bg-white"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <select value={inviteRole} onChange={e => setInviteRole(e.target.value as 'admin')}
                className="px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none bg-white text-gray-600"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                <option value="admin">Admin</option>
              </select>
              <button onClick={handleInvite}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                <Plus size={14} /> Grant Access
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>
              An invitation email will be sent. Only <strong>Super Admins</strong> can grant or revoke admin access.
            </p>
          </div>

          {/* Admin list */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-[#1a2d5a] font-bold text-sm" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                Authorized Admin Accounts ({admins.length + realAdmins.length})
              </h3>
            </div>
            <div className="divide-y divide-gray-50">
              {[...admins, ...realAdmins.map(u => ({
                id: u.id, name: `${u.firstName} ${u.lastName}`, email: u.email, role: u.role as UserRole,
                avatar: u.avatar || `https://i.pravatar.cc/40?u=${u.email}`,
                addedDate: u.createdAt.split('T')[0], lastLogin: 'Active',
                permissions: ALL_PERMISSIONS.filter(p => p !== 'Manage Admins'),
              }))].map(admin => (
                <div key={admin.id} className="px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <img src={admin.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0 mt-0.5" />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>{admin.name}</p>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${admin.role === 'super_admin' ? 'bg-[#1a2d5a] text-white' : 'bg-[#c8202d]/10 text-[#c8202d]'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                            {admin.role === 'super_admin' ? '👑 Super Admin' : '🛡️ Admin'}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{admin.email}</p>
                        <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                          Added {admin.addedDate} · Last login: {admin.lastLogin}
                        </p>
                        {/* Permissions toggle */}
                        <button onClick={() => setExpandPerms(expandPerms === admin.id ? null : admin.id)}
                          className="flex items-center gap-1 text-xs text-[#c8202d] hover:underline mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <Shield size={11} /> {admin.permissions.length}/{ALL_PERMISSIONS.length} permissions
                        </button>
                        {expandPerms === admin.id && (
                          <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {ALL_PERMISSIONS.map(perm => {
                              const has = admin.permissions.includes(perm);
                              const isOwner = admin.role === 'super_admin';
                              return (
                                <label key={perm} className={`flex items-center gap-1.5 cursor-pointer ${isOwner ? 'opacity-50 cursor-default' : ''}`}>
                                  <input type="checkbox" checked={has} disabled={isOwner}
                                    onChange={() => !isOwner && togglePermission(admin.id, perm)}
                                    className="accent-[#1a2d5a] w-3.5 h-3.5" />
                                  <span className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{perm}</span>
                                </label>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>
                    {admin.role !== 'super_admin' && (
                      <div>
                        {confirmDelete === admin.id ? (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-red-500" style={{ fontFamily: 'Inter, sans-serif' }}>Revoke?</span>
                            <button onClick={() => removeAdmin(admin.id)} className="px-3 py-1.5 bg-red-500 text-white text-xs font-semibold rounded-lg" style={{ fontFamily: 'Inter, sans-serif' }}>Yes</button>
                            <button onClick={() => setConfirmDelete(null)} className="px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-semibold rounded-lg" style={{ fontFamily: 'Inter, sans-serif' }}>No</button>
                          </div>
                        ) : (
                          <button onClick={() => setConfirmDelete(admin.id)}
                            className="flex items-center gap-1.5 px-3 py-2 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors"
                            style={{ fontFamily: 'Inter, sans-serif' }}>
                            <ShieldOff size={13} /> Revoke
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── Security ──────────────────────────────────────────────────── */}
      {section === 'security' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h3 className="text-[#1a2d5a] font-bold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>Security Settings</h3>
            {[
              { label: 'Require 2FA for Admins', desc: 'All admin accounts must enable two-factor authentication', val: true },
              { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', val: true },
              { label: 'Login Attempt Limit', desc: 'Lock account after 5 failed login attempts', val: true },
              { label: 'Admin Access Log', desc: 'Log all admin actions for audit trail', val: true },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-xs font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>{item.label}</p>
                  <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>{item.desc}</p>
                </div>
                {toggle(item.val, () => toast('Security setting updated.'))}
              </div>
            ))}
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
            <h3 className="text-[#1a2d5a] font-bold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>Change Super Admin Password</h3>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Current Password</label>
              <input type="password" placeholder="••••••••" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>New Password</label>
              <input type="password" placeholder="Min 12 characters" className={inp} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Confirm New Password</label>
              <input type="password" placeholder="Repeat new password" className={inp} />
            </div>
            <button onClick={() => toast.success('Password updated.')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] text-white text-sm font-semibold rounded-xl transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              <Lock size={14} /> Update Password
            </button>
          </div>
        </div>
      )}

      {/* ── Integrations ──────────────────────────────────────────────── */}
      {section === 'integrations' && (
        <div className="space-y-5">
          {[
            { name: 'Stripe', desc: 'Payment processing for all donations', key: 'pk_live_••••••••••••••••••••••••••4821', connected: true, icon: '💳' },
            { name: 'SendGrid', desc: 'Transactional email and tax receipts', key: 'SG.••••••••••••••••••••••••••••••••', connected: true, icon: '📧' },
            { name: 'Twilio', desc: 'SMS notifications and 2FA', key: 'AC••••••••••••••••••••••••••••••••', connected: false, icon: '📱' },
            { name: 'Google Analytics', desc: 'Platform analytics and campaign tracking', key: 'G-••••••••••', connected: true, icon: '📊' },
            { name: 'PayPal', desc: 'PayPal Checkout and Venmo payments', key: 'AYg••••••••••••••••••••••••••••••', connected: false, icon: '🅿️' },
            { name: 'Arizona ADOR API', desc: 'Tax credit verification and STO compliance', key: 'ador_••••••••••••••••', connected: false, icon: '🏛️' },
          ].map(integration => (
            <div key={integration.name} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{integration.icon}</span>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>{integration.name}</h4>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${integration.connected ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                        {integration.connected ? '● Connected' : '○ Not Connected'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{integration.desc}</p>
                    {integration.connected && (
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-gray-400 font-mono bg-gray-50 px-2 py-1 rounded">
                          {showApiKey ? integration.key.replace(/•/g, '*') : integration.key}
                        </code>
                        <button onClick={() => setShowApiKey(v => !v)} className="text-gray-400 hover:text-gray-600">
                          {showApiKey ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => toast(integration.connected ? `${integration.name} disconnected.` : `${integration.name} connection initiated.`)}
                  className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors whitespace-nowrap ${
                    integration.connected
                      ? 'bg-red-50 text-red-500 hover:bg-red-100'
                      : 'bg-[#1a2d5a] text-white hover:bg-[#142248]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {integration.connected ? 'Disconnect' : 'Connect'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}