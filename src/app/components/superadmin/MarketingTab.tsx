import { useState } from 'react';
import { Star, StarOff, Plus, Trash2, Send, Eye, Edit, ToggleLeft, ToggleRight, ImageIcon } from 'lucide-react';
import { Campaign } from '../../data/mockData';
import { toast } from 'sonner';

interface Banner {
  id: string;
  title: string;
  subtitle: string;
  cta: string;
  color: string;
  active: boolean;
  impressions: number;
  clicks: number;
}

interface EmailCampaign {
  id: string;
  subject: string;
  audience: string;
  status: 'draft' | 'scheduled' | 'sent';
  sentDate?: string;
  opens?: number;
  clicks?: number;
}

const MOCK_BANNERS: Banner[] = [
  { id: 'b1', title: 'Arizona Tax Credit Deadline — April 15', subtitle: 'Redirect your state taxes to Christian education. Every dollar counts.', cta: 'Donate Now', color: '#1a2d5a', active: true, impressions: 14820, clicks: 1204 },
  { id: 'b2', title: "Spring Campaign Season is Open!", subtitle: 'New scholarship campaigns are live. Support a student near you.', cta: 'Browse Campaigns', color: '#c8202d', active: true, impressions: 8330, clicks: 702 },
  { id: 'b3', title: 'New: Business Donor Tax Credits', subtitle: 'Arizona corporations can now redirect up to 20% of their tax liability.', cta: 'Learn More', color: '#2d6a4f', active: false, impressions: 3120, clicks: 218 },
];

const MOCK_EMAILS: EmailCampaign[] = [
  { id: 'e1', subject: '🙏 Your April Tax Credit Reminder', audience: 'All Donors', status: 'scheduled', sentDate: '2026-04-01' },
  { id: 'e2', subject: 'New Campaigns Just Launched in Your Area', audience: 'Individual Donors', status: 'sent', sentDate: '2026-03-15', opens: 1842, clicks: 412 },
  { id: 'e3', subject: 'Parent Campaign Creation Guide', audience: 'Parents', status: 'sent', sentDate: '2026-03-01', opens: 634, clicks: 198 },
  { id: 'e4', subject: 'Q1 Platform Impact Report', audience: 'All Users', status: 'sent', sentDate: '2026-03-10', opens: 2104, clicks: 876 },
  { id: 'e5', subject: 'Spring Campaign Bundle — Coming Soon', audience: 'All Users', status: 'draft' },
];

const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-500',
  scheduled: 'bg-amber-100 text-amber-700',
  sent: 'bg-emerald-100 text-emerald-700',
};

interface Props { campaigns: Campaign[]; onToggleFeature: (id: string, featured: boolean) => void; }

export function MarketingTab({ campaigns, onToggleFeature }: Props) {
  const [banners, setBanners] = useState(MOCK_BANNERS);
  const [emails, setEmails] = useState(MOCK_EMAILS);
  const [newEmail, setNewEmail] = useState({ subject: '', audience: 'All Users', body: '' });
  const [composing, setComposing] = useState(false);
  const [section, setSection] = useState<'featured' | 'banners' | 'email' | 'seo'>('featured');

  const featuredCampaigns = campaigns.filter(c => c.featured);
  const unfeaturedCampaigns = campaigns.filter(c => !c.featured);

  const toggleBanner = (id: string) => {
    setBanners(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
    toast('Banner updated.');
  };
  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
    toast('Banner removed.');
  };
  const sendEmail = () => {
    if (!newEmail.subject || !newEmail.body) { toast.error('Subject and body are required.'); return; }
    const e: EmailCampaign = { id: `e${Date.now()}`, subject: newEmail.subject, audience: newEmail.audience, status: 'scheduled', sentDate: new Date().toLocaleDateString() };
    setEmails(prev => [e, ...prev]);
    setNewEmail({ subject: '', audience: 'All Users', body: '' });
    setComposing(false);
    toast.success('Email campaign scheduled! 📧');
  };

  const SECTIONS = ['featured', 'banners', 'email', 'seo'] as const;
  const SECTION_LABELS = { featured: '⭐ Featured Campaigns', banners: '🎯 Banners', email: '📧 Email Campaigns', seo: '🔍 SEO & Meta' };

  const inp = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40 bg-white';

  return (
    <div className="space-y-5">
      {/* Sub-nav */}
      <div className="flex gap-2 flex-wrap bg-white rounded-xl border border-gray-100 p-1.5">
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setSection(s)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${section === s ? 'bg-[#1a2d5a] text-white shadow-sm' : 'text-gray-500 hover:text-[#1a2d5a]'}`}
            style={{ fontFamily: 'Inter, sans-serif' }}>
            {SECTION_LABELS[s]}
          </button>
        ))}
      </div>

      {/* ── Featured Campaigns ───────────────────────────────────────── */}
      {section === 'featured' && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>
                ⭐ Currently Featured ({featuredCampaigns.length})
              </h3>
              <span className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>Max 6 recommended</span>
            </div>
            {featuredCampaigns.length === 0 && <p className="text-sm text-gray-400 text-center py-6" style={{ fontFamily: 'Inter, sans-serif' }}>No featured campaigns yet.</p>}
            <div className="space-y-3">
              {featuredCampaigns.map(c => {
                const pct = Math.round((c.raised / c.goal) * 100);
                return (
                  <div key={c.id} className="flex items-center gap-3 p-3 border border-amber-100 bg-amber-50/30 rounded-xl">
                    <img src={c.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1a2d5a] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{c.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1 bg-gray-100 rounded-full">
                          <div className="h-full bg-amber-400 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-amber-600 font-semibold shrink-0" style={{ fontFamily: 'Inter, sans-serif' }}>{pct}%</span>
                      </div>
                    </div>
                    <button onClick={() => onToggleFeature(c.id, false)}
                      className="p-2 bg-white rounded-lg text-amber-500 hover:bg-amber-100 border border-amber-100 transition-colors" title="Remove from featured">
                      <StarOff size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <h3 className="text-[#1a2d5a] mb-5" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>
              Add to Featured
            </h3>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {unfeaturedCampaigns.map(c => {
                const pct = Math.round((c.raised / c.goal) * 100);
                return (
                  <div key={c.id} className="flex items-center gap-3 p-3 border border-gray-100 rounded-xl hover:border-[#1a2d5a]/20 transition-colors">
                    <img src={c.image} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#1a2d5a] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{c.title}</p>
                      <p className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>{c.category} · ${c.raised.toLocaleString()} raised · {pct}%</p>
                    </div>
                    <button onClick={() => onToggleFeature(c.id, true)}
                      className="p-2 bg-[#e8eef5] rounded-lg text-[#1a2d5a] hover:bg-[#1a2d5a] hover:text-white transition-colors" title="Feature this campaign">
                      <Star size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Banners ──────────────────────────────────────────────────── */}
      {section === 'banners' && (
        <div className="space-y-4">
          {banners.map(b => (
            <div key={b.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ background: b.color }} />
                    <h4 className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>{b.title}</h4>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${b.active ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {b.active ? 'Live' : 'Off'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>{b.subtitle}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span>👁 {b.impressions.toLocaleString()} impressions</span>
                    <span>🖱 {b.clicks.toLocaleString()} clicks</span>
                    <span>CTR: {((b.clicks / b.impressions) * 100).toFixed(1)}%</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleBanner(b.id)} className={`text-2xl transition-colors ${b.active ? 'text-[#1a2d5a]' : 'text-gray-300'}`}>
                    {b.active ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                  <button onClick={() => deleteBanner(b.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => toast('Banner builder coming soon!')}
            className="w-full flex items-center justify-center gap-2 py-4 border-2 border-dashed border-gray-200 hover:border-[#1a2d5a]/40 rounded-2xl text-sm text-gray-500 hover:text-[#1a2d5a] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            <Plus size={16} /> Create New Banner
          </button>
        </div>
      )}

      {/* ── Email Campaigns ───────────────────────────────────────────── */}
      {section === 'email' && (
        <div className="space-y-5">
          {composing ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
              <h3 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>New Email Campaign</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Subject *</label>
                  <input value={newEmail.subject} onChange={e => setNewEmail(p => ({ ...p, subject: e.target.value }))} placeholder="Email subject line" className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Audience</label>
                  <select value={newEmail.audience} onChange={e => setNewEmail(p => ({ ...p, audience: e.target.value }))} className={inp + ' bg-white'}>
                    {['All Users', 'Individual Donors', 'Business Donors', 'Parents', 'Students'].map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Email Body *</label>
                <textarea rows={8} value={newEmail.body} onChange={e => setNewEmail(p => ({ ...p, body: e.target.value }))}
                  placeholder="Write your email content here…" className={inp + ' resize-none'} />
              </div>
              <div className="flex gap-3">
                <button onClick={sendEmail} className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] text-white text-sm font-semibold rounded-xl transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <Send size={14} /> Schedule Send
                </button>
                <button onClick={() => setComposing(false)} className="px-5 py-2.5 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setComposing(true)}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#1a2d5a] hover:bg-[#142248] text-white text-sm font-semibold rounded-xl transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}>
              <Plus size={15} /> Compose New Email Campaign
            </button>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/50">
                  {['Subject', 'Audience', 'Status', 'Date', 'Opens', 'Clicks', 'Actions'].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {emails.map(e => (
                  <tr key={e.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="px-4 py-3 max-w-[220px]">
                      <p className="text-xs font-semibold text-[#1a2d5a] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{e.subject}</p>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>{e.audience}</span></td>
                    <td className="px-4 py-3"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[e.status]}`} style={{ fontFamily: 'Inter, sans-serif' }}>{e.status}</span></td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>{e.sentDate || '—'}</span></td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{e.opens?.toLocaleString() || '—'}</span></td>
                    <td className="px-4 py-3"><span className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{e.clicks?.toLocaleString() || '—'}</span></td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#e8eef5] hover:text-[#1a2d5a] transition-colors"><Eye size={12} /></button>
                        {e.status === 'draft' && <button className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#e8eef5] hover:text-[#1a2d5a] transition-colors"><Edit size={12} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── SEO & Meta ───────────────────────────────────────────────── */}
      {section === 'seo' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <h3 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>SEO & Meta Settings</h3>
          {[
            { label: 'Platform Title Tag', value: 'Arizona Christian Tuition — Fund Christian Education' },
            { label: 'Meta Description', value: 'ACT connects Arizona donors with Christian school scholarship campaigns. Redirect your Arizona state taxes dollar-for-dollar.' },
            { label: 'OG Image URL', value: 'https://arizonachristiantuition.com/og-image.jpg' },
            { label: 'Twitter Card Type', value: 'summary_large_image' },
            { label: 'Canonical URL', value: 'https://arizonachristiantuition.com' },
          ].map(field => (
            <div key={field.label}>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>{field.label}</label>
              <input defaultValue={field.value} className={inp} />
            </div>
          ))}
          <button onClick={() => toast.success('SEO settings saved!')} className="px-6 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] text-white text-sm font-semibold rounded-xl transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
            Save SEO Settings
          </button>
        </div>
      )}
    </div>
  );
}
