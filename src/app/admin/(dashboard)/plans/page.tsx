'use client';

import { useMemo, useEffect, useState } from 'react';
import { Save, Plus, Trash2, Star, Eye, EyeOff, Link2, Monitor } from 'lucide-react';

type CheckoutMode = 'form_only' | 'direct_only';

interface Plan {
  id: string;
  slug: string;
  duration: number;
  price: number;
  original_price: number | null;
  devices: number;
  features: string[];
  payment_link: string | null;
  checkout_mode?: CheckoutMode;
  is_popular: boolean;
  is_active: boolean;
  name_fr: string;
  name_de: string;
  description_fr: string | null;
  description_de: string | null;
  sort_order: number;
}

const DEVICE_GROUPS: { devices: number; title: string }[] = [
  { devices: 1, title: '1 scherm' },
  { devices: 2, title: '2 schermen' },
  { devices: 3, title: '3 schermen' },
  { devices: 4, title: '4 schermen' },
];

const inputClass =
  'w-full px-3 py-2 border border-border rounded-lg text-sm text-text bg-bg-alt focus:outline-none focus:ring-2 focus:ring-swiss-red/20 focus:border-swiss-red';

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  useEffect(() => { fetchPlans(); }, []);

  function normalizePlanRow(p: Plan): Plan {
    const link = (p.payment_link ?? '').trim();
    const raw = String(p.checkout_mode ?? 'form_only');
    const mode: CheckoutMode =
      raw === 'both' ? (link ? 'direct_only' : 'form_only') : raw === 'direct_only' ? 'direct_only' : 'form_only';
    return { ...p, checkout_mode: mode };
  }

  async function fetchPlans() {
    setLoading(true);
    const res = await fetch('/api/admin/plans');
    const data = await res.json();
    const raw = (data.plans || []) as Plan[];
    setPlans(raw.map(normalizePlanRow));
    setLoading(false);
  }

  const sortedPlans = useMemo(
    () => [...plans].sort((a, b) => a.sort_order - b.sort_order),
    [plans],
  );

  async function savePlan(plan: Plan) {
    const link = (plan.payment_link ?? '').trim();
    const mode = plan.checkout_mode ?? 'form_only';
    if (mode === 'direct_only' && !link) {
      alert('Direct checkout needs a non-empty payment link. Add a link or choose “Lead form only”.');
      return;
    }
    setSaving(plan.id);
    const { id, ...rest } = plan;
    const res = await fetch('/api/admin/plans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...rest }),
    });
    const data = await res.json().catch(() => ({}));
    setSaving(null);
    if (!res.ok) {
      alert(typeof data.error === 'string' ? data.error : 'Save failed');
      return;
    }
    setEditingPlan(null);
    fetchPlans();
  }

  async function createPlan() {
    const newPlan = {
      slug: 'new-plan-' + Date.now(),
      duration: 1,
      price: 0,
      original_price: 0,
      devices: 1,
      features: ['premium_server', 'all_channels', 'hd_4k'],
      is_popular: false,
      is_active: false,
      name_fr: 'Nieuw plan',
      name_de: 'Neuer Plan',
      description_fr: '',
      description_de: '',
      sort_order: plans.length + 1,
      payment_link: '',
      checkout_mode: 'form_only' as CheckoutMode,
    };

    await fetch('/api/admin/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlan),
    });
    fetchPlans();
  }

  async function deletePlan(id: string) {
    if (!confirm('Are you sure you want to delete this plan?')) return;
    await fetch(`/api/admin/plans?id=${id}`, { method: 'DELETE' });
    fetchPlans();
  }

  async function toggleActive(plan: Plan) {
    await fetch('/api/admin/plans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: plan.id, is_active: !plan.is_active }),
    });
    fetchPlans();
  }

  async function togglePopular(plan: Plan) {
    await fetch('/api/admin/plans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: plan.id, is_popular: !plan.is_popular }),
    });
    fetchPlans();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-swiss-red border-t-transparent rounded-full" />
      </div>
    );
  }

  function renderPlanCard(plan: Plan) {
    return (
      <div
        key={plan.id}
        className={`bg-surface rounded-xl border ${plan.is_active ? 'border-border' : 'border-dashed border-border opacity-60'} overflow-hidden`}
      >
        {editingPlan?.id === plan.id ? (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Name (NL)</label>
                <input
                  value={editingPlan.name_fr}
                  onChange={e => setEditingPlan({ ...editingPlan, name_fr: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Name (DE)</label>
                <input
                  value={editingPlan.name_de}
                  onChange={e => setEditingPlan({ ...editingPlan, name_de: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Description (NL)</label>
                <input
                  value={editingPlan.description_fr || ''}
                  onChange={e => setEditingPlan({ ...editingPlan, description_fr: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Description (DE)</label>
                <input
                  value={editingPlan.description_de || ''}
                  onChange={e => setEditingPlan({ ...editingPlan, description_de: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">Slug</label>
                <input
                  value={editingPlan.slug}
                  onChange={e => setEditingPlan({ ...editingPlan, slug: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Schermen (devices)</label>
                  <select
                    value={editingPlan.devices}
                    onChange={e => setEditingPlan({ ...editingPlan, devices: Number(e.target.value) })}
                    className={inputClass}
                  >
                    {[1, 2, 3, 4].map(n => (
                      <option key={n} value={n}>
                        {n} {n === 1 ? 'scherm' : 'schermen'}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Sort order</label>
                  <input
                    type="number"
                    value={editingPlan.sort_order}
                    onChange={e => setEditingPlan({ ...editingPlan, sort_order: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 md:col-span-2">
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Duration (months)</label>
                  <input
                    type="number"
                    value={editingPlan.duration}
                    onChange={e => setEditingPlan({ ...editingPlan, duration: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Price (€)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPlan.price}
                    onChange={e => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-text-muted mb-1">Original Price</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingPlan.original_price || ''}
                    onChange={e => setEditingPlan({ ...editingPlan, original_price: Number(e.target.value) || null })}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border space-y-3">
              <h4 className="text-sm font-semibold text-text">Plan page checkout</h4>
              <p className="text-xs text-text-muted">
                Controls the button on public URLs like{' '}
                <span className="font-mono text-text-secondary">/abonnementen/jouw-slug</span>: either collect leads first or send people straight to pay.
              </p>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">Checkout behavior</label>
                <select
                  value={editingPlan.checkout_mode ?? 'form_only'}
                  onChange={e =>
                    setEditingPlan({
                      ...editingPlan,
                      checkout_mode: e.target.value as CheckoutMode,
                    })
                  }
                  className={inputClass}
                >
                  <option value="form_only">Lead form first (details → payment link by e-mail)</option>
                  <option value="direct_only">Direct to payment (redirect to URL below immediately)</option>
                </select>
                <p className="text-[11px] text-text-muted mt-1.5">
                  <strong className="text-text-secondary">Direct to payment</strong> needs a payment URL in the field below (Stripe, PayPal, etc.).
                </p>
              </div>

              <div>
                <label className="block text-xs font-medium text-text-muted mb-1">
                  <Link2 size={12} className="inline mr-1" />
                  Payment link URL
                </label>
                <input
                  value={editingPlan.payment_link || ''}
                  onChange={e => setEditingPlan({ ...editingPlan, payment_link: e.target.value })}
                  placeholder="https://buy.stripe.com/..."
                  className={`${inputClass} font-mono text-xs`}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => savePlan(editingPlan)}
                disabled={saving === editingPlan.id}
                className="flex items-center gap-2 bg-swiss-red text-text-on-red px-4 py-2 rounded-lg text-sm font-medium hover:bg-swiss-red-dark transition disabled:opacity-50"
              >
                <Save size={14} />
                {saving === editingPlan.id ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditingPlan(null)}
                className="px-4 py-2 text-sm text-text-muted hover:text-text"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="p-5 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide bg-bg-alt text-swiss-red border border-swiss-red/25 px-2 py-0.5 rounded-full">
                  <Monitor size={10} />
                  {plan.devices} {plan.devices === 1 ? 'scherm' : 'schermen'}
                </span>
                <h3 className="font-semibold text-text">{plan.name_fr}</h3>
                {plan.is_popular && (
                  <span className="text-[10px] font-bold bg-swiss-red text-text-on-red px-2 py-0.5 rounded-full">POPULAR</span>
                )}
                {!plan.is_active && (
                  <span className="text-[10px] font-bold bg-bg-alt text-text-muted border border-border px-2 py-0.5 rounded-full">INACTIVE</span>
                )}
              </div>
              <p className="text-sm text-text-muted">{plan.description_fr}</p>
              <div className="flex items-center gap-4 mt-2 text-xs text-text-muted flex-wrap">
                <span>{plan.duration} months</span>
                <span>Sort: {plan.sort_order}</span>
                {plan.payment_link ? (
                  <span className="text-green-400 flex items-center gap-1">
                    <Link2 size={10} />
                    Payment link set
                  </span>
                ) : (
                  <span className="text-amber-400/90 flex items-center gap-1">
                    <Link2 size={10} />
                    No payment link
                  </span>
                )}
                <span className="text-text-secondary">
                  Checkout: {(plan.checkout_mode ?? 'form_only') === 'direct_only' ? 'Direct' : 'Lead form'}
                </span>
              </div>
            </div>

            <div className="text-right mr-4 shrink-0">
              <p className="text-2xl font-bold text-text">
                {plan.price} <span className="text-sm font-normal text-text-muted">€</span>
              </p>
              {plan.original_price != null && (
                <p className="text-xs text-text-muted line-through">{plan.original_price} €</p>
              )}
            </div>

            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => togglePopular(plan)}
                className={`p-2 rounded-lg transition ${plan.is_popular ? 'text-swiss-red bg-swiss-red/10' : 'text-text-muted hover:bg-bg-alt'}`}
                title="Toggle popular"
              >
                <Star size={16} fill={plan.is_popular ? 'currentColor' : 'none'} />
              </button>
              <button
                type="button"
                onClick={() => toggleActive(plan)}
                className={`p-2 rounded-lg transition ${plan.is_active ? 'text-green-400 bg-green-500/10' : 'text-text-muted hover:bg-bg-alt'}`}
                title="Toggle active"
              >
                {plan.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
              </button>
              <button
                type="button"
                onClick={() => setEditingPlan(normalizePlanRow(plan))}
                className="px-3 py-1.5 text-xs font-medium text-swiss-red bg-swiss-red/10 border border-swiss-red/20 rounded-lg hover:bg-swiss-red/15 transition"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => deletePlan(plan.id)}
                className="p-2 text-red-400/90 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                title="Delete plan"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-text">Plans</h1>
          <p className="text-sm text-text-muted mt-1">
            1–4 schermen × 3 / 6 / 12 maanden — beheer prijzen en betaallinks per plan
          </p>
        </div>
        <button
          type="button"
          onClick={createPlan}
          className="flex items-center justify-center gap-2 bg-swiss-red text-text-on-red px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-swiss-red-dark transition shrink-0"
        >
          <Plus size={16} />
          New Plan
        </button>
      </div>

      {DEVICE_GROUPS.map(({ devices, title }) => {
        const groupPlans = sortedPlans.filter(p => p.devices === devices);
        if (groupPlans.length === 0) return null;
        return (
          <div key={devices} className="space-y-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider border-b border-border pb-2">
              {title}
            </h2>
            <div className="space-y-4">{groupPlans.map(renderPlanCard)}</div>
          </div>
        );
      })}
    </div>
  );
}
