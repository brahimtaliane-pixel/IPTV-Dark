'use client';

import { useEffect, useState } from 'react';
import { Users, CreditCard, MousePointerClick, TrendingUp, Clock, UserCheck, Mail, XCircle } from 'lucide-react';

interface Stats {
  leads: {
    total: number;
    pending: number;
    emailSent: number;
    clicked: number;
    converted: number;
    cancelled: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };
  plans: { active: number };
  clicks: { total: number };
  conversionRate: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => { setStats(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-swiss-red border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!stats) return <p className="text-text-muted">Failed to load stats.</p>;

  const statCards = [
    { label: 'Total Leads', value: stats.leads.total, icon: Users, color: 'bg-blue-500' },
    { label: 'Today', value: stats.leads.today, icon: Clock, color: 'bg-green-500' },
    { label: 'This Week', value: stats.leads.thisWeek, icon: TrendingUp, color: 'bg-purple-500' },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, icon: UserCheck, color: 'bg-swiss-red' },
  ];

  const statusCards = [
    { label: 'Pending', value: stats.leads.pending, icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10 border border-amber-500/20' },
    { label: 'Email Sent', value: stats.leads.emailSent, icon: Mail, color: 'text-blue-400', bg: 'bg-blue-500/10 border border-blue-500/20' },
    { label: 'Link Clicked', value: stats.leads.clicked, icon: MousePointerClick, color: 'text-purple-400', bg: 'bg-purple-500/10 border border-purple-500/20' },
    { label: 'Converted', value: stats.leads.converted, icon: UserCheck, color: 'text-green-400', bg: 'bg-green-500/10 border border-green-500/20' },
    { label: 'Cancelled', value: stats.leads.cancelled, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border border-red-500/20' },
    { label: 'Active Plans', value: stats.plans.active, icon: CreditCard, color: 'text-text-secondary', bg: 'bg-bg-alt border border-border' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Dashboard</h1>
        <p className="text-sm text-text-muted mt-1">Overview of your IPTV Dark business</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(card => (
          <div key={card.label} className="bg-surface rounded-xl border border-border p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{card.label}</span>
              <div className={`w-8 h-8 ${card.color} rounded-lg flex items-center justify-center`}>
                <card.icon size={16} className={card.color === 'bg-swiss-red' ? 'text-text-on-red' : 'text-white'} />
              </div>
            </div>
            <p className="text-3xl font-bold text-text">{card.value}</p>
          </div>
        ))}
      </div>

      <div>
        <h2 className="text-lg font-semibold text-text mb-3">Lead Pipeline</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {statusCards.map(card => (
            <div key={card.label} className={`${card.bg} rounded-xl p-4 text-center`}>
              <card.icon size={20} className={`${card.color} mx-auto mb-2`} />
              <p className="text-2xl font-bold text-text">{card.value}</p>
              <p className="text-xs text-text-muted mt-1">{card.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text mb-4">Quick Info</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Total Payment Link Clicks</span>
              <span className="font-medium text-text">{stats.clicks.total}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">This Month&apos;s Leads</span>
              <span className="font-medium text-text">{stats.leads.thisMonth}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Active Plans</span>
              <span className="font-medium text-text">{stats.plans.active}</span>
            </div>
          </div>
        </div>

        <div className="bg-surface rounded-xl border border-border p-6">
          <h3 className="font-semibold text-text mb-4">Pipeline Funnel</h3>
          <div className="space-y-2">
            {[
              { label: 'Pending', value: stats.leads.pending, total: stats.leads.total, color: 'bg-amber-400' },
              { label: 'Email Sent', value: stats.leads.emailSent, total: stats.leads.total, color: 'bg-blue-400' },
              { label: 'Clicked', value: stats.leads.clicked, total: stats.leads.total, color: 'bg-purple-400' },
              { label: 'Converted', value: stats.leads.converted, total: stats.leads.total, color: 'bg-green-400' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-text-muted">{item.label}</span>
                  <span className="font-medium text-text">{item.value}</span>
                </div>
                <div className="h-2 bg-bg-alt rounded-full overflow-hidden border border-border/60">
                  <div
                    className={`h-full ${item.color} rounded-full transition-all`}
                    style={{ width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
