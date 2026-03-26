import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import { Edit2, Save, ChevronLeft, Trash2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CATEGORIES } from '../data/mockData';
import { toast } from 'sonner';

export function EditCampaign() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { campaigns, updateCampaign, deleteCampaign } = useApp();

  const campaign = campaigns.find(c => c.id === campaignId);

  const [title, setTitle] = useState(campaign?.title || '');
  const [tagline, setTagline] = useState(campaign?.tagline || '');
  const [story, setStory] = useState(campaign?.story || '');
  const [category, setCategory] = useState(campaign?.category || '');
  const [goal, setGoal] = useState(campaign?.goal.toString() || '');
  const [imageUrl, setImageUrl] = useState(campaign?.image || '');
  const [daysLeft, setDaysLeft] = useState(campaign?.daysLeft.toString() || '90');
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#e8eef5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Campaign not found.</p>
          <Link to="/admin" className="text-[#1a2d5a] hover:underline">Back to Admin</Link>
        </div>
      </div>
    );
  }

  const handleSave = async () => {
    if (!title.trim() || !tagline.trim() || !category || !goal) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    await new Promise(r => setTimeout(r, 1000));

    updateCampaign(campaignId!, {
      title,
      tagline,
      story,
      category,
      goal: Number(goal),
      image: imageUrl || campaign.image,
      daysLeft: Number(daysLeft),
    });

    setIsSaving(false);
    toast.success('Campaign updated successfully!');
    navigate(`/campaign/${campaignId}`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(r => setTimeout(r, 1000));
    deleteCampaign(campaignId!);
    setIsDeleting(false);
    toast.success('Campaign deleted');
    navigate('/admin');
  };

  const inp = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40 bg-white';

  return (
    <div className="min-h-screen bg-[#e8eef5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4 mb-4">
            <button onClick={() => navigate('/admin')} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-[#1a2d5a] text-2xl font-bold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
              Edit Campaign
            </h1>
            <div className="flex-1" />
            <span className="px-3 py-1 bg-[#edf2f8] text-[#1a2d5a] text-xs font-semibold rounded-full">
              {campaign.status}
            </span>
          </div>
          <p className="text-gray-500 text-sm">Campaign ID: {campaignId}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="space-y-8">
          {/* Campaign Info Card */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a2d5a] to-[#2a3d6a] px-8 py-6">
              <h2 className="text-white text-lg font-semibold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                Campaign Information
              </h2>
            </div>

            <div className="p-8 space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Campaign Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                  className={inp}
                />
                <div className="text-right text-xs text-gray-400 mt-1">{title.length}/100</div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Tagline *
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  maxLength={140}
                  className={inp}
                />
                <p className="text-xs text-gray-500 mt-1">One sentence summary</p>
              </div>

              {/* Category & Goal */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Category *
                  </label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className={inp + ' bg-white'}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Goal Amount ($) *
                  </label>
                  <input
                    type="number"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    min={100}
                    className={inp}
                  />
                </div>
              </div>

              {/* Campaign Duration */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Days Remaining
                </label>
                <input
                  type="number"
                  value={daysLeft}
                  onChange={(e) => setDaysLeft(e.target.value)}
                  min={1}
                  className={inp}
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Featured Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className={inp}
                />
                {imageUrl && (
                  <div className="mt-3">
                    <img src={imageUrl} alt="Preview" className="w-full max-h-64 object-cover rounded-lg" />
                  </div>
                )}
              </div>

              {/* Story */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Campaign Story
                </label>
                <textarea
                  value={story}
                  onChange={(e) => setStory(e.target.value)}
                  rows={10}
                  className={inp}
                  placeholder="Write your campaign story here. Supports markdown formatting."
                />
                <p className="text-xs text-gray-500 mt-1">Markdown formatting supported</p>
              </div>

              {/* Save Button */}
              <div className="flex gap-3 pt-6 border-t border-gray-200">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#1a2d5a] text-white rounded-xl hover:bg-[#142248] disabled:opacity-50 transition-colors font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Save size={18} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
                <button
                  onClick={() => navigate(`/campaign/${campaignId}`)}
                  className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  Preview
                </button>
              </div>
            </div>
          </div>

          {/* Creator Info Card - Read Only */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#1a2d5a] to-[#2a3d6a] px-8 py-6">
              <h2 className="text-white text-lg font-semibold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                Creator Information
              </h2>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <img src={campaign.creator.avatar} alt={campaign.creator.name} className="w-16 h-16 rounded-full object-cover" />
                <div>
                  <h3 className="text-[#1a2d5a] font-semibold">{campaign.creator.name}</h3>
                  <p className="text-sm text-gray-500">{campaign.creator.bio}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{campaign.creator.location}</p>
                </div>
              </div>
              <p className="text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
                To edit creator information, visit your profile settings.
              </p>
            </div>
          </div>

          {/* Campaign Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs text-gray-500 font-semibold mb-2">Raised</p>
              <p className="text-2xl font-bold text-[#1a2d5a]">${campaign.raised.toLocaleString()}</p>
              <p className="text-xs text-gray-400 mt-2">{Math.round((campaign.raised / campaign.goal) * 100)}% of goal</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs text-gray-500 font-semibold mb-2">Backers</p>
              <p className="text-2xl font-bold text-[#1a2d5a]">{campaign.backers}</p>
              <p className="text-xs text-gray-400 mt-2">supporters</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <p className="text-xs text-gray-500 font-semibold mb-2">Created</p>
              <p className="text-2xl font-bold text-[#1a2d5a]">{new Date(campaign.createdAt).toLocaleDateString()}</p>
              <p className="text-xs text-gray-400 mt-2">campaign date</p>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl overflow-hidden">
            <div className="bg-red-100 px-8 py-6 flex items-center gap-3">
              <AlertCircle size={20} className="text-red-600" />
              <h2 className="text-red-900 font-semibold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                Danger Zone
              </h2>
            </div>

            <div className="p-8">
              {!showDeleteConfirm ? (
                <>
                  <p className="text-sm text-gray-600 mb-4">
                    Deleting this campaign is permanent and cannot be undone.
                  </p>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <Trash2 size={18} /> Delete Campaign
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <p className="text-sm text-gray-600 font-semibold">
                    Are you sure you want to delete "{campaign.title}"? This cannot be undone.
                  </p>
                  <div className="flex gap-3">
                    <button
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors font-semibold"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                    </button>
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
