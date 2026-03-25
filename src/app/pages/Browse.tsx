import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router';
import { Search, SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { CampaignCard } from '../components/CampaignCard';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';

type SortOption = 'trending' | 'newest' | 'most_funded' | 'ending_soon';

const SORT_LABELS: Record<SortOption, string> = {
  trending: 'Most Donors',
  newest: 'Newest',
  most_funded: 'Most Funded',
  ending_soon: 'Ending Soon',
};

export function Browse() {
  const { campaigns } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState<SortOption>((searchParams.get('sort') as SortOption) || 'trending');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (query) params.q = query;
    if (selectedCategory) params.category = selectedCategory;
    if (sort !== 'trending') params.sort = sort;
    setSearchParams(params, { replace: true });
  }, [query, selectedCategory, sort]);

  const filtered = useMemo(() => {
    let result = [...campaigns];

    if (query) {
      const q = query.toLowerCase();
      result = result.filter(
        c =>
          c.title.toLowerCase().includes(q) ||
          c.tagline.toLowerCase().includes(q) ||
          c.tags.some(t => t.toLowerCase().includes(q)) ||
          c.category.toLowerCase().includes(q) ||
          c.creator.name.toLowerCase().includes(q) ||
          c.creator.location.toLowerCase().includes(q),
      );
    }

    if (selectedCategory) {
      result = result.filter(c => c.category === selectedCategory);
    }

    if (statusFilter !== 'all') {
      result = result.filter(c => c.status === statusFilter);
    }

    switch (sort) {
      case 'trending':
        result.sort((a, b) => b.backers - a.backers);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'most_funded':
        result.sort((a, b) => b.raised / b.goal - a.raised / a.goal);
        break;
      case 'ending_soon':
        result.sort((a, b) => a.daysLeft - b.daysLeft);
        break;
    }

    return result;
  }, [campaigns, query, selectedCategory, sort, statusFilter]);

  return (
    <div className="min-h-screen bg-[#e8eef5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <h1
            className="text-[#1a2d5a] mb-1"
            style={{ fontFamily: 'Merriweather, Georgia, serif', fontSize: '1.8rem', fontWeight: 700 }}
          >
            Explore Campaigns
          </h1>
          <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>
            {filtered.length} certified school campaigns{selectedCategory ? ` in ${selectedCategory}` : ' across all school types'}
          </p>

          {/* Search + filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative flex-1 min-w-[240px] max-w-md">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by school, city, or program…"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              {query && (
                <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="relative">
              <select
                value={sort}
                onChange={e => setSort(e.target.value as SortOption)}
                className="appearance-none pl-3 pr-8 py-2.5 text-sm bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 cursor-pointer"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {Object.entries(SORT_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm rounded-lg border transition-colors ${filtersOpen ? 'bg-[#edf2f8] border-[#1a2d5a]/40 text-[#1a2d5a]' : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'}`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <SlidersHorizontal size={14} /> Filters
            </button>

            {/* Active filters */}
            {(selectedCategory || statusFilter !== 'all') && (
              <div className="flex gap-2 flex-wrap">
                {selectedCategory && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#1a2d5a] text-white text-xs rounded-full font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('')}><X size={11} /></button>
                  </span>
                )}
                {statusFilter !== 'all' && (
                  <span className="flex items-center gap-1 px-3 py-1 bg-[#1a2d5a] text-white text-xs rounded-full font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {statusFilter.replace('_', ' ')}
                    <button onClick={() => setStatusFilter('all')}><X size={11} /></button>
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Sidebar Filters */}
        {filtersOpen && (
          <aside className="w-56 shrink-0 space-y-6">
            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>School Type</h3>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedCategory('')}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === '' ? 'bg-[#1a2d5a] text-white font-semibold' : 'text-gray-600 hover:bg-[#edf2f8]'}`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  All Types
                </button>
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCategory === cat ? 'bg-[#1a2d5a] text-white font-semibold' : 'text-gray-600 hover:bg-[#edf2f8]'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Status</h3>
              <div className="space-y-1">
                {['all', 'active', 'funded', 'ending_soon'].map(status => (
                  <button
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${statusFilter === status ? 'bg-[#1a2d5a] text-white font-semibold' : 'text-gray-600 hover:bg-[#edf2f8]'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {status === 'all' ? 'All Campaigns' : status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        )}

        {/* Results */}
        <div className="flex-1 min-w-0">
          {/* Category pills */}
          <div className="flex gap-2 flex-wrap mb-6 overflow-x-auto pb-1">
            <button
              onClick={() => setSelectedCategory('')}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors ${selectedCategory === '' ? 'bg-[#1a2d5a] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1a2d5a]/40 hover:text-[#1a2d5a]'}`}
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              All
            </button>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat === selectedCategory ? '' : cat)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat ? 'bg-[#1a2d5a] text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1a2d5a]/40 hover:text-[#1a2d5a]'}`}
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {cat}
              </button>
            ))}
          </div>

          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <div className="text-5xl mb-4">🔍</div>
              <h3
                className="text-[#1a2d5a] mb-2"
                style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.1rem' }}
              >
                No campaigns found
              </h3>
              <p className="text-gray-500 text-sm mb-6" style={{ fontFamily: 'Inter, sans-serif' }}>Try adjusting your search or filters.</p>
              <button
                onClick={() => { setQuery(''); setSelectedCategory(''); setStatusFilter('all'); }}
                className="px-4 py-2 bg-[#1a2d5a] text-white text-sm rounded hover:bg-[#142248] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filtered.map(c => <CampaignCard key={c.id} campaign={c} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}