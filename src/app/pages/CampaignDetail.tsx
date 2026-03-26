import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router';
import {
  Clock, Users, Heart, Share2, ChevronRight, Check,
  MapPin, ExternalLink, MessageCircle, AlertCircle, X, BookOpen,
  Zap, Receipt,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PledgeTier } from '../data/mockData';
import { toast } from 'sonner';
import { TaxDeductibleModal } from '../components/TaxDeductibleModal';
import { ShareModal } from '../components/ShareModal';

const TABS = ['Story', 'Updates', 'Donors', 'FAQ'] as const;
type Tab = typeof TABS[number];

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);
}

function DonateModal({
  tiers, campaignId, campaignTitle, onClose,
}: {
  tiers: PledgeTier[];
  campaignId: string;
  campaignTitle: string;
  onClose: () => void;
}) {
  const { makePledge } = useApp();
  const [selected, setSelected] = useState<PledgeTier | null>(tiers[0]);
  const [step, setStep] = useState<'choose' | 'select' | 'payment' | 'success'>('choose');
  const [showTaxModal, setShowTaxModal] = useState(false);
  const [cardNum, setCardNum] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  // ── Custom amount ──────────────────────────────────────────────────────────
  const [useCustom, setUseCustom] = useState(false);
  const [customAmountInput, setCustomAmountInput] = useState('');
  const customAmountNum = parseFloat(customAmountInput.replace(/,/g, '')) || 0;

  function selectTier(tier: PledgeTier) {
    setSelected(tier);
    setUseCustom(false);
    setCustomAmountInput('');
  }

  function activateCustom() {
    setSelected(null);
    setUseCustom(true);
  }

  const canContinue = useCustom ? customAmountNum >= 1 : !!selected;

  // Effective values for payment/success screens
  const effectiveAmount = useCustom ? customAmountNum : (selected?.amount || 0);
  const effectiveTitle  = useCustom ? 'Custom Donation' : (selected?.title || '');
  const effectiveDesc   = useCustom ? `A one-time donation of ${formatCurrency(customAmountNum)}` : (selected?.description || '');

  const handleDonate = () => {
    let donationTier: PledgeTier;
    if (useCustom) {
      donationTier = {
        id: 'custom',
        title: 'Custom Donation',
        amount: customAmountNum,
        description: `Custom donation of ${formatCurrency(customAmountNum)}`,
        perks: ['Tax credit receipt', 'Personal impact update'],
        claimed: 0,
        eta: 'Immediate',
      };
    } else {
      if (!selected) return;
      donationTier = selected;
    }
    makePledge(campaignId, donationTier);
    setStep('success');
    setTimeout(() => {
      onClose();
      toast.success(`🙏 Thank you! Your ${formatCurrency(donationTier.amount)} donation is confirmed!`);
    }, 2200);
  };

  // If tax modal is open, render it instead
  if (showTaxModal) {
    return (
      <TaxDeductibleModal
        campaignTitle={campaignTitle}
        onClose={onClose}
        onSuccess={(amount) => {
          toast.success(`🙏 Thank you! Your tax-deductible donation of ${formatCurrency(amount)} is confirmed!`);
        }}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-gray-200">
        {(step === 'select' || step === 'payment') && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2
              className="text-[#1a2d5a]"
              style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
            >
              Donate to This Campaign
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-[#edf2f8] rounded-full transition-colors text-gray-500">
              <X size={18} />
            </button>
          </div>
        )}

        {/* ── STEP: CHOOSE DONATION TYPE ─────────────────────────────────── */}
        {step === 'choose' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>
                Choose Donation Type
              </h2>
              <button onClick={onClose} className="p-2 hover:bg-[#edf2f8] rounded-full transition-colors text-gray-500">
                <X size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              How would you like to donate today?
            </p>

            {/* Quick Donation option */}
            <button
              onClick={() => setStep('select')}
              className="w-full text-left p-5 rounded-xl border-2 border-gray-200 hover:border-[#1a2d5a]/60 hover:bg-[#edf2f8] transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#1a2d5a] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Zap size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-[#1a2d5a] font-bold text-base mb-1" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                    Quick Donation
                  </p>
                  <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Pick a giving level and donate in under 2 minutes. Fast, simple, and secure.
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {tiers.slice(0, 3).map(t => (
                      <span key={t.id} className="text-xs px-2 py-0.5 bg-[#1a2d5a]/10 text-[#1a2d5a] rounded-full font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {formatCurrency(t.amount)}
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 mt-1 shrink-0 group-hover:text-[#1a2d5a] transition-colors" />
              </div>
            </button>

            {/* Tax Deductible Donation option */}
            <button
              onClick={() => setShowTaxModal(true)}
              className="w-full text-left p-5 rounded-xl border-2 border-gray-200 hover:border-[#c8202d]/50 hover:bg-red-50/30 transition-all group"
            >
              <div className="flex items-start gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#c8202d] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                  <Receipt size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-[#1a2d5a] font-bold text-base" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                      Tax Deductible Donation
                    </p>
                    <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-semibold uppercase tracking-wide" style={{ fontFamily: 'Inter, sans-serif' }}>
                      AZ Tax Credit
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                    4-step guided form that calculates your Arizona Private School Tax Credit. Get up to{' '}
                    <strong className="text-[#c8202d]">$1,505</strong> (single) or{' '}
                    <strong className="text-[#c8202d]">$3,010</strong> (married) back on your state taxes.
                  </p>
                  <div className="mt-2 flex items-center gap-1.5">
                    {['Donor Info', 'Tax Credit', 'Payment', 'Review'].map((s, i) => (
                      <span key={s} className="flex items-center gap-1 text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {i > 0 && <ChevronRight size={10} />}
                        <span>{s}</span>
                      </span>
                    ))}
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-400 mt-1 shrink-0 group-hover:text-[#c8202d] transition-colors" />
              </div>
            </button>

            <p className="text-center text-xs text-gray-400 pt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
              ✅ All donations support Arizona's Private School Tax Credit program
            </p>
          </div>
        )}

        {step === 'select' && (
          <div className="p-6 space-y-3">
            <p className="text-sm text-gray-500 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
              Select a giving level or enter a custom amount. All donations qualify for Arizona's Private School Tax Credit.
            </p>
            {tiers.map(tier => {
              const isSoldOut = tier.limit != null && tier.claimed >= tier.limit;
              return (
                <button
                  key={tier.id}
                  disabled={isSoldOut}
                  onClick={() => selectTier(tier)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSoldOut ? 'opacity-40 cursor-not-allowed border-gray-100 bg-gray-50' : !useCustom && selected?.id === tier.id ? 'border-[#1a2d5a] bg-[#edf2f8]' : 'border-gray-200 hover:border-[#1a2d5a]/50'}`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-[#1a2d5a]"
                      style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
                    >
                      {tier.title}
                    </span>
                    <span
                      className="text-[#c8202d]"
                      style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 900, fontSize: '1.15rem' }}
                    >
                      {formatCurrency(tier.amount)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{tier.description}</p>
                  <ul className="space-y-0.5">
                    {tier.perks.map(p => (
                      <li key={p} className="flex items-center gap-1.5 text-xs text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <Check size={11} className="text-emerald-500 shrink-0" /> {p}
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                    <span>{tier.claimed} donors</span>
                    {tier.limit && <span className="text-[#c8202d]">{tier.limit - tier.claimed} spots remaining</span>}
                    <span>Est. {tier.eta}</span>
                  </div>
                  {isSoldOut && <div className="mt-2 text-xs font-semibold text-red-500" style={{ fontFamily: 'Inter, sans-serif' }}>Giving Level Closed</div>}
                </button>
              );
            })}

            {/* ── Custom Amount card ───────────────────────────────────────── */}
            <div
              onClick={activateCustom}
              className={`w-full p-4 rounded-xl border-2 cursor-pointer transition-all ${useCustom ? 'border-[#1a2d5a] bg-[#edf2f8]' : 'border-dashed border-gray-300 hover:border-[#1a2d5a]/50 hover:bg-[#edf2f8]/50'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${useCustom ? 'bg-[#1a2d5a] border-[#1a2d5a]' : 'border-gray-400'}`}>
                  {useCustom && <Check size={11} className="text-white" />}
                </div>
                <span className="text-[#1a2d5a] font-bold text-sm" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                  Custom Amount
                </span>
                <span className="ml-auto text-xs text-gray-400 font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Any amount
                </span>
              </div>
              <p className="text-xs text-gray-500 mb-3 ml-8" style={{ fontFamily: 'Inter, sans-serif' }}>
                Give exactly what feels right — every dollar makes a difference.
              </p>
              {useCustom && (
                <div className="ml-8" onClick={e => e.stopPropagation()}>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>$</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Enter amount"
                      value={customAmountInput}
                      onChange={e => setCustomAmountInput(e.target.value)}
                      autoFocus
                      className="w-full pl-7 pr-4 py-2.5 border border-[#1a2d5a]/30 rounded-lg text-sm text-[#1a2d5a] font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/25 focus:border-[#1a2d5a]/60 placeholder-gray-400"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  {/* Quick-pick amounts */}
                  <div className="flex gap-2 mt-2">
                    {[25, 50, 100, 250].map(amt => (
                      <button
                        key={amt}
                        type="button"
                        onClick={() => setCustomAmountInput(String(amt))}
                        className="flex-1 py-1.5 text-xs border border-[#1a2d5a]/25 text-[#1a2d5a] rounded-lg hover:bg-[#1a2d5a]/10 transition-colors font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        ${amt}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => canContinue && setStep('payment')}
              disabled={!canContinue}
              className="w-full py-3.5 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-50 text-white rounded-xl transition-colors mt-2"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
            >
              {useCustom
                ? customAmountNum >= 1
                  ? `Continue with ${formatCurrency(customAmountNum)}`
                  : 'Enter an amount to continue'
                : selected
                  ? `Continue with ${formatCurrency(selected.amount)}`
                  : '—'}
            </button>
          </div>
        )}

        {step === 'payment' && (
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 p-4 bg-[#edf2f8] rounded-xl mb-2 border border-[#1a2d5a]/10">
              <div className="flex-1">
                <div
                  className="text-[#1a2d5a] text-sm"
                  style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
                >
                  {effectiveTitle}
                </div>
                <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>{effectiveDesc}</div>
              </div>
              <div
                className="text-[#c8202d]"
                style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 900, fontSize: '1.15rem' }}
              >
                {formatCurrency(effectiveAmount)}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Card Number</label>
              <input
                type="text" placeholder="4242 4242 4242 4242" maxLength={19}
                value={cardNum}
                onChange={e => setCardNum(e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim())}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Expiry</label>
                <input
                  type="text" placeholder="MM / YY" maxLength={7}
                  value={expiry} onChange={e => setExpiry(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>CVV</label>
                <input
                  type="text" placeholder="123" maxLength={4}
                  value={cvv} onChange={e => setCvv(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40"
                />
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
              <AlertCircle size={14} className="text-amber-600 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                Demo only. No real payment is processed. In production, donations would be processed securely through ACT's certified payment system.
              </p>
            </div>

            <button
              onClick={handleDonate}
              className="w-full py-3.5 bg-[#1a2d5a] hover:bg-[#142248] text-white rounded-xl transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
            >
              Confirm Donation — {formatCurrency(effectiveAmount)}
            </button>
            <button
              onClick={() => setStep('select')}
              className="w-full text-center text-sm text-gray-500 hover:text-gray-700 py-1"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              ← Back to giving levels
            </button>
          </div>
        )}

        {step === 'success' && (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-[#edf2f8] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[#1a2d5a]/20">
              <BookOpen size={36} className="text-[#1a2d5a]" />
            </div>
            <h3
              className="text-[#1a2d5a] mb-2"
              style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.4rem' }}
            >
              Thank You! 🙏
            </h3>
            <p className="text-gray-500 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
              Your donation of{' '}
              <strong className="text-[#c8202d]">{formatCurrency(effectiveAmount)}</strong>{' '}
              has been confirmed. Your Arizona tax credit receipt will arrive within 30 days.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export function CampaignDetail() {
  const { id } = useParams();
  const { campaigns } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('Story');
  const [donateOpen, setDonateOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const campaign = campaigns.find(c => c.id === id);
  if (!campaign) return <Navigate to="/browse" />;

  const pct = Math.min(100, Math.round((campaign.raised / campaign.goal) * 100));
  const isOverfunded = campaign.raised > campaign.goal;

  const handleSave = () => {
    setIsSaved(!isSaved);
    if (!isSaved) {
      toast.success('Campaign saved! View your saved campaigns in your profile.');
    } else {
      toast.info('Campaign removed from saved.');
    }
  };

  const handleShare = () => {
    setShareOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#e8eef5]">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-2 text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
          <Link to="/" className="hover:text-[#c8202d]">Home</Link>
          <ChevronRight size={12} />
          <Link to="/browse" className="hover:text-[#c8202d]">Campaigns</Link>
          <ChevronRight size={12} />
          <Link to={`/browse?category=${campaign.category}`} className="hover:text-[#c8202d]">{campaign.category}</Link>
          <ChevronRight size={12} />
          <span className="text-[#1a2d5a] truncate max-w-[200px] font-medium">{campaign.creator.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Hero image */}
            <div className="relative rounded-2xl overflow-hidden aspect-video border border-gray-200">
              <img src={campaign.image} alt={campaign.title} className="w-full h-full object-cover" />
              {campaign.status === 'funded' && (
                <div className="absolute top-4 left-4 px-3 py-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full">
                  ✓ FULLY FUNDED
                </div>
              )}
            </div>

            {/* Title & meta */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="px-3 py-1 bg-[#1a2d5a] text-white text-xs font-semibold rounded-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {campaign.category}
                </span>
                {campaign.tags.map(tag => (
                  <span key={tag} className="px-2.5 py-1 bg-[#edf2f8] text-[#1a2d5a] text-xs rounded font-medium" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {tag}
                  </span>
                ))}
              </div>
              <h1
                className="text-[#1a2d5a] leading-tight mb-3"
                style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}
              >
                {campaign.title}
              </h1>
              <p className="text-gray-600 text-base leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{campaign.tagline}</p>
            </div>

            {/* School info */}
            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-gray-200">
              <img src={campaign.creator.avatar} alt={campaign.creator.name} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1 min-w-0">
                <div
                  className="text-[#1a2d5a] text-sm"
                  style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
                >
                  {campaign.creator.name}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2" style={{ fontFamily: 'Inter, sans-serif' }}>{campaign.creator.bio}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className="flex items-center gap-1"><MapPin size={10} />{campaign.creator.location}</span>
                  <span>{campaign.creator.campaignsCreated} campaigns</span>
                </div>
              </div>
              <Link to={`/profile/${campaign.creator.id}`} className="shrink-0 p-2 hover:bg-[#edf2f8] rounded-full transition-colors text-gray-500" title="View Creator Profile">
                <ExternalLink size={16} />
              </Link>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {TABS.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-3.5 text-sm transition-colors relative ${activeTab === tab ? 'text-[#1a2d5a]' : 'text-gray-500 hover:text-gray-700'}`}
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: activeTab === tab ? 700 : 500 }}
                  >
                    {tab}
                    {tab === 'Updates' && campaign.updates.length > 0 && (
                      <span className="ml-1 inline-flex items-center justify-center w-4 h-4 bg-[#1a2d5a] text-white text-[10px] rounded-full font-bold">
                        {campaign.updates.length}
                      </span>
                    )}
                    {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#c8202d] rounded-full" />}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {activeTab === 'Story' && (
                  <div className="space-y-4">
                    {campaign.story.split('\n\n').map((para, i) => {
                      if (para.startsWith('**') && para.endsWith('**')) {
                        return (
                          <h3
                            key={i}
                            className="text-[#1a2d5a] mt-2"
                            style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1rem' }}
                          >
                            {para.replace(/\*\*/g, '')}
                          </h3>
                        );
                      }
                      if (para.startsWith('**')) {
                        const [heading, ...rest] = para.split('\n');
                        return (
                          <div key={i}>
                            <h3
                              className="text-[#1a2d5a]"
                              style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1rem' }}
                            >
                              {heading.replace(/\*\*/g, '')}
                            </h3>
                            <p className="text-gray-600 mt-1 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{rest.join('\n')}</p>
                          </div>
                        );
                      }
                      return <p key={i} className="text-gray-600 text-sm leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{para}</p>;
                    })}
                  </div>
                )}

                {activeTab === 'Updates' && (
                  <div className="space-y-6">
                    {campaign.updates.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <MessageCircle size={32} className="mx-auto mb-3 opacity-40" />
                        <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>No updates yet</p>
                      </div>
                    ) : (
                      campaign.updates.map(upd => (
                        <div key={upd.id} className="border-l-2 border-[#1a2d5a]/30 pl-5">
                          <div className="text-xs text-gray-400 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {new Date(upd.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                          </div>
                          <h4
                            className="text-[#1a2d5a] mb-2"
                            style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '0.95rem' }}
                          >
                            {upd.title}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{upd.content}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'Donors' && (
                  <div className="space-y-4">
                    <div className="text-center py-6">
                      <div
                        className="text-[#1a2d5a]"
                        style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 900, fontSize: '2.5rem' }}
                      >
                        {campaign.backers.toLocaleString()}
                      </div>
                      <div className="text-gray-500 text-sm mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Arizona taxpayers have donated to this campaign
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 bg-[#edf2f8] rounded-xl">
                          <img src={`https://i.pravatar.cc/40?img=${i + 10}`} alt="" className="w-8 h-8 rounded-full" />
                          <div>
                            <div className="text-xs font-semibold text-gray-900" style={{ fontFamily: 'Inter, sans-serif' }}>Donor #{campaign.backers - i}</div>
                            <div className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {campaign.pledgeTiers[i % campaign.pledgeTiers.length]?.title}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'FAQ' && (
                  <div className="space-y-5">
                    {campaign.faqs.length === 0 ? (
                      <div className="text-center py-12 text-gray-400">
                        <p className="text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>No FAQs yet</p>
                      </div>
                    ) : (
                      campaign.faqs.map((faq, i) => (
                        <div key={i} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                          <h4
                            className="text-[#1a2d5a] mb-2"
                            style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '0.95rem' }}
                          >
                            {faq.question}
                          </h4>
                          <p className="text-sm text-gray-600 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{faq.answer}</p>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Funding stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
              <div>
                <div
                  className="text-[#1a2d5a]"
                  style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 900, fontSize: '2rem' }}
                >
                  {formatCurrency(campaign.raised)}
                </div>
                <div className="text-sm text-gray-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  donated of <span className="font-semibold text-gray-700">{formatCurrency(campaign.goal)}</span> goal
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${campaign.status === 'funded' ? 'bg-emerald-500' : 'bg-[#1a2d5a]'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <div className="flex justify-between text-xs" style={{ fontFamily: 'Inter, sans-serif' }}>
                  <span className={`font-bold ${campaign.status === 'funded' ? 'text-emerald-600' : 'text-[#1a2d5a]'}`}>
                    {pct}% funded {isOverfunded && `(+${Math.round((campaign.raised / campaign.goal - 1) * 100)}%)`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#edf2f8] rounded-xl text-center">
                  <Users size={16} className="text-[#1a2d5a] mx-auto mb-1" />
                  <div
                    className="text-[#1a2d5a]"
                    style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
                  >
                    {campaign.backers.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>donors</div>
                </div>
                <div className="p-3 bg-[#edf2f8] rounded-xl text-center">
                  <Clock size={16} className="text-[#1a2d5a] mx-auto mb-1" />
                  <div
                    className="text-[#1a2d5a]"
                    style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
                  >
                    {campaign.daysLeft}
                  </div>
                  <div className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>days left</div>
                </div>
              </div>

              <button
                onClick={() => setDonateOpen(true)}
                className="w-full py-4 bg-[#1a2d5a] hover:bg-[#142248] text-white rounded-xl transition-colors"
                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
              >
                Donate Today
              </button>

              <div className="p-3 bg-[#edf2f8] rounded-xl border border-[#1a2d5a]/10">
                <p className="text-xs text-[#1a2d5a] text-center leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>
                  ✅ Donations qualify for Arizona's <strong>Private School Tax Credit</strong> — get every dollar back on your state taxes.
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 border rounded-xl text-sm transition-colors ${
                    isSaved
                      ? 'border-[#c8202d] bg-red-50 text-[#c8202d]'
                      : 'border-gray-200 hover:border-[#c8202d]/40 hover:bg-red-50 text-gray-600 hover:text-[#c8202d]'
                  }`}
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Heart size={14} className={isSaved ? 'fill-current' : ''} /> {isSaved ? 'Saved' : 'Save'}
                </button>
                <button
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-gray-200 hover:border-[#1a2d5a]/40 hover:bg-[#edf2f8] rounded-xl text-sm text-gray-600 hover:text-[#1a2d5a] transition-colors"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Share2 size={14} /> Share
                </button>
              </div>
            </div>

            {/* Giving tiers */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h3
                className="text-[#1a2d5a] mb-4"
                style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '0.95rem' }}
              >
                Giving Levels
              </h3>
              <div className="space-y-3">
                {campaign.pledgeTiers.map(tier => {
                  const isSoldOut = tier.limit != null && tier.claimed >= tier.limit;
                  return (
                    <button
                      key={tier.id}
                      disabled={isSoldOut}
                      onClick={() => setDonateOpen(true)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${isSoldOut ? 'opacity-50 cursor-not-allowed border-gray-100' : 'border-gray-100 hover:border-[#1a2d5a]/50 hover:bg-[#edf2f8]'}`}
                    >
                      <div className="flex justify-between items-start mb-1.5">
                        <span
                          className="text-[#1a2d5a] text-sm"
                          style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}
                        >
                          {tier.title}
                        </span>
                        <span
                          className="text-[#c8202d]"
                          style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 900 }}
                        >
                          {formatCurrency(tier.amount)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{tier.description}</p>
                      <div className="flex items-center gap-3 text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                        <span>{tier.claimed} donors</span>
                        {tier.limit && (
                          <span className={tier.limit - tier.claimed <= 5 ? 'text-[#c8202d] font-semibold' : 'text-amber-600'}>
                            {isSoldOut ? 'Full' : `${tier.limit - tier.claimed} spots left`}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {donateOpen && (
        <DonateModal
          tiers={campaign.pledgeTiers}
          campaignId={campaign.id}
          campaignTitle={campaign.title}
          onClose={() => setDonateOpen(false)}
        />
      )}

      {shareOpen && (
        <ShareModal
          campaignUrl={window.location.href}
          campaignTitle={campaign.title}
          campaignDescription={campaign.tagline}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}