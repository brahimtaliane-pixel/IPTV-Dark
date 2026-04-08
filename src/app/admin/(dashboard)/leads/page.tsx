'use client';

import { useEffect, useState, useCallback } from 'react';
import { Search, Mail, Trash2, ExternalLink, ChevronLeft, ChevronRight, Filter } from 'lucide-react';

interface Lead {
  id: string;
  customer_name: string;
  email: string;
  phone: string;
  plan_name: string;
  status: string;
  payment_link: string;
  click_count: number;
  locale: string;
  created_at: string;
  email_sent_at: string | null;
  payment_clicked_at: string | null;
  notes: string | null;
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  email_sent: 'bg-blue-50 text-blue-700 border-blue-200',
  clicked: 'bg-purple-50 text-purple-700 border-purple-200',
  converted: 'bg-green-50 text-green-700 border-green-200',
  cancelled: 'bg-red-50 text-red-700 border-red-200',
};

const STATUS_OPTIONS = ['all', 'pending', 'email_sent', 'clicked', 'converted', 'cancelled'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState('all');
  const [search, setSearch] = useState('');
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesValue, setNotesValue] = useState('');

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: '20', status });
    if (search) params.set('search', search);

    const res = await fetch(`/api/admin/leads?${params}`);
    const data = await res.json();
    setLeads(data.leads || []);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, status, search]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  async function updateStatus(id: string, newStatus: string) {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: newStatus }),
    });
    fetchLeads();
  }

  async function saveNotes(id: string) {
    await fetch('/api/admin/leads', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, notes: notesValue }),
    });
    setEditingNotes(null);
    fetchLeads();
  }

  async function sendEmail(leadId: string) {
    setSendingEmail(leadId);
    const res = await fetch('/api/admin/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ leadId }),
    });
    const data = await res.json();
    if (data.success) {
      alert('Payment email sent successfully!');
    } else {
      alert('Failed to send email: ' + (data.error || 'Unknown error'));
    }
    setSendingEmail(null);
    fetchLeads();
  }

  async function deleteLead(id: string) {
    if (!confirm('Are you sure you want to delete this lead?')) return;
    await fetch(`/api/admin/leads?id=${id}`, { method: 'DELETE' });
    fetchLeads();
  }

  const totalPages = Math.ceil(total / 20);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
        <p className="text-sm text-gray-500 mt-1">{total} total leads</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E]"
          />
        </div>
        <div className="relative">
          <Filter size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm bg-white appearance-none focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E]"
          >
            {STATUS_OPTIONS.map(s => (
              <option key={s} value={s}>{s === 'all' ? 'All Status' : s.replace('_', ' ').toUpperCase()}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-48">
            <div className="animate-spin w-6 h-6 border-2 border-[#D52B1E] border-t-transparent rounded-full" />
          </div>
        ) : leads.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="text-lg font-medium">No leads found</p>
            <p className="text-sm mt-1">Leads will appear here when customers submit the form</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Plan</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Clicks</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Date</th>
                  <th className="text-right px-4 py-3 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leads.map(lead => (
                  <tr key={lead.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-4 py-3">
                      <div>
                        <p className="font-medium text-gray-900">{lead.customer_name}</p>
                        <p className="text-xs text-gray-500">{lead.email}</p>
                        <p className="text-xs text-gray-400">{lead.phone}</p>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-700">{lead.plan_name}</p>
                      <p className="text-xs text-gray-400">{lead.locale?.toUpperCase()}</p>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={lead.status}
                        onChange={(e) => updateStatus(lead.id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border ${STATUS_COLORS[lead.status] || 'bg-gray-50 text-gray-600 border-gray-200'} appearance-none cursor-pointer`}
                      >
                        {STATUS_OPTIONS.filter(s => s !== 'all').map(s => (
                          <option key={s} value={s}>{s.replace('_', ' ')}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-gray-600">{lead.click_count}</span>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-600 text-xs">
                        {new Date(lead.created_at).toLocaleDateString('fr-CH', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <p className="text-gray-400 text-[10px]">
                        {new Date(lead.created_at).toLocaleTimeString('fr-CH', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => sendEmail(lead.id)}
                          disabled={sendingEmail === lead.id}
                          className="p-1.5 text-blue-500 hover:bg-blue-50 rounded-lg transition disabled:opacity-50"
                          title="Send payment email"
                        >
                          <Mail size={15} />
                        </button>
                        {lead.payment_link && (
                          <a
                            href={lead.payment_link}
                            target="_blank"
                            rel="noopener"
                            className="p-1.5 text-gray-400 hover:bg-gray-50 rounded-lg transition"
                            title="Open payment link"
                          >
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <button
                          onClick={() => deleteLead(lead.id)}
                          className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg transition"
                          title="Delete lead"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-gray-50">
            <p className="text-xs text-gray-500">
              Page {page} of {totalPages} ({total} leads)
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition"
              >
                <ChevronLeft size={14} />
              </button>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="p-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition"
              >
                <ChevronRight size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
