import { useState } from 'react';
import { MessageSquare, Bell, Send, Check, CheckCheck, Clock, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

interface SupportTicket {
  id: string;
  user: string;
  avatar: string;
  subject: string;
  preview: string;
  date: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  unread: boolean;
}

interface Notification {
  id: string;
  title: string;
  body: string;
  audience: string;
  status: 'draft' | 'scheduled' | 'sent';
  sentDate?: string;
  icon: string;
}

const MOCK_TICKETS: SupportTicket[] = [
  { id: 'tkt_001', user: 'Patricia Evans', avatar: 'https://i.pravatar.cc/40?u=tkt1', subject: 'Tax receipt not received', preview: "I made a donation 3 days ago and haven't received my tax receipt. Can you help?", date: '2026-03-24', status: 'open', priority: 'high', category: 'Tax Receipts', unread: true },
  { id: 'tkt_002', user: 'Robert Nguyen', avatar: 'https://i.pravatar.cc/40?u=tkt2', subject: 'Campaign approval delay', preview: "My campaign was submitted 5 days ago and I haven't heard back. What's the status?", date: '2026-03-23', status: 'in_progress', priority: 'medium', category: 'Campaigns', unread: true },
  { id: 'tkt_003', user: 'Linda Martinez', avatar: 'https://i.pravatar.cc/40?u=tkt3', subject: 'Unable to add student profile', preview: "I'm getting an error when trying to add my daughter's student profile to my account.", date: '2026-03-22', status: 'in_progress', priority: 'medium', category: 'Account', unread: false },
  { id: 'tkt_004', user: 'Desert Sun Construction', avatar: 'https://i.pravatar.cc/40?u=tkt4', subject: 'Business tax credit documentation', preview: "We need documentation for our $8,000 corporate donation for our accountant.", date: '2026-03-21', status: 'resolved', priority: 'low', category: 'Tax Receipts', unread: false },
  { id: 'tkt_005', user: 'Sarah Kim', avatar: 'https://i.pravatar.cc/40?u=tkt5', subject: 'Payment failed — please help', preview: "My donation of $1,459 failed but my card was charged. Need immediate assistance.", date: '2026-03-20', status: 'open', priority: 'urgent', category: 'Payments', unread: true },
  { id: 'tkt_006', user: 'Alan Cooper', avatar: 'https://i.pravatar.cc/40?u=tkt6', subject: 'Question about Arizona STO rules', preview: "Can I direct my donation to a specific student or must it go to the school's general fund?", date: '2026-03-19', status: 'resolved', priority: 'low', category: 'General', unread: false },
];

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', title: 'Tax Credit Season Reminder', body: "Don't forget — Arizona's Private School Tax Credit deadline is April 15th!", audience: 'All Donors', status: 'scheduled', sentDate: '2026-04-01', icon: '🏛️' },
  { id: 'n2', title: 'New Campaign Alert', body: 'Three new campaigns in your area just launched.', audience: 'Individual Donors', status: 'sent', sentDate: '2026-03-20', icon: '🏫' },
  { id: 'n3', title: 'Campaign Funded!', body: 'A campaign you backed just reached 100%!', audience: 'Backers of completed campaigns', status: 'sent', sentDate: '2026-03-18', icon: '🎉' },
  { id: 'n4', title: 'System Maintenance', body: 'ACT will be down for maintenance on March 26, 1–3 AM MST.', audience: 'All Users', status: 'draft', icon: '⚙️' },
];

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-blue-100 text-blue-700',
  in_progress: 'bg-amber-100 text-amber-700',
  resolved: 'bg-emerald-100 text-emerald-700',
  closed: 'bg-gray-100 text-gray-500',
};
const PRIORITY_COLORS: Record<string, string> = {
  low: 'bg-gray-100 text-gray-500',
  medium: 'bg-blue-50 text-blue-600',
  high: 'bg-amber-50 text-amber-600',
  urgent: 'bg-red-50 text-red-600',
};
const NOTIF_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-500',
  scheduled: 'bg-amber-100 text-amber-700',
  sent: 'bg-emerald-100 text-emerald-700',
};

export function CommunicationsTab() {
  const [section, setSection] = useState<'tickets' | 'notifications' | 'broadcast'>('tickets');
  const [tickets, setTickets] = useState(MOCK_TICKETS);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [broadcast, setBroadcast] = useState({ title: '', body: '', audience: 'All Users', icon: '📢' });

  const updateTicketStatus = (id: string, status: SupportTicket['status']) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status, unread: false } : t));
    if (selectedTicket?.id === id) setSelectedTicket(prev => prev ? { ...prev, status } : null);
    toast.success('Ticket status updated.');
  };

  const sendReply = () => {
    if (!replyText.trim()) return;
    setReplyText('');
    toast.success('Reply sent!');
    if (selectedTicket) updateTicketStatus(selectedTicket.id, 'in_progress');
  };

  const sendBroadcast = () => {
    if (!broadcast.title || !broadcast.body) { toast.error('Title and body required.'); return; }
    const n: Notification = { id: `n${Date.now()}`, title: broadcast.title, body: broadcast.body, audience: broadcast.audience, status: 'scheduled', sentDate: new Date().toLocaleDateString(), icon: broadcast.icon };
    setNotifications(prev => [n, ...prev]);
    setBroadcast({ title: '', body: '', audience: 'All Users', icon: '📢' });
    toast.success('Notification broadcast scheduled!');
  };

  const SECTIONS = [
    { key: 'tickets' as const, label: '🎫 Support Tickets', badge: tickets.filter(t => t.unread).length },
    { key: 'notifications' as const, label: '🔔 Notifications' },
    { key: 'broadcast' as const, label: '📢 Broadcast' },
  ];

  const inp = 'w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 bg-white';

  return (
    <div className="space-y-5">
      {/* Sub-nav */}
      <div className="flex gap-2 flex-wrap bg-white rounded-xl border border-gray-100 p-1.5">
        {SECTIONS.map(s => (
          <button key={s.key} onClick={() => setSection(s.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${section === s.key ? 'bg-[#1a2d5a] text-white shadow-sm' : 'text-gray-500 hover:text-[#1a2d5a]'}`}
            style={{ fontFamily: 'Inter, sans-serif' }}>
            {s.label}
            {s.badge ? <span className="bg-[#c8202d] text-white text-xs rounded-full px-1.5 py-0.5 leading-none">{s.badge}</span> : null}
          </button>
        ))}
      </div>

      {/* ── Support Tickets ───────────────────────────────────────────── */}
      {section === 'tickets' && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Ticket list */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <h3 className="text-[#1a2d5a] text-sm font-bold" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>
                Support Tickets ({tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length} open)
              </h3>
            </div>
            <div className="overflow-y-auto" style={{ maxHeight: 480 }}>
              {tickets.map(ticket => (
                <button key={ticket.id} onClick={() => setSelectedTicket(ticket)}
                  className={`w-full text-left p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors ${selectedTicket?.id === ticket.id ? 'bg-[#e8eef5]' : ''}`}>
                  <div className="flex items-start gap-3">
                    <div className="relative">
                      <img src={ticket.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0" />
                      {ticket.unread && <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-[#c8202d] rounded-full border border-white" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-0.5">
                        <p className="text-xs font-semibold text-[#1a2d5a] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{ticket.user}</p>
                        <span className={`px-1.5 py-0.5 rounded text-xs font-semibold shrink-0 ${PRIORITY_COLORS[ticket.priority]}`} style={{ fontFamily: 'Inter, sans-serif' }}>{ticket.priority}</span>
                      </div>
                      <p className="text-xs font-medium text-gray-700 truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{ticket.subject}</p>
                      <p className="text-xs text-gray-400 truncate mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{ticket.preview}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-semibold ${STATUS_COLORS[ticket.status]}`} style={{ fontFamily: 'Inter, sans-serif' }}>{ticket.status.replace('_', ' ')}</span>
                        <span className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>{ticket.date}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Ticket detail / reply */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-gray-100">
            {selectedTicket ? (
              <div className="h-full flex flex-col">
                <div className="p-5 border-b border-gray-100">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h4 className="text-[#1a2d5a] font-bold text-sm" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>{selectedTicket.subject}</h4>
                      <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>From {selectedTicket.user} · {selectedTicket.date} · {selectedTicket.category}</p>
                    </div>
                    <button onClick={() => setSelectedTicket(null)} className="text-gray-400 hover:text-gray-600"><X size={16} /></button>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    {(['open', 'in_progress', 'resolved', 'closed'] as const).map(s => (
                      <button key={s} onClick={() => updateTicketStatus(selectedTicket.id, s)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${selectedTicket.status === s ? STATUS_COLORS[s] : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                        style={{ fontFamily: 'Inter, sans-serif' }}>
                        {s.replace('_', ' ')}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex-1 p-5">
                  <div className="flex items-start gap-3 p-4 bg-[#e8eef5]/50 rounded-xl mb-4">
                    <img src={selectedTicket.avatar} alt="" className="w-8 h-8 rounded-full object-cover shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-[#1a2d5a] mb-1" style={{ fontFamily: 'Inter, sans-serif' }}>{selectedTicket.user}</p>
                      <p className="text-sm text-gray-700 leading-relaxed" style={{ fontFamily: 'Inter, sans-serif' }}>{selectedTicket.preview}</p>
                    </div>
                  </div>
                </div>
                <div className="p-5 border-t border-gray-100">
                  <textarea rows={4} value={replyText} onChange={e => setReplyText(e.target.value)}
                    placeholder="Write your reply…"
                    className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 resize-none bg-white mb-3"
                    style={{ fontFamily: 'Inter, sans-serif' }} />
                  <button onClick={sendReply}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1a2d5a] hover:bg-[#142248] text-white text-sm font-semibold rounded-xl transition-colors"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Send size={14} /> Send Reply
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-10 text-center">
                <div>
                  <MessageSquare size={36} className="text-gray-200 mx-auto mb-3" />
                  <p className="text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>Select a ticket to view and respond</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Notifications ─────────────────────────────────────────────── */}
      {section === 'notifications' && (
        <div className="space-y-4">
          {notifications.map(n => (
            <div key={n.id} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="text-2xl">{n.icon}</span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>{n.title}</h4>
                    <p className="text-xs text-gray-500 mt-0.5 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>{n.body}</p>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${NOTIF_STATUS_COLORS[n.status]}`} style={{ fontFamily: 'Inter, sans-serif' }}>{n.status}</span>
                      <span className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>→ {n.audience}</span>
                      {n.sentDate && <span className="text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>{n.sentDate}</span>}
                    </div>
                  </div>
                </div>
                {n.status === 'draft' && (
                  <button onClick={() => { setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, status: 'scheduled' as const, sentDate: new Date().toLocaleDateString() } : notif)); toast.success('Notification scheduled!'); }}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#1a2d5a] text-white text-xs font-semibold rounded-lg hover:bg-[#142248] transition-colors whitespace-nowrap"
                    style={{ fontFamily: 'Inter, sans-serif' }}>
                    <Send size={12} /> Schedule
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Broadcast ─────────────────────────────────────────────────── */}
      {section === 'broadcast' && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-2xl">
          <h3 className="text-[#1a2d5a] mb-6" style={{ fontFamily: 'Merriweather, Georgia, serif', fontWeight: 700 }}>Send Platform Broadcast</h3>
          <div className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Notification Title *</label>
                <input value={broadcast.title} onChange={e => setBroadcast(p => ({ ...p, title: e.target.value }))} placeholder="e.g., Important Platform Update" className={inp} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Audience</label>
                <select value={broadcast.audience} onChange={e => setBroadcast(p => ({ ...p, audience: e.target.value }))} className={inp + ' bg-white'}>
                  {['All Users', 'Individual Donors', 'Business Donors', 'Parents', 'Students', 'Admins'].map(a => <option key={a} value={a}>{a}</option>)}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              <div className="col-span-1">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Icon</label>
                <input value={broadcast.icon} onChange={e => setBroadcast(p => ({ ...p, icon: e.target.value }))} placeholder="📢" className={inp + ' text-center text-xl'} />
              </div>
              <div className="col-span-3">
                <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Preview</label>
                <div className="flex items-center gap-2 px-3 py-2.5 bg-[#e8eef5] rounded-lg border border-[#1a2d5a]/10">
                  <span>{broadcast.icon || '📢'}</span>
                  <span className="text-xs text-[#1a2d5a] font-medium truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{broadcast.title || 'Notification preview…'}</span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5" style={{ fontFamily: 'Inter, sans-serif' }}>Message Body *</label>
              <textarea rows={5} value={broadcast.body} onChange={e => setBroadcast(p => ({ ...p, body: e.target.value }))}
                placeholder="Write your broadcast message…"
                className={inp + ' resize-none'} style={{ fontFamily: 'Inter, sans-serif' }} />
            </div>
            <div className="flex gap-3">
              <button onClick={sendBroadcast}
                className="flex items-center gap-2 px-6 py-3 bg-[#1a2d5a] hover:bg-[#142248] text-white text-sm font-semibold rounded-xl transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                <Bell size={15} /> Send Broadcast
              </button>
              <button onClick={() => setBroadcast({ title: '', body: '', audience: 'All Users', icon: '📢' })}
                className="px-6 py-3 border border-gray-200 text-sm text-gray-600 rounded-xl hover:bg-gray-50 transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}>
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
