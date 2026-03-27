import { useState, useRef } from 'react';
import {
  Plus, Trash2, Edit2, Check, X, Upload, ChevronDown, ChevronUp,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from '../components/UserAvatar';
import { supabase } from '../../lib/supabase';
import { toast } from 'sonner';

interface EditForm {
  firstName: string;
  lastName: string;
  nickname?: string;
  email: string;
  phone?: string;
  bio?: string;
  location?: string;
  schoolName?: string;
  businessName?: string;
  businessTitle?: string;
}

interface ChildFormData {
  firstName: string;
  lastName: string;
  gradeLevel: string;
  dateOfBirth: string;
  schoolName?: string;
}

export function ProfileManagement() {
  const { currentUser, updateUserProfile, updateStudent, deleteStudent, addStudentToParent } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showAddChild, setShowAddChild] = useState(false);
  const [expandedChildId, setExpandedChildId] = useState<string | null>(null);
  const [editingChildId, setEditingChildId] = useState<string | null>(null);

  const [formData, setFormData] = useState<EditForm>(
    currentUser ? {
      firstName: currentUser.firstName,
      lastName: currentUser.lastName,
      nickname: currentUser.nickname || '',
      email: currentUser.email,
      phone: currentUser.phone || '',
      bio: currentUser.bio || '',
      location: currentUser.location || '',
      schoolName: currentUser.schoolName || '',
      businessName: currentUser.businessName || '',
      businessTitle: currentUser.businessTitle || '',
    } : {
      firstName: '',
      lastName: '',
      nickname: '',
      email: '',
      phone: '',
      bio: '',
      location: '',
      schoolName: '',
      businessName: '',
      businessTitle: '',
    }
  );

  const [childForm, setChildForm] = useState<ChildFormData>({
    firstName: '',
    lastName: '',
    gradeLevel: '',
    dateOfBirth: '',
    schoolName: '',
  });

  const [editingChild, setEditingChild] = useState<ChildFormData | null>(null);

  const GRADE_LEVELS = [
    'Pre-K', 'Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade',
    '5th Grade', '6th Grade', '7th Grade', '8th Grade', '9th Grade', '10th Grade',
    '11th Grade', '12th Grade', 'Trade/Vocational', 'College'
  ];

  const handlePhotoUpload = async (file: File) => {
    if (!currentUser) return;
    setUploadingPhoto(true);
    try {
      const ext = file.name.split('.').pop();
      const path = `${currentUser.id}/avatar.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, file, { upsert: true });
      if (uploadError) throw uploadError;
      const { data } = supabase.storage.from('avatars').getPublicUrl(path);
      // Bust cache by appending timestamp
      const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;
      await updateUserProfile(currentUser.id, { avatar: avatarUrl });
      toast.success('Photo updated!');
    } catch (err) {
      toast.error('Failed to upload photo. Please try again.');
      console.error(err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleProfileSave = async () => {
    if (!currentUser) return;

    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in all required fields');
      return;
    }

    await updateUserProfile(currentUser.id, {
      firstName: formData.firstName,
      lastName: formData.lastName,
      nickname: formData.nickname || undefined,
      email: formData.email,
      phone: formData.phone || undefined,
      bio: formData.bio || undefined,
      location: formData.location || undefined,
      schoolName: formData.schoolName || undefined,
      businessName: formData.businessName || undefined,
      businessTitle: formData.businessTitle || undefined,
    });

    toast.success('Profile updated successfully!');
    setIsEditing(false);
  };

  const handleAddChild = async () => {
    if (!currentUser || currentUser.accountType !== 'parent') return;

    if (!childForm.firstName || !childForm.lastName || !childForm.gradeLevel) {
      toast.error('Please fill in all required fields');
      return;
    }

    await addStudentToParent(currentUser.id, {
      firstName: childForm.firstName,
      lastName: childForm.lastName,
      gradeLevel: childForm.gradeLevel,
      dateOfBirth: childForm.dateOfBirth,
      nickname: undefined,
      email: undefined,
      avatar: `https://i.pravatar.cc/150?u=${childForm.firstName}${childForm.lastName}`,
    });

    toast.success('Child added successfully!');
    setChildForm({
      firstName: '',
      lastName: '',
      gradeLevel: '',
      dateOfBirth: '',
      schoolName: '',
    });
    setShowAddChild(false);
  };

  const handleUpdateChild = async (childId: string) => {
    if (!currentUser || !editingChild) return;

    if (!editingChild.firstName || !editingChild.lastName || !editingChild.gradeLevel) {
      toast.error('Please fill in all required fields');
      return;
    }

    await updateStudent(currentUser.id, childId, {
      firstName: editingChild.firstName,
      lastName: editingChild.lastName,
      gradeLevel: editingChild.gradeLevel,
      dateOfBirth: editingChild.dateOfBirth,
    });

    toast.success('Child profile updated!');
    setEditingChildId(null);
    setEditingChild(null);
  };

  const handleDeleteChild = async (childId: string) => {
    if (!currentUser) return;
    if (!confirm('Are you sure you want to remove this child from your profile?')) return;

    await deleteStudent(currentUser.id, childId);
    toast.success('Child removed successfully!');
  };

  const children = currentUser?.students || [];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Please log in to manage your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-6">
        <div className="space-y-8">
          {/* Profile Information Section */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-[#1a2d5a] text-lg font-semibold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                Profile Information
              </h2>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-[#1a2d5a] text-white rounded-lg hover:bg-[#142248] transition-colors text-sm font-medium"
                  style={{ fontFamily: 'Inter, sans-serif' }}
                >
                  <Edit2 size={16} /> Edit
                </button>
              )}
            </div>

            {isEditing ? (
              <form className="p-6 space-y-4">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4 pb-6 border-b border-gray-100">
                  <UserAvatar
                    firstName={currentUser.firstName}
                    lastName={currentUser.lastName}
                    avatarUrl={currentUser.avatar}
                    size={96}
                    className="border-4 border-[#e8eef5]"
                  />
                  <button
                    type="button"
                    disabled={uploadingPhoto}
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer text-sm font-medium disabled:opacity-50"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <Upload size={16} /> {uploadingPhoto ? 'Uploading…' : 'Change Photo'}
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handlePhotoUpload(file);
                      e.target.value = '';
                    }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Nickname
                  </label>
                  <input
                    type="text"
                    value={formData.nickname}
                    onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                    Bio
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    rows={3}
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                  {currentUser.accountType === 'parent' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        School Name
                      </label>
                      <input
                        type="text"
                        value={formData.schoolName}
                        onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>
                  )}
                  {currentUser.accountType === 'business_donor' && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                        Company Name
                      </label>
                      <input
                        type="text"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>
                  )}
                </div>

                {currentUser.accountType === 'business_donor' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Job Title
                    </label>
                    <input
                      type="text"
                      value={formData.businessTitle}
                      onChange={(e) => setFormData({ ...formData, businessTitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleProfileSave}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <Check size={16} /> Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <X size={16} /> Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="p-6 space-y-4">
                <div className="flex items-center gap-4">
                  <UserAvatar
                    firstName={currentUser.firstName}
                    lastName={currentUser.lastName}
                    avatarUrl={currentUser.avatar}
                    size={80}
                    className="border-4 border-[#e8eef5]"
                  />
                  <div>
                    <h3 className="text-[#1a2d5a] text-lg font-semibold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                      {currentUser.firstName} {currentUser.lastName}
                    </h3>
                    {currentUser.nickname && (
                      <p className="text-sm text-gray-500">{currentUser.nickname}</p>
                    )}
                    <p className="text-sm text-gray-600">{currentUser.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 pt-4">
                  {currentUser.phone && (
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Phone</p>
                      <p className="text-sm text-gray-700">{currentUser.phone}</p>
                    </div>
                  )}
                  {currentUser.location && (
                    <div>
                      <p className="text-xs text-gray-500 font-semibold">Location</p>
                      <p className="text-sm text-gray-700">{currentUser.location}</p>
                    </div>
                  )}
                  {currentUser.bio && (
                    <div className="col-span-2">
                      <p className="text-xs text-gray-500 font-semibold">Bio</p>
                      <p className="text-sm text-gray-700">{currentUser.bio}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Children Management Section (for parents) */}
          {currentUser.accountType === 'parent' && (
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-[#1a2d5a] text-lg font-semibold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                  Children ({children.length})
                </h2>
                {!showAddChild && (
                  <button
                    onClick={() => setShowAddChild(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#1a2d5a] text-white rounded-lg hover:bg-[#142248] transition-colors text-sm font-medium"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    <Plus size={16} /> Add Child
                  </button>
                )}
              </div>

              <div className="p-6 space-y-3">
                {children.length === 0 && !showAddChild && (
                  <p className="text-gray-500 text-center py-8">No children added yet.</p>
                )}

                {/* Add Child Form */}
                {showAddChild && (
                  <div className="p-4 border border-blue-200 bg-blue-50 rounded-lg space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Inter, sans-serif' }}>
                      Add New Child
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="First Name"
                        value={childForm.firstName}
                        onChange={(e) => setChildForm({ ...childForm, firstName: e.target.value })}
                        className="px-3 py-2 border border-blue-300 rounded-lg text-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                      <input
                        type="text"
                        placeholder="Last Name"
                        value={childForm.lastName}
                        onChange={(e) => setChildForm({ ...childForm, lastName: e.target.value })}
                        className="px-3 py-2 border border-blue-300 rounded-lg text-sm"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      />
                    </div>
                    <select
                      value={childForm.gradeLevel}
                      onChange={(e) => setChildForm({ ...childForm, gradeLevel: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    >
                      <option value="">Select Grade Level</option>
                      {GRADE_LEVELS.map((grade) => (
                        <option key={grade} value={grade}>
                          {grade}
                        </option>
                      ))}
                    </select>
                    <input
                      type="date"
                      value={childForm.dateOfBirth}
                      onChange={(e) => setChildForm({ ...childForm, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 border border-blue-300 rounded-lg text-sm"
                      style={{ fontFamily: 'Inter, sans-serif' }}
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={handleAddChild}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <Check size={14} /> Add
                      </button>
                      <button
                        onClick={() => {
                          setShowAddChild(false);
                          setChildForm({
                            firstName: '',
                            lastName: '',
                            gradeLevel: '',
                            dateOfBirth: '',
                            schoolName: '',
                          });
                        }}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        <X size={14} /> Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Children List */}
                {children.map((child) => (
                  <div key={child.id} className="border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedChildId(expandedChildId === child.id ? null : child.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors bg-white"
                    >
                      <div className="flex items-center gap-3 text-left">
                        <div className="w-12 h-12 rounded-full bg-[#e8eef5] flex items-center justify-center text-[#1a2d5a] font-semibold">
                          {child.firstName[0]}{child.lastName[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
                            {child.firstName} {child.lastName}
                          </p>
                          <p className="text-xs text-gray-500">{child.gradeLevel}</p>
                        </div>
                      </div>
                      {expandedChildId === child.id ? (
                        <ChevronUp size={20} className="text-gray-400" />
                      ) : (
                        <ChevronDown size={20} className="text-gray-400" />
                      )}
                    </button>

                    {expandedChildId === child.id && (
                      <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-3">
                        {editingChildId === child.id ? (
                          <>
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-3">
                                <input
                                  type="text"
                                  value={editingChild?.firstName || ''}
                                  onChange={(e) => setEditingChild({ ...editingChild!, firstName: e.target.value })}
                                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                />
                                <input
                                  type="text"
                                  value={editingChild?.lastName || ''}
                                  onChange={(e) => setEditingChild({ ...editingChild!, lastName: e.target.value })}
                                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                  style={{ fontFamily: 'Inter, sans-serif' }}
                                />
                              </div>
                              <select
                                value={editingChild?.gradeLevel || ''}
                                onChange={(e) => setEditingChild({ ...editingChild!, gradeLevel: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                <option value="">Select Grade Level</option>
                                {GRADE_LEVELS.map((grade) => (
                                  <option key={grade} value={grade}>
                                    {grade}
                                  </option>
                                ))}
                              </select>
                              <input
                                type="date"
                                value={editingChild?.dateOfBirth || ''}
                                onChange={(e) => setEditingChild({ ...editingChild!, dateOfBirth: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              />
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateChild(child.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                <Check size={14} /> Save
                              </button>
                              <button
                                onClick={() => {
                                  setEditingChildId(null);
                                  setEditingChild(null);
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                <X size={14} /> Cancel
                              </button>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-gray-500 font-semibold">Date of Birth</p>
                                <p className="text-gray-700">
                                  {child.dateOfBirth ? new Date(child.dateOfBirth).toLocaleDateString() : 'Not provided'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 font-semibold">Grade</p>
                                <p className="text-gray-700">{child.gradeLevel}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setEditingChildId(child.id);
                                  setEditingChild({
                                    firstName: child.firstName,
                                    lastName: child.lastName,
                                    gradeLevel: child.gradeLevel,
                                    dateOfBirth: child.dateOfBirth,
                                  });
                                }}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                <Edit2 size={14} /> Edit
                              </button>
                              <button
                                onClick={() => handleDeleteChild(child.id)}
                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                                style={{ fontFamily: 'Inter, sans-serif' }}
                              >
                                <Trash2 size={14} /> Remove
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
