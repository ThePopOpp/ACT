import { useState } from 'react';
import { Search, Shield, ShieldOff, Trash2, UserX, UserCheck, ChevronDown, Mail } from 'lucide-react';
import { AuthUser, UserRole } from '../../context/AuthContext';
import { toast } from 'sonner';

type TypeFilter = 'all' | 'individual_donor' | 'business_donor' | 'parent' | 'student';

const TYPE_LABELS: Record<string, string> = {
  individual_donor: 'Individual Donor',
  business_donor: 'Business Donor',
  parent: 'Parent',
  student: 'Student',
};
const TYPE_COLORS: Record<string, string> = {
  individual_donor: 'bg-blue-100 text-blue-700',
  business_donor: 'bg-violet-100 text-violet-700',
  parent: 'bg-teal-100 text-teal-700',
  student: 'bg-amber-100 text-amber-700',
};
const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-[#1a2d5a] text-white',
  admin: 'bg-[#c8202d]/10 text-[#c8202d]',
  user: 'bg-gray-100 text-gray-500',
};

interface Props {
  users: AuthUser[];
  onUpdateRole: (userId: string, role: UserRole) => void;
  onUpdateStatus: (userId: string, status: 'active' | 'suspended') => void;
  onDelete: (userId: string) => void;
}

export function UsersTab({ users, onUpdateRole, onUpdateStatus, onDelete }: Props) {
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [search, setSearch] = useState('');
  const [openRoleMenu, setOpenRoleMenu] = useState<string | null>(null);

  const filtered = users.filter(u => {
    if (typeFilter !== 'all' && u.accountType !== typeFilter) return false;
    if (statusFilter !== 'all' && u.status !== statusFilter) return false;
    const q = search.toLowerCase();
    if (q && !`${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const counts = {
    all: users.length,
    individual_donor: users.filter(u => u.accountType === 'individual_donor').length,
    business_donor: users.filter(u => u.accountType === 'business_donor').length,
    parent: users.filter(u => u.accountType === 'parent').length,
    student: users.filter(u => u.accountType === 'student').length,
  };

  const TYPE_FILTERS: { key: TypeFilter; label: string }[] = [
    { key: 'all', label: `All (${counts.all})` },
    { key: 'individual_donor', label: `Donors (${counts.individual_donor})` },
    { key: 'business_donor', label: `Business (${counts.business_donor})` },
    { key: 'parent', label: `Parents (${counts.parent})` },
    { key: 'student', label: `Students (${counts.student})` },
  ];

  return (
    <div className="space-y-5">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {TYPE_FILTERS.map(f => (
            <button key={f.key} onClick={() => setTypeFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${typeFilter === f.key ? 'bg-[#1a2d5a] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a2d5a]/30'}`}
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative w-52">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search users…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 bg-white"
              style={{ fontFamily: 'Inter, sans-serif' }} />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
            className="px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none bg-white text-gray-600"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['User', 'Account Type', 'Role', 'Joined', 'Status', 'Students', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>No users found.</td></tr>
              )}
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3" style={{ minWidth: 200 }}>
                      <img src={u.avatar || `https://i.pravatar.cc/40?u=${u.email}`} alt="" className="w-9 h-9 rounded-full object-cover shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Inter, sans-serif' }}>
                          {u.firstName} {u.lastName}
                          {u.nickname && <span className="text-gray-400 font-normal"> ({u.nickname})</span>}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5 truncate max-w-[160px]" style={{ fontFamily: 'Inter, sans-serif' }}>{u.email}</p>
                        {u.businessName && <p className="text-xs text-violet-500 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{u.businessName}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${TYPE_COLORS[u.accountType] || 'bg-gray-100 text-gray-500'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {TYPE_LABELS[u.accountType] || u.accountType}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {/* Role dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setOpenRoleMenu(openRoleMenu === u.id ? null : u.id)}
                        disabled={u.role === 'super_admin'}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold ${ROLE_COLORS[u.role]} ${u.role !== 'super_admin' ? 'cursor-pointer hover:opacity-80' : 'cursor-default'}`}
                        style={{ fontFamily: 'Inter, sans-serif' }}
                      >
                        {u.role.replace('_', ' ')}
                        {u.role !== 'super_admin' && <ChevronDown size={11} />}
                      </button>
                      {openRoleMenu === u.id && (
                        <>
                          <div className="fixed inset-0 z-30" onClick={() => setOpenRoleMenu(null)} />
                          <div className="absolute left-0 top-full mt-1 w-40 bg-white rounded-xl border border-gray-200 shadow-lg z-40 overflow-hidden">
                            {(['user', 'admin'] as UserRole[]).map(role => (
                              <button key={role} onClick={() => { onUpdateRole(u.id, role); setOpenRoleMenu(null); toast(`Role updated to ${role}.`); }}
                                className={`w-full text-left px-3 py-2.5 text-xs font-semibold hover:bg-gray-50 transition-colors ${u.role === role ? 'text-[#1a2d5a]' : 'text-gray-600'}`}
                                style={{ fontFamily: 'Inter, sans-serif' }}>
                                {role === 'admin' ? '🛡️ Admin' : '👤 User'}
                                {u.role === role && <span className="ml-1 text-emerald-500">✓</span>}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>
                      {new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-500'}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    {u.accountType === 'parent' && (u.students?.length ?? 0) > 0 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 bg-[#e8eef5] text-[#1a2d5a] text-xs font-bold rounded-full" style={{ fontFamily: 'Inter, sans-serif' }}>
                        {u.students!.length}
                      </span>
                    ) : (
                      <span className="text-gray-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 whitespace-nowrap">
                      <button className="w-7 h-7 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-blue-50 hover:text-blue-500 transition-colors" title="Email user">
                        <Mail size={12} />
                      </button>
                      {u.status === 'active' ? (
                        <button onClick={() => { onUpdateStatus(u.id, 'suspended'); toast(`${u.firstName} suspended.`); }}
                          disabled={u.role === 'super_admin'}
                          className="w-7 h-7 rounded-lg bg-amber-50 flex items-center justify-center text-amber-500 hover:bg-amber-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Suspend">
                          <UserX size={12} />
                        </button>
                      ) : (
                        <button onClick={() => { onUpdateStatus(u.id, 'active'); toast.success(`${u.firstName} reinstated.`); }}
                          className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500 hover:bg-emerald-100 transition-colors" title="Reinstate">
                          <UserCheck size={12} />
                        </button>
                      )}
                      <button onClick={() => { onDelete(u.id); toast(`User deleted.`); }}
                        disabled={u.role === 'super_admin'}
                        className="w-7 h-7 rounded-lg bg-red-50 flex items-center justify-center text-red-400 hover:bg-red-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors" title="Delete">
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
          Showing {filtered.length} of {users.length} users
        </div>
      </div>
    </div>
  );
}
