import { Link } from 'react-router';
import { Clock, Users, Star } from 'lucide-react';
import { Campaign } from '../data/mockData';

interface CampaignCardProps {
  campaign: Campaign;
  size?: 'sm' | 'md' | 'lg';
}

const STATUS_BADGE = {
  active: null,
  funded: { label: 'Fully Funded', color: 'bg-emerald-100 text-emerald-700' },
  ending_soon: { label: 'Ending Soon', color: 'bg-red-100 text-[#c8202d]' },
};

const CATEGORY_COLORS: Record<string, string> = {
  PreSchools: 'bg-pink-50 text-pink-700',
  'Elementary Schools': 'bg-blue-50 text-blue-700',
  'Middle Schools': 'bg-cyan-50 text-cyan-700',
  'High Schools': 'bg-indigo-50 text-indigo-700',
  'Trade Schools': 'bg-orange-50 text-orange-700',
  'Private Schools': 'bg-violet-50 text-violet-700',
  STEM: 'bg-teal-50 text-teal-700',
  Vocational: 'bg-amber-50 text-amber-700',
  Scholarships: 'bg-purple-50 text-purple-700',
  'Business Schools': 'bg-emerald-50 text-emerald-700',
  'Music School': 'bg-rose-50 text-rose-700',
  'All Grades': 'bg-sky-50 text-sky-700',
};

export function CampaignCard({ campaign, size = 'md' }: CampaignCardProps) {
  const pct = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
  const statusBadge = STATUS_BADGE[campaign.status];
  const catColor = CATEGORY_COLORS[campaign.category] || 'bg-gray-100 text-gray-600';

  const formatAmount = (n: number) =>
    n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k` : `$${n}`;

  return (
    <Link
      to={`/campaign/${campaign.id}`}
      className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-[#1a2d5a]/30 hover:shadow-lg hover:shadow-[#1a2d5a]/10 transition-all duration-200 flex flex-col"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: size === 'lg' ? 220 : size === 'sm' ? 140 : 180 }}>
        <img
          src={campaign.image}
          alt={campaign.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex gap-2 flex-wrap">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${catColor}`}>
            {campaign.category}
          </span>
          {statusBadge && (
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${statusBadge.color}`}>
              {statusBadge.label}
            </span>
          )}
        </div>
        {campaign.featured && (
          <div className="absolute top-3 right-3">
            <span className="flex items-center gap-1 px-2 py-0.5 bg-white/90 backdrop-blur rounded-full text-xs font-semibold text-[#1a2d5a]">
              <Star size={10} className="text-[#c8202d] fill-[#c8202d]" /> Featured
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* School name */}
        <div className="flex items-center gap-2">
          <img src={campaign.creator.avatar} alt={campaign.creator.name} className="w-5 h-5 rounded-full object-cover" />
          <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>{campaign.creator.location}</span>
        </div>

        {/* Title */}
        <h3
          className="text-sm text-gray-900 leading-snug line-clamp-2 group-hover:text-[#1a2d5a] transition-colors"
          style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
        >
          {campaign.title}
        </h3>

        {/* Tags */}
        {size !== 'sm' && (
          <div className="flex flex-wrap gap-1">
            {campaign.tags.slice(0, 3).map(tag => (
              <span key={tag} className="px-2 py-0.5 bg-[#edf2f8] text-[#1a2d5a] text-xs rounded font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Progress */}
        <div className="mt-auto space-y-1.5">
          <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="font-semibold text-gray-900">{formatAmount(campaign.raised)}</span>
            <span className="text-gray-400">of {formatAmount(campaign.goal)}</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${
                campaign.status === 'funded'
                  ? 'bg-emerald-500'
                  : 'bg-[#1a2d5a]'
              }`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
            <span className="font-semibold text-[#1a2d5a]">{pct}% funded</span>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Users size={10} />
                {campaign.backers.toLocaleString()} donors
              </span>
              <span className="flex items-center gap-1">
                <Clock size={10} />
                {campaign.daysLeft}d left
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}