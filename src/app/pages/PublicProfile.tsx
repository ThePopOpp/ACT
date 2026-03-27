import { useParams, Navigate } from 'react-router';
import { MapPin, Mail, Phone, GraduationCap, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { UserAvatar } from '../components/UserAvatar';

export function PublicProfile() {
  const { userId } = useParams();
  const { allUsers } = useAuth();

  const user = userId ? allUsers.find(u => u.id === userId) : null;

  if (!userId || !user) {
    return <Navigate to="/" />;
  }

  // Only allow viewing profiles for parents and donors, not students or internal admins
  if (user.accountType === 'student' || user.role !== 'user') {
    return <Navigate to="/" />;
  }

  const children = user.accountType === 'parent' ? (user.students || []) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero background */}
      <div className="h-32 bg-gradient-to-r from-[#1a2d5a] to-[#2a3d6a]" />

      <div className="max-w-4xl mx-auto px-6 -mt-16 mb-8">
        {/* Profile Card */}
        <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-lg">
          <div className="p-8">
            {/* Profile Header */}
            <div className="flex flex-col sm:flex-row gap-6 mb-8">
              <UserAvatar
                firstName={user.firstName}
                lastName={user.lastName}
                avatarUrl={user.avatar}
                size={128}
                className="border-4 border-[#e8eef5]"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h1
                      className="text-[#1a2d5a] text-3xl font-bold"
                      style={{ fontFamily: 'Merriweather, Georgia, serif' }}
                    >
                      {user.firstName} {user.lastName}
                    </h1>
                    {user.nickname && (
                      <p className="text-gray-500 italic text-sm mt-1">"{user.nickname}"</p>
                    )}
                  </div>
                  <span
                    className="px-3 py-1.5 bg-[#1a2d5a]/10 text-[#1a2d5a] text-xs font-semibold rounded-full"
                    style={{ fontFamily: 'Inter, sans-serif' }}
                  >
                    {user.accountType === 'individual_donor' && '👤 Individual Donor'}
                    {user.accountType === 'business_donor' && '🏢 Business Donor'}
                    {user.accountType === 'parent' && '👨‍👩‍👧 Parent / Guardian'}
                  </span>
                </div>

                {user.bio && (
                  <p className="text-gray-700 leading-relaxed mb-4" style={{ fontFamily: 'Inter, sans-serif' }}>
                    {user.bio}
                  </p>
                )}

                {/* Contact & Location Info */}
                <div className="flex flex-wrap gap-4 text-sm">
                  {user.location && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin size={16} className="text-[#1a2d5a]" />
                      <span>{user.location}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={16} className="text-[#1a2d5a]" />
                    <a href={`mailto:${user.email}`} className="hover:text-[#c8202d]">
                      {user.email}
                    </a>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2 text-gray-600">
                      <Phone size={16} className="text-[#1a2d5a]" />
                      <a href={`tel:${user.phone}`} className="hover:text-[#c8202d]">
                        {user.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Organization/School Info */}
            {(user.schoolName || user.businessName) && (
              <>
                <div className="border-t border-gray-200 pt-8 pb-6">
                  <h2
                    className="text-[#1a2d5a] text-lg font-semibold mb-4"
                    style={{ fontFamily: 'Merriweather, Georgia, serif' }}
                  >
                    {user.accountType === 'parent' ? 'School / Organization' : 'Organization'}
                  </h2>
                  <div className="bg-[#edf2f8] p-4 rounded-lg">
                    <p className="text-[#1a2d5a] font-semibold" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {user.schoolName || user.businessName}
                    </p>
                    {user.businessTitle && (
                      <p className="text-gray-600 text-sm mt-1">{user.businessTitle}</p>
                    )}
                  </div>
                </div>
              </>
            )}

            {/* Children Section (for parents) */}
            {user.accountType === 'parent' && children.length > 0 && (
              <div className="border-t border-gray-200 pt-8">
                <h2
                  className="text-[#1a2d5a] text-lg font-semibold mb-4"
                  style={{ fontFamily: 'Merriweather, Georgia, serif' }}
                >
                  Children 👧👦
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {children.map((child) => (
                    <div key={child.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a2d5a] to-[#2a3d6a] flex items-center justify-center text-white font-bold text-lg">
                          {child.firstName[0]}{child.lastName[0]}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-800">
                            {child.firstName} {child.lastName}
                          </h3>
                          {child.nickname && (
                            <p className="text-xs text-gray-500 italic">"{child.nickname}"</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-600">
                          <GraduationCap size={14} className="text-[#1a2d5a]" />
                          <span>{child.gradeLevel}</span>
                        </div>
                        {child.dateOfBirth && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <Calendar size={14} className="text-[#1a2d5a]" />
                            <span>{new Date(child.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-8 bg-[#e8eef5] rounded-xl p-8 text-center">
          <h3
            className="text-[#1a2d5a] text-xl font-bold mb-2"
            style={{ fontFamily: 'Merriweather, Georgia, serif' }}
          >
            Support Christian Education
          </h3>
          <p className="text-gray-600 mb-4">
            {user.accountType === 'parent'
              ? "Browse campaigns from Christian schools and contribute to your child's education and growth."
              : 'Browse campaigns from Christian schools and make a tax-deductible donation today.'}
          </p>
          <a
            href="/browse"
            className="inline-block px-6 py-2.5 bg-[#c8202d] text-white font-semibold rounded-lg hover:bg-[#a01825] transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Browse Campaigns
          </a>
        </div>
      </div>
    </div>
  );
}
