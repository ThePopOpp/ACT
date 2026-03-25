import { useState } from 'react';
import { Search, Download, RefreshCw, DollarSign, TrendingUp, Clock, AlertCircle, FileText } from 'lucide-react';
import { toast } from 'sonner';

type TxStatus = 'all' | 'completed' | 'pending' | 'processing' | 'failed' | 'refunded';

interface Transaction {
  id: string;
  donorName: string;
  donorEmail: string;
  donorAvatar: string;
  campaign: string;
  amount: number;
  fee: number;
  net: number;
  date: string;
  status: 'completed' | 'pending' | 'processing' | 'failed' | 'refunded';
  method: string;
  taxReceiptIssued: boolean;
  receiptId?: string;
}

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'tx_001', donorName: 'James Thornton', donorEmail: 'james@thornton.com', donorAvatar: 'https://i.pravatar.cc/40?u=tx1', campaign: 'Covenant Christian Academy', amount: 2500, fee: 72.50, net: 2427.50, date: '2026-03-24', status: 'completed', method: 'Visa ••4821', taxReceiptIssued: true, receiptId: 'AZ-20260324-0011' },
  { id: 'tx_002', donorName: 'Desert Sun Construction', donorEmail: 'giving@desertsun.com', donorAvatar: 'https://i.pravatar.cc/40?u=tx2', campaign: 'SonRise Academy STEM Track', amount: 8000, fee: 232.00, net: 7768.00, date: '2026-03-24', status: 'completed', method: 'ACH Transfer', taxReceiptIssued: true, receiptId: 'AZ-20260324-0010' },
  { id: 'tx_003', donorName: 'Patricia Evans', donorEmail: 'p.evans@email.com', donorAvatar: 'https://i.pravatar.cc/40?u=tx3', campaign: 'Grace Christian Academy', amount: 1459, fee: 42.31, net: 1416.69, date: '2026-03-23', status: 'processing', method: 'Visa ••9312', taxReceiptIssued: false },
  { id: 'tx_004', donorName: 'Robert Nguyen', donorEmail: 'rnguyen@email.com', donorAvatar: 'https://i.pravatar.cc/40?u=tx4', campaign: 'Heritage Christian Prep', amount: 500, fee: 14.50, net: 485.50, date: '2026-03-23', status: 'completed', method: 'Mastercard ••2247', taxReceiptIssued: true, receiptId: 'AZ-20260323-0009' },
  { id: 'tx_005', donorName: 'Linda Martinez', donorEmail: 'linda.m@email.com', donorAvatar: 'https://i.pravatar.cc/40?u=tx5', campaign: 'Phoenix Christian Prep', amount: 2918, fee: 84.62, net: 2833.38, date: '2026-03-22', status: 'completed', method: 'Visa ••7741', taxReceiptIssued: true, receiptId: 'AZ-20260322-0008' },
  { id: 'tx_006', donorName: 'Alan Cooper', donorEmail: 'acooper@email.com', donorAvatar: 'https://i.pravatar.cc/40?u=tx6', campaign: 'Scottsdale Christian Academy', amount: 1000, fee: 29.00, net: 971.00, date: '2026-03-21', status: 'pending', method: 'Check', taxReceiptIssued: false },
  { id: 'tx_007', donorName: 'Susan Park', donorEmail: 'spark@email.com', donorAvatar: 'https://i.pravatar.cc/40?u=tx7', campaign: 'Chandler Christian School', amount: 750, fee: 21.75, net: 728.25, date: '2026-03-20', status: 'failed', method: 'Visa ••0034', taxReceiptIssued: false },
  { id: 'tx_008', donorName: 'Tom Bradford', donorEmail: 'tbrad@email.com', donorAvatar: 'https://i.pravatar.cc/40?u=tx8', campaign: 'Mesa Christian Academy', amount: 1459, fee: 42.31, net: 1416.69, date: '2026-03-19', status: 'refunded', method: 'Mastercard ••8812', taxReceiptIssued: false },
  { id: 'tx_009', donorName: 'Grace Foundation LLC', donorEmail: 'give@gracefnd.org', donorAvatar: 'https://i.pravatar.cc/40?u=tx9', campaign: 'Prescott Valley Christian', amount: 5000, fee: 145.00, net: 4855.00, date: '2026-03-18', status: 'completed', method: 'ACH Transfer', taxReceiptIssued: true, receiptId: 'AZ-20260318-0007' },
  { id: 'tx_010', donorName: 'Sandra Wu', donorEmail: 'swu@email.com', donorAvatar: 'https://i.pravatar.cc/40?u=tx10', campaign: 'Tempe Christian Academy', amount: 500, fee: 14.50, net: 485.50, date: '2026-03-17', status: 'completed', method: 'Visa ••3391', taxReceiptIssued: true, receiptId: 'AZ-20260317-0006' },
];

const STATUS_COLORS: Record<string, string> = {
  completed: 'bg-emerald-100 text-emerald-700',
  pending: 'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  failed: 'bg-red-100 text-red-500',
  refunded: 'bg-gray-100 text-gray-500',
};

export function PaymentsTab() {
  const [filter, setFilter] = useState<TxStatus>('all');
  const [search, setSearch] = useState('');
  const [transactions, setTransactions] = useState(MOCK_TRANSACTIONS);

  const filtered = transactions.filter(tx => {
    if (filter !== 'all' && tx.status !== filter) return false;
    const q = search.toLowerCase();
    if (q && !`${tx.donorName} ${tx.campaign} ${tx.id}`.toLowerCase().includes(q)) return false;
    return true;
  });

  const totalAmount = transactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.amount, 0);
  const totalFees = transactions.filter(t => t.status === 'completed').reduce((s, t) => s + t.fee, 0);
  const pending = transactions.filter(t => t.status === 'pending' || t.status === 'processing').reduce((s, t) => s + t.amount, 0);
  const failed = transactions.filter(t => t.status === 'failed').length;

  const issueReceipt = (txId: string) => {
    const receiptId = `AZ-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(Math.random() * 9000 + 1000)}`;
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, taxReceiptIssued: true, receiptId } : t));
    toast.success(`Tax receipt ${receiptId} issued!`);
  };

  const refund = (txId: string) => {
    setTransactions(prev => prev.map(t => t.id === txId ? { ...t, status: 'refunded' as const, taxReceiptIssued: false } : t));
    toast('Refund initiated.');
  };

  const STAT_CARDS = [
    { label: 'Total Processed', value: `$${totalAmount.toLocaleString()}`, sub: `${transactions.filter(t => t.status === 'completed').length} transactions`, icon: <DollarSign size={18} />, color: 'text-emerald-600 bg-emerald-50' },
    { label: 'Platform Fees', value: `$${totalFees.toFixed(2)}`, sub: '2.9% + $0.30 per tx', icon: <TrendingUp size={18} />, color: 'text-[#1a2d5a] bg-[#e8eef5]' },
    { label: 'Pending / Processing', value: `$${pending.toLocaleString()}`, sub: `${transactions.filter(t => t.status === 'pending' || t.status === 'processing').length} transactions`, icon: <Clock size={18} />, color: 'text-amber-600 bg-amber-50' },
    { label: 'Failed Transactions', value: failed.toString(), sub: 'Need attention', icon: <AlertCircle size={18} />, color: 'text-red-500 bg-red-50' },
  ];

  const FILTERS: { key: TxStatus; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'completed', label: 'Completed' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'failed', label: 'Failed' },
    { key: 'refunded', label: 'Refunded' },
  ];

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STAT_CARDS.map(card => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>{card.icon}</div>
            <div className="text-xl font-bold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>{card.value}</div>
            <div className="text-xs font-semibold text-gray-600 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{card.label}</div>
            <div className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{card.sub}</div>
          </div>
        ))}
      </div>

      {/* Filters + actions */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter === f.key ? 'bg-[#1a2d5a] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-[#1a2d5a]/30'}`}
              style={{ fontFamily: 'Inter, sans-serif' }}>
              {f.label}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <div className="relative w-52">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input placeholder="Search transactions…" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1a2d5a]/20 bg-white"
              style={{ fontFamily: 'Inter, sans-serif' }} />
          </div>
          <button onClick={() => toast('Exporting CSV…')}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-xs font-semibold text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
            style={{ fontFamily: 'Inter, sans-serif' }}>
            <Download size={13} /> Export
          </button>
        </div>
      </div>

      {/* Transactions table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {['Transaction', 'Donor', 'Campaign', 'Amount', 'Fee', 'Net', 'Date', 'Status', 'Tax Receipt', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={10} className="px-4 py-12 text-center text-sm text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>No transactions found.</td></tr>
              )}
              {filtered.map(tx => (
                <tr key={tx.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3">
                    <div>
                      <span className="text-xs font-mono text-[#1a2d5a] font-semibold">{tx.id}</span>
                      <p className="text-xs text-gray-400 mt-0.5" style={{ fontFamily: 'Inter, sans-serif' }}>{tx.method}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2" style={{ minWidth: 160 }}>
                      <img src={tx.donorAvatar} alt="" className="w-7 h-7 rounded-full object-cover shrink-0" />
                      <div>
                        <p className="text-xs font-semibold text-gray-700 whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>{tx.donorName}</p>
                        <p className="text-xs text-gray-400 truncate max-w-[120px]" style={{ fontFamily: 'Inter, sans-serif' }}>{tx.donorEmail}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-gray-600 max-w-[160px] truncate" style={{ fontFamily: 'Inter, sans-serif' }}>{tx.campaign}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold text-[#1a2d5a]" style={{ fontFamily: 'Merriweather, Georgia, serif' }}>${tx.amount.toLocaleString()}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500" style={{ fontFamily: 'Inter, sans-serif' }}>-${tx.fee.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-semibold text-emerald-600" style={{ fontFamily: 'Inter, sans-serif' }}>${tx.net.toFixed(2)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs text-gray-500 whitespace-nowrap" style={{ fontFamily: 'Inter, sans-serif' }}>{tx.date}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${STATUS_COLORS[tx.status]}`} style={{ fontFamily: 'Inter, sans-serif' }}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {tx.taxReceiptIssued ? (
                      <div className="flex items-center gap-1">
                        <span className="text-emerald-500">✓</span>
                        <span className="text-xs font-mono text-gray-500">{tx.receiptId}</span>
                      </div>
                    ) : tx.status === 'completed' ? (
                      <button onClick={() => issueReceipt(tx.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-[#e8eef5] text-[#1a2d5a] text-xs font-semibold rounded-lg hover:bg-[#1a2d5a] hover:text-white transition-colors"
                        style={{ fontFamily: 'Inter, sans-serif' }}>
                        <FileText size={11} /> Issue
                      </button>
                    ) : (
                      <span className="text-xs text-gray-300" style={{ fontFamily: 'Inter, sans-serif' }}>—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {tx.status === 'completed' && (
                      <button onClick={() => refund(tx.id)}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-red-50 text-red-500 text-xs font-semibold rounded-lg hover:bg-red-100 transition-colors whitespace-nowrap"
                        style={{ fontFamily: 'Inter, sans-serif' }}>
                        <RefreshCw size={11} /> Refund
                      </button>
                    )}
                    {tx.status === 'failed' && (
                      <button onClick={() => toast('Retry initiated.')}
                        className="flex items-center gap-1 px-2.5 py-1.5 bg-amber-50 text-amber-600 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors whitespace-nowrap"
                        style={{ fontFamily: 'Inter, sans-serif' }}>
                        <RefreshCw size={11} /> Retry
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400" style={{ fontFamily: 'Inter, sans-serif' }}>
          <span>Showing {filtered.length} of {transactions.length} transactions</span>
          <span>Total shown: <strong className="text-[#1a2d5a]">${filtered.reduce((s, t) => s + t.amount, 0).toLocaleString()}</strong></span>
        </div>
      </div>
    </div>
  );
}
