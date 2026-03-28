import { useState, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router';
import {
  Save, ChevronLeft, Trash2, AlertCircle, GraduationCap,
  Plus, Check, UserPlus, Upload, ImageIcon, School,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { CATEGORIES } from '../data/mockData';
import type { PledgeTier } from '../data/mockData';
import { toast } from 'sonner';

const GRADE_LEVELS = [
  'Pre-K', 'Kindergarten',
  '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade',
  '6th Grade', '7th Grade', '8th Grade',
  '9th Grade', '10th Grade', '11th Grade', '12th Grade',
  'Trade/Vocational', 'College',
];

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS',
  'KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY',
  'NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT','VA','WA','WV','WI','WY',
];

interface TierDraft {
  id: string;
  title: string;
  amount: string;
  description: string;
  perks: string;
  limit: string;
  eta: string;
  claimed: number;
}

function tierToDraft(t: PledgeTier): TierDraft {
  return {
    id: t.id,
    title: t.title,
    amount: t.amount.toString(),
    description: t.description,
    perks: t.perks.join('\n'),
    limit: t.limit?.toString() ?? '',
    eta: t.eta,
    claimed: t.claimed,
  };
}

function ImageUploadZone({
  label, file, previewUrl, onFile, onUrl,
}: {
  label: string;
  file: File | null;
  previewUrl: string;
  onFile: (f: File) => void;
  onUrl: (u: string) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const preview = file ? URL.createObjectURL(file) : previewUrl;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>{label}</label>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) onFile(f); }}
        onClick={() => ref.current?.click()}
        className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${dragging ? 'border-[#1a2d5a] bg-[#e8eef5]' : 'border-gray-200 hover:border-[#1a2d5a]/40 hover:bg-gray-50'}`}
      >
        <input ref={ref} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) onFile(e.target.files[0]); }} />
        {file ? (
          <div className="flex items-center gap-2 text-sm text-gray-700 justify-center" style={{ fontFamily: 'Inter, sans-serif' }}>
            <ImageIcon size={14} className="text-[#1a2d5a]" /> {file.name} <span className="text-xs text-gray-400">— click to replace</span>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={18} className="text-gray-300" />
            <p className="text-sm text-[#c8202d]/70" style={{ fontFamily: 'Inter, sans-serif' }}>Click or drop to upload</p>
          </div>
        )}
      </div>
      {preview && (
        <div className="mt-3 rounded-xl overflow-hidden aspect-video border border-gray-200">
          <img src={preview} alt="Preview" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="mt-2">
        <input
          type="url"
          value={file ? '' : previewUrl}
          onChange={e => { onUrl(e.target.value); }}
          placeholder="Or paste an image URL"
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 bg-white"
          style={{ fontFamily: 'Inter, sans-serif' }}
        />
      </div>
    </div>
  );
}

export function EditCampaign() {
  const { campaignId } = useParams();
  const navigate = useNavigate();
  const { campaigns, updateCampaign, deleteCampaign } = useApp();
  const { currentUser, refreshCurrentUser } = useAuth();

  const campaign = campaigns.find(c => c.id === campaignId);

  // ── Campaign fields ───────────────────────────────────────────────────────
  const [title, setTitle] = useState(campaign?.title || '');
  const [tagline, setTagline] = useState(campaign?.tagline || '');
  const [story, setStory] = useState(campaign?.story || '');
  const [category, setCategory] = useState(campaign?.category || '');
  const [goal, setGoal] = useState(campaign?.goal.toString() || '');
  const [daysLeft, setDaysLeft] = useState(campaign?.daysLeft.toString() || '30');
  const [imageUrl, setImageUrl] = useState(campaign?.image || '');
  const [imageFile, setImageFile] = useState<File | null>(null);

  // ── Giving tiers ──────────────────────────────────────────────────────────
  const [tiers, setTiers] = useState<TierDraft[]>(
    campaign?.pledgeTiers.length ? campaign.pledgeTiers.map(tierToDraft)
    : [{ id: 'new_0', title: '', amount: '', description: '', perks: '', limit: '', eta: '', claimed: 0 }]
  );
  const addTier = () => setTiers(prev => [...prev, { id: `new_${Date.now()}`, title: '', amount: '', description: '', perks: '', limit: '', eta: '', claimed: 0 }]);
  const removeTier = (i: number) => setTiers(prev => prev.filter((_, idx) => idx !== i));
  const updateTier = (i: number, field: keyof TierDraft, val: string) =>
    setTiers(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

  // ── Parent info ───────────────────────────────────────────────────────────
  const [parentFirst, setParentFirst] = useState(currentUser?.firstName || campaign?.creator.name.split(' ')[0] || '');
  const [parentLast, setParentLast] = useState(currentUser?.lastName || campaign?.creator.name.split(' ').slice(1).join(' ') || '');
  const [parentNickname, setParentNickname] = useState(currentUser?.nickname || '');
  const [parentEmail, setParentEmail] = useState(currentUser?.email || '');
  const [parentPhone, setParentPhone] = useState(currentUser?.phone || '');

  // ── Student ───────────────────────────────────────────────────────────────
  const [selectedStudentId, setSelectedStudentId] = useState(campaign?.studentId || '');
  const [showAddStudent, setShowAddStudent] = useState(false);
  const [newStudentFirst, setNewStudentFirst] = useState('');
  const [newStudentLast, setNewStudentLast] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('');
  const [newStudentDob, setNewStudentDob] = useState('');
  const [savingStudent, setSavingStudent] = useState(false);

  // ── School ────────────────────────────────────────────────────────────────
  const [schoolName, setSchoolName] = useState(campaign?.school?.name || campaign?.creator.name || '');
  const [schoolWebsite, setSchoolWebsite] = useState(campaign?.school?.website || '');
  const [schoolAddress, setSchoolAddress] = useState(campaign?.school?.address || '');
  const [schoolCity, setSchoolCity] = useState(campaign?.school?.city || '');
  const [schoolState, setSchoolState] = useState(campaign?.school?.state || 'AZ');
  const [schoolZip, setSchoolZip] = useState(campaign?.school?.zip || '');
  const [schoolLogoUrl, setSchoolLogoUrl] = useState(campaign?.school?.logo || '');
  const [schoolLogoFile, setSchoolLogoFile] = useState<File | null>(null);

  // ── UI state ──────────────────────────────────────────────────────────────
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#e8eef5] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Campaign not found.</p>
          <Link to="/dashboard" className="text-[#1a2d5a] hover:underline">Back to Dashboard</Link>
        </div>
      </div>
    );
  }

  // ── Upload helper ─────────────────────────────────────────────────────────
  async function uploadImage(file: File, bucket: string): Promise<string | null> {
    const ext = file.name.split('.').pop();
    const path = `${currentUser?.id || 'anon'}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(path, file);
    if (error) return null;
    return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }

  // ── Save ──────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!title.trim() || !tagline.trim() || !category || !goal) {
      toast.error('Please fill in all required fields');
      return;
    }
    setIsSaving(true);

    // Upload campaign image if a new file was chosen
    let finalImage = imageUrl || campaign.image;
    if (imageFile) {
      const uploaded = await uploadImage(imageFile, 'campaign-images');
      if (uploaded) finalImage = uploaded;
    }

    // Upload school logo if a new file was chosen
    let finalLogoUrl = schoolLogoUrl;
    if (schoolLogoFile) {
      const uploaded = await uploadImage(schoolLogoFile, 'school-logos');
      if (uploaded) finalLogoUrl = uploaded;
    }

    const schoolData = {
      name: schoolName.trim() || undefined,
      website: schoolWebsite.trim() || undefined,
      address: schoolAddress.trim() || undefined,
      city: schoolCity.trim() || undefined,
      state: schoolState || undefined,
      zip: schoolZip.trim() || undefined,
      logo: finalLogoUrl || undefined,
    };

    await updateCampaign(campaignId!, {
      title,
      tagline,
      story,
      category,
      goal: Number(goal),
      image: finalImage,
      daysLeft: Number(daysLeft),
      studentId: selectedStudentId || undefined,
      school: schoolData,
      pledgeTiers: tiers
        .filter(t => t.title.trim() && t.amount)
        .map(t => ({
          id: t.id,
          title: t.title,
          amount: Number(t.amount),
          description: t.description,
          perks: t.perks.split('\n').filter(Boolean),
          claimed: t.claimed,
          limit: t.limit ? Number(t.limit) : undefined,
          eta: t.eta || 'TBD',
        })),
      // Keep creator in sync with school/parent info
      creator: {
        ...campaign.creator,
        name: schoolName.trim() || `${parentFirst} ${parentLast}`,
        bio: schoolName.trim() ? `${schoolName} — ${schoolCity}, ${schoolState}` : campaign.creator.bio,
        location: schoolCity && schoolState ? `${schoolCity}, ${schoolState}` : campaign.creator.location,
      },
    });

    setIsSaving(false);
    toast.success('Campaign updated!');
    navigate(`/campaign/${campaignId}`);
  };

  // ── Add new student ───────────────────────────────────────────────────────
  const handleAddNewStudent = async () => {
    if (!newStudentFirst.trim() || !newStudentLast.trim() || !currentUser) return;
    setSavingStudent(true);
    const { data: inserted } = await supabase.from('students').insert({
      parent_id: currentUser.id,
      first_name: newStudentFirst.trim(),
      last_name: newStudentLast.trim(),
      grade_level: newStudentGrade || 'Unknown',
      date_of_birth: newStudentDob || null,
      parent_approved: true,
    }).select('id').single();
    if (inserted) {
      await refreshCurrentUser();
      setSelectedStudentId(inserted.id);
      setShowAddStudent(false);
      setNewStudentFirst(''); setNewStudentLast(''); setNewStudentGrade(''); setNewStudentDob('');
      toast.success('Student added!');
    }
    setSavingStudent(false);
  };

  // ── Delete ────────────────────────────────────────────────────────────────
  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteCampaign(campaignId!);
    setIsDeleting(false);
    toast.success('Campaign deleted');
    navigate('/dashboard');
  };

  const inp = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40 bg-white';
  const sectionHeader = (title: string, icon?: React.ReactNode) => (
    <div className="bg-gradient-to-r from-[#1a2d5a] to-[#2a3d6a] px-8 py-5 flex items-center gap-3">
      {icon && <span className="text-white/70">{icon}</span>}
      <h2 className="text-white text-lg font-semibold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>{title}</h2>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#e8eef5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-[#1a2d5a] text-xl font-bold flex-1" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
              Edit Campaign
            </h1>
            <span className="px-3 py-1 bg-[#edf2f8] text-[#1a2d5a] text-xs font-semibold rounded-full">
              {campaign.status}
            </span>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2d5a] text-white text-sm rounded-xl hover:bg-[#142248] disabled:opacity-50 transition-colors font-semibold"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {isSaving
                ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                : <><Save size={15} /> Save Changes</>
              }
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">

        {/* ── Campaign Stats ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Raised', value: `$${campaign.raised.toLocaleString()}`, sub: `${Math.round(campaign.raised / campaign.goal * 100)}% of goal` },
            { label: 'Backers', value: campaign.backers.toString(), sub: 'supporters' },
            { label: 'Created', value: new Date(campaign.createdAt).toLocaleDateString(), sub: 'launch date' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <p className="text-xs text-gray-500 font-semibold mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{s.label}</p>
              <p className="text-xl font-bold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>{s.value}</p>
              <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{s.sub}</p>
            </div>
          ))}
        </div>

        {/* ── Campaign Information ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {sectionHeader('Campaign Information')}
          <div className="p-8 space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Campaign Title *</label>
              <input value={title} onChange={e => setTitle(e.target.value)} maxLength={100} className={inp} />
              <div className="text-right text-xs text-gray-400 mt-1">{title.length}/100</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Tagline *</label>
              <input value={tagline} onChange={e => setTagline(e.target.value)} maxLength={140} className={inp} />
              <p className="text-xs text-gray-400 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>One sentence summary</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>School Type *</label>
                <select value={category} onChange={e => setCategory(e.target.value)} className={inp + ' bg-white'}>
                  <option value="">Select type</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Goal ($) *</label>
                <input type="number" value={goal} onChange={e => setGoal(e.target.value)} min={100} className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Days Remaining</label>
                <input type="number" value={daysLeft} onChange={e => setDaysLeft(e.target.value)} min={1} className={inp} />
              </div>
            </div>

            <ImageUploadZone
              label="Campaign Featured Image"
              file={imageFile}
              previewUrl={imageUrl}
              onFile={f => { setImageFile(f); setImageUrl(''); }}
              onUrl={u => { setImageUrl(u); setImageFile(null); }}
            />

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Campaign Story</label>
              <div className="flex items-start gap-2 p-3 bg-[#edf2f8] rounded-xl mb-3 border border-[#1a2d5a]/10">
                <AlertCircle size={13} className="text-[#1a2d5a] mt-0.5 shrink-0" />
                <p className="text-xs text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Use <strong>**bold**</strong> for section headings. Suggested: <em>Who We Are, The Need, Your Impact, Tax Credit Info.</em>
                </p>
              </div>
              <textarea value={story} onChange={e => setStory(e.target.value)} rows={12} className={inp + ' font-mono resize-none'} />
              <div className="text-right text-xs text-gray-400 mt-1">{story.length} characters</div>
            </div>
          </div>
        </div>

        {/* ── Giving Tiers ────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {sectionHeader('Giving Levels')}
          <div className="p-8 space-y-5">
            {tiers.map((tier, i) => (
              <div key={tier.id} className="border border-gray-100 rounded-xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>Giving Level {i + 1}</h3>
                  {tiers.length > 1 && (
                    <button type="button" onClick={() => removeTier(i)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Level Name *</label>
                    <input value={tier.title} onChange={e => updateTier(i, 'title', e.target.value)} placeholder="Friend of the School" className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Amount ($) *</label>
                    <input type="number" value={tier.amount} onChange={e => updateTier(i, 'amount', e.target.value)} placeholder="500" min={1} className={inp} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>What This Accomplishes</label>
                  <input value={tier.description} onChange={e => updateTier(i, 'description', e.target.value)} placeholder="Fund one student's full semester of tuition" className={inp} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Donor Benefits (one per line)</label>
                  <textarea value={tier.perks} onChange={e => updateTier(i, 'perks', e.target.value)} rows={3}
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Donor Limit (optional)</label>
                    <input type="number" value={tier.limit} onChange={e => updateTier(i, 'limit', e.target.value)} placeholder="Unlimited" min={1} className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Scholarship Start Date</label>
                    <input value={tier.eta} onChange={e => updateTier(i, 'eta', e.target.value)} placeholder="Aug 2026" className={inp} />
                  </div>
                </div>
              </div>
            ))}
            <button type="button" onClick={addTier}
              className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-gray-300 hover:border-[#1a2d5a]/50 rounded-2xl text-sm text-gray-500 hover:text-[#1a2d5a] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <Plus size={16} /> Add Giving Level
            </button>
          </div>
        </div>

        {/* ── Parent Info ──────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {sectionHeader('Parent / Guardian Info')}
          <div className="p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>First Name</label>
                <input value={parentFirst} onChange={e => setParentFirst(e.target.value)} placeholder="Sarah" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Last Name</label>
                <input value={parentLast} onChange={e => setParentLast(e.target.value)} placeholder="Mitchell" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Nickname</label>
                <input value={parentNickname} onChange={e => setParentNickname(e.target.value)} placeholder="Optional" className={inp} />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Email Address</label>
                <input type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} placeholder="sarah@example.com" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Phone Number</label>
                <input type="tel" value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="(602) 555-0100" className={inp} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Student ──────────────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-[#1a2d5a] to-[#2a3d6a] px-8 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap size={18} className="text-white/70" />
              <h2 className="text-white text-lg font-semibold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>Student</h2>
            </div>
            {selectedStudentId && (
              <span className="px-2.5 py-1 bg-emerald-500 text-white text-xs font-semibold rounded-full">Linked</span>
            )}
          </div>
          <div className="p-8 space-y-5">
            {/* Existing students */}
            {currentUser?.students && currentUser.students.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Select a student from your account
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentUser.students.map(s => {
                    const active = selectedStudentId === s.id;
                    return (
                      <button key={s.id} type="button"
                        onClick={() => setSelectedStudentId(active ? '' : s.id)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${active ? 'border-[#1a2d5a] bg-[#edf2f8]' : 'border-gray-200 hover:border-[#1a2d5a]/40 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1a2d5a] flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {s.firstName[0]}{s.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>{s.firstName} {s.lastName}</p>
                            <p className="text-xs text-gray-500">{s.gradeLevel}</p>
                          </div>
                          {active && <Check size={16} className="ml-auto text-[#1a2d5a]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add student toggle */}
            <button type="button" onClick={() => setShowAddStudent(v => !v)}
              className="flex items-center gap-2 text-sm text-[#1a2d5a] font-semibold hover:text-[#c8202d] transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              <UserPlus size={15} />
              {showAddStudent ? 'Cancel' : (currentUser?.students?.length ? 'Add a different student' : 'Add a student')}
            </button>

            {showAddStudent && (
              <div className="border border-gray-200 rounded-xl p-5 space-y-4 bg-gray-50">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>First Name *</label>
                    <input value={newStudentFirst} onChange={e => setNewStudentFirst(e.target.value)} placeholder="Jace" className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Last Name *</label>
                    <input value={newStudentLast} onChange={e => setNewStudentLast(e.target.value)} placeholder="Smith" className={inp} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Grade Level</label>
                    <select value={newStudentGrade} onChange={e => setNewStudentGrade(e.target.value)} className={inp + ' bg-white'}>
                      <option value="">Select grade</option>
                      {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Date of Birth</label>
                    <input type="date" value={newStudentDob} onChange={e => setNewStudentDob(e.target.value)} max={new Date().toISOString().split('T')[0]} className={inp} />
                  </div>
                </div>
                <button type="button" onClick={handleAddNewStudent}
                  disabled={savingStudent || !newStudentFirst.trim() || !newStudentLast.trim()}
                  className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2d5a] text-white text-sm rounded-xl hover:bg-[#142248] disabled:opacity-50 transition-colors font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  {savingStudent
                    ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
                    : <><Plus size={14} /> Save Student</>
                  }
                </button>
              </div>
            )}

            {!currentUser?.students?.length && !showAddStudent && (
              <p className="text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
                No students linked to your account yet.
              </p>
            )}
          </div>
        </div>

        {/* ── School Details ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
          {sectionHeader('School Details', <School size={18} />)}
          <div className="p-8 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>School Name</label>
                <input value={schoolName} onChange={e => setSchoolName(e.target.value)} placeholder="Grace Christian Academy" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>School Website</label>
                <input type="url" value={schoolWebsite} onChange={e => setSchoolWebsite(e.target.value)} placeholder="https://gracechristian.edu" className={inp} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Street Address</label>
              <input value={schoolAddress} onChange={e => setSchoolAddress(e.target.value)} placeholder="1234 E. Faith Boulevard" className={inp} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="sm:col-span-1">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>City</label>
                <input value={schoolCity} onChange={e => setSchoolCity(e.target.value)} placeholder="Phoenix" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>State</label>
                <select value={schoolState} onChange={e => setSchoolState(e.target.value)} className={inp + ' bg-white'}>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Zip Code</label>
                <input value={schoolZip} onChange={e => setSchoolZip(e.target.value)} placeholder="85001" maxLength={10} className={inp} />
              </div>
            </div>

            <ImageUploadZone
              label="School Logo"
              file={schoolLogoFile}
              previewUrl={schoolLogoUrl}
              onFile={f => { setSchoolLogoFile(f); setSchoolLogoUrl(''); }}
              onUrl={u => { setSchoolLogoUrl(u); setSchoolLogoFile(null); }}
            />
          </div>
        </div>

        {/* ── Save Button ──────────────────────────────────────────────────── */}
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="w-full flex items-center justify-center gap-2 py-4 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-50 text-white rounded-2xl font-semibold transition-colors"
          style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem' }}
        >
          {isSaving
            ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving…</>
            : <><Save size={18} /> Save All Changes</>
          }
        </button>

        {/* ── Danger Zone ──────────────────────────────────────────────────── */}
        <div className="bg-red-50 border-2 border-red-200 rounded-2xl overflow-hidden">
          <div className="bg-red-100 px-8 py-5 flex items-center gap-3">
            <AlertCircle size={18} className="text-red-600" />
            <h2 className="text-red-900 font-semibold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>Danger Zone</h2>
          </div>
          <div className="p-8">
            {!showDeleteConfirm ? (
              <>
                <p className="text-sm text-gray-600 mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Deleting this campaign is permanent and cannot be undone.
                </p>
                <button onClick={() => setShowDeleteConfirm(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors font-semibold"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Trash2 size={16} /> Delete Campaign
                </button>
              </>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-gray-700 font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Are you sure you want to delete "{campaign.title}"? This cannot be undone.
                </p>
                <div className="flex gap-3">
                  <button onClick={handleDelete} disabled={isDeleting}
                    className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl hover:bg-red-700 disabled:opacity-50 transition-colors font-semibold"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {isDeleting ? 'Deleting...' : 'Confirm Delete'}
                  </button>
                  <button onClick={() => setShowDeleteConfirm(false)}
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
  );
}
