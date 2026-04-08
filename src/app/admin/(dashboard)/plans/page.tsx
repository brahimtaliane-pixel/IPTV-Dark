'use client';

import { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Star, Eye, EyeOff, Link2 } from 'lucide-react';

interface Plan {
  id: string;
  slug: string;
  duration: number;
  price: number;
  original_price: number | null;
  devices: number;
  features: string[];
  payment_link: string | null;
  is_popular: boolean;
  is_active: boolean;
  name_fr: string;
  name_de: string;
  description_fr: string | null;
  description_de: string | null;
  sort_order: number;
}

export default function PlansPage() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [showNew, setShowNew] = useState(false);

  useEffect(() => { fetchPlans(); }, []);

  async function fetchPlans() {
    setLoading(true);
    const res = await fetch('/api/admin/plans');
    const data = await res.json();
    setPlans(data.plans || []);
    setLoading(false);
  }

  async function savePlan(plan: Plan) {
    setSaving(plan.id);
    const { id, ...rest } = plan;
    await fetch('/api/admin/plans', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...rest }),
    });
    setSaving(null);
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
      name_fr: 'Nouveau Plan',
      name_de: 'Neuer Plan',
      description_fr: '',
      description_de: '',
      sort_order: plans.length + 1,
      payment_link: '',
    };

    await fetch('/api/admin/plans', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPlan),
    });
    setShowNew(false);
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
        <div className="animate-spin w-8 h-8 border-3 border-[#D52B1E] border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Plans</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your subscription plans and payment links</p>
        </div>
        <button
          onClick={createPlan}
          className="flex items-center gap-2 bg-[#D52B1E] text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-[#b8241a] transition"
        >
          <Plus size={16} />
          New Plan
        </button>
      </div>

      {/* Plans grid */}
      <div className="space-y-4">
        {plans.map(plan => (
          <div key={plan.id} className={`bg-white rounded-xl border ${plan.is_active ? 'border-gray-200' : 'border-dashed border-gray-300 opacity-60'} overflow-hidden`}>
            {editingPlan?.id === plan.id ? (
              /* Edit mode */
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Name (FR)</label>
                    <input
                      value={editingPlan.name_fr}
                      onChange={e => setEditingPlan({ ...editingPlan, name_fr: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Name (DE)</label>
                    <input
                      value={editingPlan.name_de}
                      onChange={e => setEditingPlan({ ...editingPlan, name_de: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description (FR)</label>
                    <input
                      value={editingPlan.description_fr || ''}
                      onChange={e => setEditingPlan({ ...editingPlan, description_fr: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Description (DE)</label>
                    <input
                      value={editingPlan.description_de || ''}
                      onChange={e => setEditingPlan({ ...editingPlan, description_de: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Slug</label>
                    <input
                      value={editingPlan.slug}
                      onChange={e => setEditingPlan({ ...editingPlan, slug: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Duration (months)</label>
                      <input
                        type="number"
                        value={editingPlan.duration}
                        onChange={e => setEditingPlan({ ...editingPlan, duration: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Price (CHF)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingPlan.price}
                        onChange={e => setEditingPlan({ ...editingPlan, price: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">Original Price</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editingPlan.original_price || ''}
                        onChange={e => setEditingPlan({ ...editingPlan, original_price: Number(e.target.value) || null })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment Link */}
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    <Link2 size={12} className="inline mr-1" />
                    Payment Link (Stripe, PayPal, etc.)
                  </label>
                  <input
                    value={editingPlan.payment_link || ''}
                    onChange={e => setEditingPlan({ ...editingPlan, payment_link: e.target.value })}
                    placeholder="https://buy.stripe.com/..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-mono"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => savePlan(editingPlan)}
                    disabled={saving === editingPlan.id}
                    className="flex items-center gap-2 bg-[#D52B1E] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#b8241a] transition disabled:opacity-50"
                  >
                    <Save size={14} />
                    {saving === editingPlan.id ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => setEditingPlan(null)}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* View mode */
              <div className="p-5 flex items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{plan.name_fr}</h3>
                    {plan.is_popular && (
                      <span className="text-[10px] font-bold bg-[#D52B1E] text-white px-2 py-0.5 rounded-full">POPULAR</span>
                    )}
                    {!plan.is_active && (
                      <span className="text-[10px] font-bold bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full">INACTIVE</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{plan.description_fr}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                    <span>{plan.duration} months</span>
                    <span>Sort: {plan.sort_order}</span>
                    {plan.payment_link ? (
                      <span className="text-green-600 flex items-center gap-1">
                        <Link2 size={10} />
                        Payment link set
                      </span>
                    ) : (
                      <span className="text-amber-600 flex items-center gap-1">
                        <Link2 size={10} />
                        No payment link
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right mr-4">
                  <p className="text-2xl font-bold text-gray-900">{plan.price} <span className="text-sm font-normal text-gray-400">CHF</span></p>
                  {plan.original_price && (
                    <p className="text-xs text-gray-400 line-through">{plan.original_price} CHF</p>
                  )}
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => togglePopular(plan)}
                    className={`p-2 rounded-lg transition ${plan.is_popular ? 'text-[#D52B1E] bg-red-50' : 'text-gray-300 hover:bg-gray-50'}`}
                    title="Toggle popular"
                  >
                    <Star size={16} fill={plan.is_popular ? '#D52B1E' : 'none'} />
                  </button>
                  <button
                    onClick={() => toggleActive(plan)}
                    className={`p-2 rounded-lg transition ${plan.is_active ? 'text-green-600 bg-green-50' : 'text-gray-300 hover:bg-gray-50'}`}
                    title="Toggle active"
                  >
                    {plan.is_active ? <Eye size={16} /> : <EyeOff size={16} />}
                  </button>
                  <button
                    onClick={() => setEditingPlan({ ...plan })}
                    className="px-3 py-1.5 text-xs font-medium text-[#D52B1E] bg-red-50 rounded-lg hover:bg-red-100 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => deletePlan(plan.id)}
                    className="p-2 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                    title="Delete plan"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
