import { useState } from 'react';
import { Search, Filter, Star, StarOff, Check, X, Trash2, Eye, ChevronDown, Edit } from 'lucide-react';
import { Campaign } from '../../data/mockData';
import { toast } from 'sonner';

type CampaignStatus = 'all' | 'active' | 'pending' | 'funded' | 'suspended';

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700',
  funded: 'bg-blue-100 text-blue-700',
  ending_soon: 'bg-amber-100 text-amber-700',
  pending: 'bg-gray-100 text-gray-600',
  suspended: 'bg-red-100 text-red-600',
};

// Mock pending campaigns
const PENDING_CAMPAIGNS = [
  { id: 'p1', title: 'Desert Ridge Christian — New STEM Lab', category: 'STEM', goal: 80000, raised: 0, backers: 0, daysLeft: 30, image: 'https://images.unsplash.com/photo-1567168544813-cc03465b4fa8?w=80&h=80&fit=crop', tags: [], featured: false, status: 'pending' as const, createdAt: '2026-03-23', tagline: '', story: '', updates: [], faqs: [], pledgeTiers: [], creator: { id: 'par_001', name: 'David Kim', avatar: 'https://i.pravatar.cc/40?u=d1', bio: '', campaignsCreated: 0, location: 'Scottsdale, AZ' } },
  { id: 'p2', title: 'Sonoran Hills Academy — Music Program', category: 'Music School', goal: 35000, raised: 0, backers: 0, daysLeft: 45, image: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=80&h=80&fit=crop', tags: [], featured: false, status: 'pending' as const, createdAt: '2026-03-22', tagline: '', story: '', updates: [], faqs: [], pledgeTiers: [], creator: { id: 'par_002', name: 'Maria Santos', avatar: 'https://i.pravatar.cc/40?u=d2', bio: '', campaignsCreated: 0, location: 'Mesa, AZ' } },
  { id: 'p3', title: 'Valley Christian School — Trade Skills Center', category: 'Trade Schools', goal: 120000, raised: 0, backers: 0, daysLeft: 60, image: 'https://images.unsplash.com/photo-1581093577421-f561a654a353?w=80&h=80&fit=crop', tags: [], featured: false, status: 'pending' as const, createdAt: '2026-03-21', tagline: '', story: '', updates: [], faqs: [], pledgeTiers: [], creator: { id: 'par_003', name: 'Robert Chen', avatar: 'https://i.pravatar.cc/40?u=d3', bio: '', campaignsCreated: 1, location: 'Gilbert, AZ' } },
  { id: 'p4', title: 'Grace Academy — Kindergarten Expansion', category: 'Elementary Schools', goal: 55000, raised: 0, backers: 0, daysLeft: 30, image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=80&h=80&fit=crop', tags: [], featured: false, status: 'pending' as const, createdAt: '2026-03-20', tagline: '', story: '', updates: [], faqs: [], pledgeTiers: [], creator: { id: 'par_004', name: 'Jennifer Walsh', avatar: 'https://i.pravatar.cc/40?u=d4', bio: '', campaignsCreated: 0, location: 'Chandler, AZ' } },
];

interface Props {
  campaigns: Campaign[];
  onToggleFeature: (id: string, featured: boolean) => void;
  onDelete: (id: string) => void;
}

export function CampaignsTab({ campaigns, onToggleFeature, onDelete }: Props) {
  const [filter, setFilter] = useState<CampaignStatus>('all');
  const [search, setSearch] = useState('');
  const [pendingCampaigns, setPendingCampaigns] = useState(PENDING_CAMPAIGNS);
  const [localCampaigns, setLocalCampaigns] = useState<Campaign[]>(campaigns);
  const [deletedIds, setDeletedIds] = useState<Set<string>>(new Set());
  const [suspendedIds, setSuspendedIds] = useState<Set<string>>(new Set());
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState<'recent' | 'raised' | 'goal'>('recent');

  const allItems = [
    ...pendingCampaigns.map(c => ({ ...c, status: 'pending' as const })),
    ...localCampaigns
      .filter(c => !deletedIds.has(c.id))
      .map(c => ({ ...c, status: suspendedIds.has(c.id) ? 'suspended' as const : c.status })),
  ];

  const filtered = allItems.filter(c => {
    const matchesFilter = filter === 'all' || c.status === filter;
    const matchesSearch = !search || c.title.toLowerCase().includes(search.toLowerCase()) || c.creator.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === 'raised') return b.raised - a.raised;
    if (sortBy === 'goal') return b.goal - a.goal;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });

  const approveById = (id: string) => {
    setPendingCampaigns(prev => prev.filter(c => c.id !== id));
    toast.success('Campaign approved and published!');
  };
  const rejectById = (id: string) => {
    setPendingCampaigns(prev => prev.filter(c => c.id !== id));
    toast('Campaign rejected and removed.');
  };
  const suspendById = (id: string) => {
    setSuspendedIds(prev => { const s = new Set(prev); s.add(id); return s; });
    toast('Campaign suspended.');
  };
  const reinstateById = (id: string) => {
    setSuspendedIds(prev => { const s = new Set(prev); s.delete(id); return s; });
    toast.success('Campaign reinstated.');
  };
  const deleteById = (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return;
    setPendingCampaigns(prev => prev.filter(c => c.id !== id));
    setDeletedIds(prev => { const s = new Set(prev); s.add(id); return s; });
    onDelete(id);
    toast('Campaign deleted.');
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const FILTERS: { key: CampaignStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: `Pending (${pendingCampaigns.length})` },
    { key: 'active', label: 'Active' },
    { key: 'funded', label: 'Funded' },
    { key: 'suspended', label: 'Suspended' },
  ];

  return (
    <div className="space-y-5">
      {/* Header controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f.key ? 'bg-[#1a2d5a] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a2d5a]/30'}`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-56">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search campaigns…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 bg-white"
              style={{ fontFamily: 'Inter, sans-serif' }} />
          </div>
          <select value={sortBy} onChange={e => setSortBy(e.target.value as any)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-600"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            <option value="recent">Most Recent</option>
            <option value="raised">Most Raised</option>
            <option value="goal">Highest Goal</option>
          </select>
        </div>
      </div>

      {/* Batch actions */}
      {selectedIds.size > 0 && (
        <div className="flex items-center gap-3 p-3 bg-[#1a2d5a]/5 rounded-xl border border-[#1a2d5a]/10">
          <span className="text-xs font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>{selectedIds.size} selected</span>
          <button onClick={() => { selectedIds.forEach(id => suspendById(id)); setSelectedIds(new Set()); }}
            className="px-3 py-1.5 text-xs font-semibold text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
            Suspend All
          </button>
          <button onClick={() => { if (!window.confirm(`Delete ${selectedIds.size} campaigns? This cannot be undone.`)) return; selectedIds.forEach(id => { const c = allItems.find(x => x.id === id); deleteById(id, c?.title || id); }); setSelectedIds(new Set()); }}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
            Delete All
          </button>
          <button onClick={() => setSelectedIds(new Set())} className="ml-auto text-gray-400 hover:text-gray-600">
            <X size={14} />
          </button>
        </div>
      )}

      {/* Campaign table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                <th className="px-4 py-3 text-left w-8">
                  <input type="checkbox" className="accent-[#1a2d5a] w-3.5 h-3.5"
                    onChange={e => setSelectedIds(e.target.checked ? new Set(sorted.map(c => c.id)) : new Set())}
                    checked={selectedIds.size === sorted.length && sorted.length > 0} />
                </th>
                {['Campaign', 'Category', 'Progress', 'Creator', 'Status', 'Featured', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>No campaigns found.</td></tr>
              )}
              {sorted.map(campaign => {
                const pct = campaign.goal > 0 ? Math.min(100, Math.round((campaign.raised / campaign.goal) * 100)) : 0;
                const isPending = campaign.status === 'pending';
                const isSuspended = campaign.status === 'suspended';
                const isFeatured = localCampaigns.find(c => c.id === campaign.id)?.featured ?? false;
                return (
                  <tr key={campaign.id} className={`border-b border-gray-50 hover:bg-gray-50/50 transition-colors ${selectedIds.has(campaign.id) ? 'bg-[#e8eef5]/40' : ''}`}>
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={selectedIds.has(campaign.id)} onChange={() => toggleSelect(campaign.id)} className="accent-[#1a2d5a] w-3.5 h-3.5" />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3" style={{ minWidth: 220 }}>
                        <img src={campaign.image} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" />
                        <div>
                          <p className="text-xs font-semibold text-[#1a2d5a] line-clamp-2 leading-snug" style={{ fontFamily: 'Inter, sans-serif' }}>{campaign.title}</p>
                          <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{campaign.createdAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-1 bg-[#e8eef5] text-[#1a2d5a] text-xs font-medium rounded-md whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {campaign.category}
                      </span>
                    </td>
                    <td className="px-4 py-3" style={{ minWidth: 140 }}>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                          <span className="font-semibold text-[#1a2d5a]">${campaign.raised.toLocaleString()}</span>
                          <span className="text-gray-400">{pct}%</span>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full">
                          <div className="h-full bg-[#1a2d5a] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>of ${campaign.goal.toLocaleString()}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <img src={campaign.creator.avatar} alt="" className="w-6 h-6 rounded-full object-cover" />
                        <span className="text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>{campaign.creator.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_COLORS[campaign.status] || 'bg-gray-100 text-gray-500'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                        {campaign.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {!isPending && (
                        <button onClick={() => { onToggleFeature(campaign.id, !isFeatured); setLocalCampaigns(prev => prev.map(c => c.id === campaign.id ? { ...c, featured: !isFeatured } : c)); toast(isFeatured ? 'Removed from featured.' : 'Campaign featured! ⭐'); }}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${isFeatured ? 'bg-amber-50 text-amber-500 hover:bg-amber-100' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>
                          {isFeatured ? <Star size={14} fill="currentColor" /> : <StarOff size={14} />}
                        </button>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 whitespace-nowrap">
                        {isPending ? (
                          <>
                            <button onClick={() => approveById(campaign.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                              <Check size={12} /> Approve
                            </button>
                            <button onClick={() => rejectById(campaign.id)} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                              <X size={12} /> Reject
                            </button>
                            <button onClick={() => deleteById(campaign.id, campaign.title)} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                              <Trash2 size={12} /> Delete
                            </button>
                          </>
                        ) : (
                          <>
                            <button className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#e8eef5] hover:text-[#1a2d5a] transition-colors">
                              <Eye size={12} />
                            </button>
                            <button className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-[#e8eef5] hover:text-[#1a2d5a] transition-colors">
                              <Edit size={12} />
                            </button>
                            {isSuspended ? (
                              <button onClick={() => reinstateById(campaign.id)} className="flex items-center gap-1 px-2 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                                <Check size={11} /> Reinstate
                              </button>
                            ) : (
                              <button onClick={() => suspendById(campaign.id)} className="flex items-center gap-1 px-2 py-1.5 bg-amber-50 text-amber-600 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                                Suspend
                              </button>
                            )}
                            <button onClick={() => deleteById(campaign.id, campaign.title)} className="flex items-center gap-1 px-2.5 py-1.5 bg-red-600 text-white text-xs font-semibold rounded-lg hover:bg-red-700 transition-colors" style={{ fontFamily: 'Inter, sans-serif' }}>
                              <Trash2 size={12} /> Delete
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
          Showing {sorted.length} of {allItems.length} campaigns
        </div>
      </div>
    </div>
  );
}
