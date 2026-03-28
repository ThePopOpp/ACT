import { useState, useRef } from 'react';
import { useNavigate, Link } from 'react-router';
import {
  Check, Plus, Trash2, Upload, AlertCircle, BookOpen,
  ChevronLeft, ChevronRight, ImageIcon,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../../lib/supabase';
import { Campaign, CATEGORIES } from '../data/mockData';
import { toast } from 'sonner';

const STEPS = [
  { label: 'Campaign', key: 'campaign' },
  { label: 'Parent Info', key: 'parent' },
  { label: 'Student', key: 'student' },
  { label: 'School', key: 'school' },
];

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

interface GivingTier {
  title: string; amount: string; description: string;
  perks: string; limit: string; eta: string;
}
const EMPTY_TIER: GivingTier = { title: '', amount: '', description: '', perks: '', limit: '', eta: '' };

function FileDropZone({
  label, name, accept = 'image/*', multiple = false,
  files, onChange,
}: {
  label: string; name: string; accept?: string; multiple?: boolean;
  files: File[]; onChange: (files: File[]) => void;
}) {
  const ref = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const dropped = Array.from(e.dataTransfer.files);
    onChange(multiple ? [...files, ...dropped] : [dropped[0]]);
  };
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const picked = Array.from(e.target.files);
    onChange(multiple ? [...files, ...picked] : [picked[0]]);
  };

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>
        {label}
      </label>
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => ref.current?.click()}
        className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
          dragging ? 'border-[#1a2d5a] bg-[#e8eef5]' : 'border-gray-200 hover:border-[#1a2d5a]/40 hover:bg-gray-50'
        }`}
      >
        <input ref={ref} type="file" accept={accept} multiple={multiple} className="hidden" onChange={handleChange} />
        {files.length > 0 ? (
          <div className="space-y-1.5">
            {files.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-sm text-gray-700 justify-center" style={{ fontFamily: 'Inter, sans-serif' }}>
                <ImageIcon size={14} className="text-[#1a2d5a]" /> {f.name}
              </div>
            ))}
            <p className="text-xs text-gray-400 mt-2" style={{ fontFamily: 'Inter, sans-serif' }}>Click to replace</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={18} className="text-gray-300" />
            <p className="text-sm text-[#c8202d]/70" style={{ fontFamily: 'Inter, sans-serif' }}>Click or drop files to upload.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export function CreateCampaign() {
  const { addCampaign } = useApp();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [launching, setLaunching] = useState(false);
  const [launched, setLaunched] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // ── Step 1: Campaign ─────────────────────────────────────────────────
  const [title, setTitle] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState('');
  const [goal, setGoal] = useState('');
  const [duration, setDuration] = useState('30');
  const [customDuration, setCustomDuration] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [story, setStory] = useState('');
  const [tiers, setTiers] = useState<GivingTier[]>([{ ...EMPTY_TIER }]);

  // ── Step 2: Parent Info ───────────────────────────────────────────────
  const [parentFirstName, setParentFirstName] = useState(currentUser?.accountType === 'parent' ? currentUser.firstName : '');
  const [parentLastName, setParentLastName] = useState(currentUser?.accountType === 'parent' ? currentUser.lastName : '');
  const [parentNickname, setParentNickname] = useState(currentUser?.nickname || '');
  const [parentEmail, setParentEmail] = useState(currentUser?.email || '');
  const [parentPhone, setParentPhone] = useState(currentUser?.phone || '');
  const [parentPhoto, setParentPhoto] = useState<File[]>([]);

  // ── Step 3: Student ──────────────────────────────────────────────────
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [studentFirstName, setStudentFirstName] = useState('');
  const [studentLastName, setStudentLastName] = useState('');
  const [studentNickname, setStudentNickname] = useState('');
  const [gradeLevel, setGradeLevel] = useState('');
  const [studentPhoto, setStudentPhoto] = useState<File[]>([]);

  // ── Step 4: School ───────────────────────────────────────────────────
  const [schoolName, setSchoolName] = useState('');
  const [schoolWebsite, setSchoolWebsite] = useState('');
  const [schoolAddress, setSchoolAddress] = useState('');
  const [schoolCity, setSchoolCity] = useState('');
  const [schoolState, setSchoolState] = useState('AZ');
  const [schoolZip, setSchoolZip] = useState('');
  const [schoolLogo, setSchoolLogo] = useState<File[]>([]);
  const [schoolGallery, setSchoolGallery] = useState<File[]>([]);

  // Tiers helpers
  const addTier = () => setTiers(prev => [...prev, { ...EMPTY_TIER }]);
  const removeTier = (i: number) => setTiers(prev => prev.filter((_, idx) => idx !== i));
  const updateTier = (i: number, field: keyof GivingTier, val: string) =>
    setTiers(prev => prev.map((t, idx) => idx === i ? { ...t, [field]: val } : t));

  const canProceed = () => {
    if (step === 0) {
      const durationValue = duration === 'custom' ? Number(customDuration) : Number(duration);
      return title.trim() && tagline.trim() && category && goal && Number(goal) > 0 && story.trim().length > 20 && durationValue > 0;
    }
    if (step === 1) return parentFirstName.trim() && parentLastName.trim() && parentEmail.trim();
    if (step === 2) return studentFirstName.trim() && studentLastName.trim();
    if (step === 3) return schoolName.trim() && schoolAddress.trim() && schoolCity.trim() && schoolState && termsAgreed;
    return true;
  };

  const handlePublish = async () => {
    if (!termsAgreed) { toast.error('Please agree to the Terms of Service.'); return; }
    setLaunching(true);

    // ── Resolve student_id ────────────────────────────────────────────────────
    let finalStudentId: string | undefined;
    if (currentUser?.accountType === 'parent') {
      if (selectedStudentId) {
        // Parent selected an existing student from their account
        finalStudentId = selectedStudentId;
      } else if (studentFirstName.trim() && studentLastName.trim()) {
        // Parent manually entered a new student — save to students table first
        const { data: inserted } = await supabase.from('students').insert({
          parent_id: currentUser.id,
          first_name: studentFirstName.trim(),
          last_name: studentLastName.trim(),
          nickname: studentNickname.trim() || null,
          grade_level: gradeLevel || 'Unknown',
          parent_approved: true,
        }).select('id').single();
        if (inserted) finalStudentId = inserted.id;
      }
    }

    // Upload campaign image if a file was selected
    let finalImageUrl = 'https://images.unsplash.com/photo-1769201153045-98827f62996b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1080';
    if (imageFiles.length > 0) {
      const file = imageFiles[0];
      const ext = file.name.split('.').pop();
      const path = `${currentUser?.id || 'anon'}/${Date.now()}.${ext}`;
      const { error: uploadErr } = await supabase.storage.from('campaign-images').upload(path, file);
      if (!uploadErr) {
        const { data } = supabase.storage.from('campaign-images').getPublicUrl(path);
        finalImageUrl = data.publicUrl;
      }
    }

    const newCampaign: Campaign = {
      id: `new_${Date.now()}`,
      title,
      tagline,
      story,
      category,
      goal: Number(goal),
      raised: 0,
      backers: 0,
      daysLeft: duration === 'custom' ? Number(customDuration) : Number(duration),
      image: finalImageUrl,
      tags: [category, 'Tax Credit', gradeLevel].filter(Boolean),
      featured: false,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
      creator: {
        id: currentUser?.id || '',
        name: schoolName || `${parentFirstName} ${parentLastName}`,
        avatar: currentUser?.avatar || '',
        bio: `${schoolName} — ${schoolCity}, ${schoolState}`,
        campaignsCreated: 1,
        location: `${schoolCity}, ${schoolState}`,
      },
      pledgeTiers: tiers
        .filter(t => t.title && t.amount)
        .map((t, i) => ({
          id: `new_t${i}`,
          title: t.title,
          amount: Number(t.amount),
          description: t.description,
          perks: t.perks.split('\n').filter(Boolean),
          claimed: 0,
          limit: t.limit ? Number(t.limit) : undefined,
          eta: t.eta || 'TBD',
        })),
      updates: [],
      faqs: [],
      studentId: finalStudentId,
    };
    addCampaign(newCampaign);
    setLaunching(false);
    setLaunched(true);
    toast.success('🎉 Your campaign is now live!');
    setTimeout(() => navigate(`/campaign/${newCampaign.id}`), 2000);
  };

  if (launched) {
    return (
      <div className="min-h-screen bg-[#e8eef5] flex items-center justify-center">
        <div className="text-center p-12">
          <div className="w-24 h-24 bg-[#edf2f8] rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-[#1a2d5a]/20">
            <BookOpen size={44} className="text-[#1a2d5a]" />
          </div>
          <h2 className="text-[#1a2d5a] mb-2" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.8rem' }}>
            Your Campaign is Live! 🎉
          </h2>
          <p className="text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>Redirecting to your campaign page…</p>
        </div>
      </div>
    );
  }

  const inp = 'w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40 bg-white';

  return (
    <div className="min-h-screen bg-[#e8eef5]">
      {/* Header */}
      <div className="bg-[#e8eef5] border-b border-[#d3def1]">
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-0">
          <h1
            className="text-center text-[#c8202d] mb-8"
            style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 900, fontSize: 'clamp(1.5rem, 3vw, 2.2rem)' }}
          >
            Start Your Campaign
          </h1>

          {/* Step indicator — matches screenshot style */}
          <div className="mx-auto max-w-md">
            <div className="flex justify-center gap-6">
            {STEPS.map((s, i) => {
              const done = i < step;
              const active = i === step;
              return (
                <div key={s.key} className="flex flex-col items-center text-center" style={{ minWidth: 90 }}>
                  <div className="flex items-center">
                    {i > 0 && (
                      <div className={`h-0.5 w-8 ${i - 1 < step ? 'bg-[#1a2d5a]' : 'bg-gray-200'}`} />
                    )}
                    <button
                      onClick={() => done && setStep(i)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-2 transition-all ${
                        done ? 'bg-[#1a2d5a] border-[#1a2d5a] text-white cursor-pointer' :
                        active ? 'bg-[#1a2d5a] border-[#1a2d5a] text-white' :
                        'bg-white border-gray-300 text-gray-400 cursor-default'
                      }`}
                    >
                      {done ? <Check size={16} /> : i + 1}
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className={`h-0.5 w-8 ${i < step ? 'bg-[#1a2d5a]' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  <span
                    className={`text-xs font-medium mt-2 ${active ? 'text-[#1a2d5a]' : done ? 'text-[#1a2d5a]' : 'text-gray-400'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {s.label}
                  </span>
                </div>
              );
            })}
          </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {/* ═══════════════════════════════════════════════════════════════
            STEP 1 — CAMPAIGN
        ═══════════════════════════════════════════════════════════════ */}
        {step === 0 && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Campaign Title *</label>
                <input type="text" placeholder="e.g., Grace Christian Academy — Annual Scholarship Fund"
                  value={title} onChange={e => setTitle(e.target.value)} maxLength={100} className={inp} />
                <div className="text-right text-xs text-gray-400 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>{title.length}/100</div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Campaign Tagline *</label>
                <input type="text" placeholder="One sentence describing who this helps and how"
                  value={tagline} onChange={e => setTagline(e.target.value)} maxLength={140} className={inp} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>School Type *</label>
                  <select value={category} onChange={e => setCategory(e.target.value)} className={inp + ' bg-white'}>
                    <option value="">Select type</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Scholarship Goal ($) *</label>
                  <input type="number" placeholder="50000"
                    value={goal} onChange={e => setGoal(e.target.value)} min={100} className={inp} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Campaign Duration</label>
                <div className="flex gap-2">
                  {['15', '30', '45', '60'].map(d => (
                    <button key={d} type="button" onClick={() => { setDuration(d); setCustomDuration(''); }}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${duration === d ? 'border-[#1a2d5a] bg-[#edf2f8] text-[#1a2d5a]' : 'border-gray-100 text-gray-600 hover:border-[#1a2d5a]/30'}`}
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      {d} days
                    </button>
                  ))}
                  <button type="button" onClick={() => setDuration('custom')}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-semibold border-2 transition-colors ${duration === 'custom' ? 'border-[#1a2d5a] bg-[#edf2f8] text-[#1a2d5a]' : 'border-gray-100 text-gray-600 hover:border-[#1a2d5a]/30'}`}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    Custom
                  </button>
                </div>
                {duration === 'custom' && (
                  <div className="mt-3">
                    <input
                      type="number"
                      min={1}
                      placeholder="Enter days (e.g. 75)"
                      value={customDuration}
                      onChange={e => {
                        const val = e.target.value;
                        if (/^\d*$/.test(val)) {
                          setCustomDuration(val);
                          if (val) setDuration(val);
                        }
                      }}
                      className={`${inp} max-w-xs`}
                    />
                    <p className="text-xs text-gray-500 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Enter custom duration in days.
                    </p>
                  </div>
                )}
              </div>

              <div>
                <FileDropZone
                  label="Campaign Featured Image"
                  name="campaignImage"
                  files={imageFiles}
                  onChange={files => {
                    setImageFiles(files);
                    if (files[0]) setImageUrl(URL.createObjectURL(files[0]));
                  }}
                />
                {imageUrl && (
                  <div className="mt-3 rounded-xl overflow-hidden aspect-video border border-gray-200">
                    <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>

            {/* Campaign story */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <label className="block text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>Campaign Story *</label>
              <div className="flex items-start gap-2 p-3 bg-[#edf2f8] rounded-xl mb-4 border border-[#1a2d5a]/10">
                <AlertCircle size={14} className="text-[#1a2d5a] mt-0.5 shrink-0" />
                <p className="text-xs text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Use <strong>**bold text**</strong> for section headings. Suggested: <em>Who We Are, The Need, Your Impact, Tax Credit Info.</em>
                </p>
              </div>
              <textarea
                placeholder={`**Who We Are**\nDescribe your school and its Christian mission...\n\n**The Need**\nWho are the students you're trying to serve?\n\n**Your Impact**\nHow will donations be used?\n\n**Arizona Tax Credit**\nRemind donors this qualifies for Arizona's Private School Tax Credit.`}
                value={story} onChange={e => setStory(e.target.value)} rows={14}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40 resize-none font-mono"
              />
              <div className="flex justify-between text-xs text-gray-400 mt-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                <span>{story.length} characters</span>
                <span className={story.trim().length < 20 ? 'text-amber-500' : 'text-emerald-500'}>
                  {story.trim().length < 20 ? `${20 - story.trim().length} more needed` : '✓ Good length'}
                </span>
              </div>
            </div>

            {/* Giving levels */}
            <div className="space-y-4">
              <div>
                <h2 className="text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700, fontSize: '1.2rem' }}>Giving Levels</h2>
                <p className="text-gray-500 text-sm mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>Create meaningful giving options for donors.</p>
              </div>
              {tiers.map((tier, i) => (
                <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[#1a2d5a] text-sm" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>Giving Level {i + 1}</h3>
                    {tiers.length > 1 && (
                      <button type="button" onClick={() => removeTier(i)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Level Name *</label>
                      <input type="text" placeholder="Friend of the School" value={tier.title} onChange={e => updateTier(i, 'title', e.target.value)} className={inp} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Donation Amount ($) *</label>
                      <input type="number" placeholder="500" value={tier.amount} onChange={e => updateTier(i, 'amount', e.target.value)} min={1} className={inp} />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>What This Accomplishes *</label>
                    <input type="text" placeholder="Fund one student's full semester of tuition" value={tier.description} onChange={e => updateTier(i, 'description', e.target.value)} className={inp} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Donor Benefits (one per line)</label>
                    <textarea placeholder={"Tax credit receipt\nNamed on Donor Wall\nAnnual impact report"} value={tier.perks} onChange={e => updateTier(i, 'perks', e.target.value)} rows={3}
                      className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 focus:border-[#1a2d5a]/40 resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Donor Limit (optional)</label>
                      <input type="number" placeholder="Unlimited" value={tier.limit} onChange={e => updateTier(i, 'limit', e.target.value)} min={1} className={inp} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Scholarship Start Date</label>
                      <input type="text" placeholder="Aug 2026" value={tier.eta} onChange={e => updateTier(i, 'eta', e.target.value)} className={inp} />
                    </div>
                  </div>
                </div>
              ))}
              <button type="button" onClick={addTier}
                className="w-full flex items-center justify-center gap-2 py-3.5 border-2 border-dashed border-gray-300 hover:border-[#1a2d5a]/50 rounded-2xl text-sm text-gray-500 hover:text-[#1a2d5a] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                <Plus size={16} /> Add Another Giving Level
              </button>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 2 — PARENT INFO
        ═══════════════════════════════════════════════════════════════ */}
        {step === 1 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Parent First Name</label>
                <input value={parentFirstName} onChange={e => setParentFirstName(e.target.value)} placeholder="Sarah" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Parent Last Name</label>
                <input value={parentLastName} onChange={e => setParentLastName(e.target.value)} placeholder="Mitchell" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Parent Nickname</label>
                <input value={parentNickname} onChange={e => setParentNickname(e.target.value)} placeholder="Optional" className={inp} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Parent Email Address</label>
                <input type="email" value={parentEmail} onChange={e => setParentEmail(e.target.value)} placeholder="sarah@example.com" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Parent Phone Number</label>
                <input type="tel" value={parentPhone} onChange={e => setParentPhone(e.target.value)} placeholder="(602) 555-0100" className={inp} />
              </div>
            </div>

            <FileDropZone
              label="Parent Profile Photo"
              name="parentPhoto"
              files={parentPhoto}
              onChange={setParentPhoto}
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 3 — STUDENT
        ═══════════════════════════════════════════════════════════════ */}
        {step === 2 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">

            {/* Select from existing students if parent has any */}
            {currentUser?.students && currentUser.students.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>
                  Select a student from your profile
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                  {currentUser.students.map(s => {
                    const selected = selectedStudentId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setSelectedStudentId(s.id);
                          setStudentFirstName(s.firstName);
                          setStudentLastName(s.lastName);
                          setStudentNickname(s.nickname || '');
                          setGradeLevel(s.gradeLevel);
                        }}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${selected ? 'border-[#1a2d5a] bg-[#edf2f8]' : 'border-gray-200 hover:border-[#1a2d5a]/40 hover:bg-gray-50'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#1a2d5a] flex items-center justify-center text-white text-sm font-bold shrink-0">
                            {s.firstName[0]}{s.lastName[0]}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                              {s.firstName} {s.lastName}
                            </p>
                            <p className="text-xs text-gray-500">{s.gradeLevel}</p>
                          </div>
                          {selected && <Check size={16} className="ml-auto text-[#1a2d5a]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
                  <div className="relative flex justify-center text-xs"><span className="bg-white px-3 text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>or enter manually</span></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Student First Name</label>
                <input value={studentFirstName} onChange={e => { setStudentFirstName(e.target.value); setSelectedStudentId(''); }} placeholder="Emma" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Student Last Name</label>
                <input value={studentLastName} onChange={e => { setStudentLastName(e.target.value); setSelectedStudentId(''); }} placeholder="Mitchell" className={inp} />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Student Nickname</label>
                <input value={studentNickname} onChange={e => setStudentNickname(e.target.value)} placeholder="Optional" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Grade Level</label>
                <select value={gradeLevel} onChange={e => setGradeLevel(e.target.value)} className={inp + ' bg-white'}>
                  <option value="">Select grade</option>
                  {GRADE_LEVELS.map(g => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>

            <FileDropZone
              label="Student Profile Photo (optional)"
              name="studentPhoto"
              files={studentPhoto}
              onChange={setStudentPhoto}
            />
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════════════
            STEP 4 — SCHOOL
        ═══════════════════════════════════════════════════════════════ */}
        {step === 3 && (
          <div className="bg-white rounded-2xl border border-gray-200 p-8 space-y-6">
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
              <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>School Address</label>
              <input value={schoolAddress} onChange={e => setSchoolAddress(e.target.value)} placeholder="1234 E. Faith Boulevard" className={inp} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>City</label>
                <input value={schoolCity} onChange={e => setSchoolCity(e.target.value)} placeholder="Phoenix" className={inp} />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>State</label>
                <select value={schoolState} onChange={e => setSchoolState(e.target.value)} className={inp + ' bg-white'}>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Zip Code</label>
                <input value={schoolZip} onChange={e => setSchoolZip(e.target.value)} placeholder="85001" maxLength={10} className={inp} style={{ maxWidth: 240 }} />
              </div>
            </div>

            <FileDropZone
              label="School Logo"
              name="schoolLogo"
              files={schoolLogo}
              onChange={setSchoolLogo}
            />

            <FileDropZone
              label="School Photo Gallery"
              name="schoolGallery"
              accept="image/*"
              multiple={true}
              files={schoolGallery}
              onChange={setSchoolGallery}
            />

            {/* Terms of service */}
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3" style={{ fontFamily: 'Inter, sans-serif' }}>ACT Campaign Terms of Service</p>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox" checked={termsAgreed}
                  onChange={e => setTermsAgreed(e.target.checked)}
                  className="mt-0.5 w-4 h-4 accent-[#1a2d5a]"
                />
                <span className="text-sm text-gray-600" style={{ fontFamily: 'Inter, sans-serif' }}>
                  I agree to the{' '}
                  <Link to="#" className="text-[#c8202d] hover:underline">Arizona Christian Tuition Terms of Service</Link>.
                </span>
              </label>
            </div>

            {/* Submit button */}
            <button
              type="button"
              onClick={handlePublish}
              disabled={launching || !canProceed()}
              className="w-full flex items-center justify-center gap-2 py-4 bg-[#1a2d5a] hover:bg-[#142248] disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold text-sm transition-colors"
              style={{ fontFamily: 'Inter, sans-serif', fontSize: '1rem' }}
            >
              {launching ? (
                <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing…</>
              ) : (
                'Submit My Campaign'
              )}
            </button>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <button
            type="button"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-7 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 text-sm rounded-lg font-medium transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            <ChevronLeft size={15} /> Previous
          </button>

          {step < STEPS.length - 1 && (
            <button
              type="button"
              onClick={() => setStep(s => s + 1)}
              disabled={!canProceed()}
              className="flex items-center gap-1.5 px-7 py-3 bg-gray-200 hover:bg-gray-300 disabled:opacity-40 disabled:cursor-not-allowed text-gray-700 text-sm rounded-lg font-medium transition-colors"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Next <ChevronRight size={15} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
