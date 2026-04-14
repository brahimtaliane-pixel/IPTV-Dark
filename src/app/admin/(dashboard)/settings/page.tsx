'use client';

import { useEffect, useState } from 'react';
import { Save, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/settings', { cache: 'no-store' })
      .then(res => res.json())
      .then(data => { setSettings(data.settings || {}); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    setSaving(true);
    const { resend_configured, ga_configured, crisp_configured, ...saveable } = settings;
    await fetch('/api/admin/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saveable),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-3 border-swiss-red border-t-transparent rounded-full" />
      </div>
    );
  }

  const integrations = [
    {
      name: 'Resend (Email)',
      key: 'resend_configured',
      configured: settings.resend_configured === 'true',
      description: 'Transactional email delivery for payment links and notifications',
      setupUrl: 'https://resend.com',
    },
    {
      name: 'Google Analytics',
      key: 'ga_configured',
      configured: settings.ga_configured === 'true',
      description: 'Website traffic and conversion tracking',
      setupUrl: 'https://analytics.google.com',
    },
    {
      name: 'Crisp Chat',
      key: 'crisp_configured',
      configured: settings.crisp_configured === 'true',
      description: 'Live chat widget for customer support',
      setupUrl: 'https://crisp.chat',
    },
  ];

  const inputClass =
    'w-full px-3 py-2.5 border border-border rounded-lg text-sm text-text bg-bg-alt focus:outline-none focus:ring-2 focus:ring-swiss-red/20 focus:border-swiss-red';

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-text">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Manage site configuration and integrations</p>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text">Contact Information</h2>
          <p className="text-xs text-text-muted mt-0.5">These values are stored in the database</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1.5">
              <Mail size={12} />
              Admin Email
            </label>
            <input
              value={settings.admin_email || ''}
              onChange={e => setSettings({ ...settings, admin_email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1.5">
              <Mail size={12} />
              Notification Email (for new lead alerts)
            </label>
            <input
              value={settings.notification_email || ''}
              onChange={e => setSettings({ ...settings, notification_email: e.target.value })}
              className={inputClass}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1.5">
                <Phone size={12} />
                Phone Number
              </label>
              <input
                value={settings.phone_number || ''}
                onChange={e => setSettings({ ...settings, phone_number: e.target.value })}
                placeholder="+41 XX XXX XX XX"
                className={inputClass}
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-text-muted mb-1.5">
                <Phone size={12} />
                WhatsApp Number
              </label>
              <input
                value={settings.whatsapp_number || ''}
                onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="+41XXXXXXXXX"
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text">Email Configuration</h2>
          <p className="text-xs text-text-muted mt-0.5">Configure automated payment link emails</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-text-muted mb-1.5 block">From Name</label>
              <input
                value={settings.resend_from_name || ''}
                onChange={e => setSettings({ ...settings, resend_from_name: e.target.value })}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-text-muted mb-1.5 block">From Domain</label>
              <input
                value={settings.resend_from_domain || ''}
                onChange={e => setSettings({ ...settings, resend_from_domain: e.target.value })}
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-bg-alt rounded-lg border border-border">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auto_send_payment_email === 'true'}
                onChange={e => setSettings({ ...settings, auto_send_payment_email: e.target.checked ? 'true' : 'false' })}
                className="w-4 h-4 rounded border-border bg-surface text-swiss-red focus:ring-swiss-red/30"
              />
              <span className="text-sm text-text-secondary font-medium">Auto-send payment email after lead submission</span>
            </label>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="px-6 py-4 border-b border-border">
          <h2 className="font-semibold text-text">Integrations</h2>
          <p className="text-xs text-text-muted mt-0.5">
            Configure via environment variables in Vercel
          </p>
        </div>
        <div className="divide-y divide-border">
          {integrations.map(integration => (
            <div key={integration.key} className="px-6 py-4 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${integration.configured ? 'bg-green-500/15' : 'bg-red-500/15'}`}>
                {integration.configured ? (
                  <CheckCircle size={18} className="text-green-400" />
                ) : (
                  <XCircle size={18} className="text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-text">{integration.name}</p>
                <p className="text-xs text-text-muted">{integration.description}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                integration.configured
                  ? 'bg-green-500/15 text-green-400 border border-green-500/25'
                  : 'bg-red-500/15 text-red-400 border border-red-500/25'
              }`}>
                {integration.configured ? 'Connected' : 'Not configured'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-swiss-red text-text-on-red px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-swiss-red-dark transition disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && (
          <span className="text-sm text-green-400 flex items-center gap-1">
            <CheckCircle size={14} />
            Settings saved successfully
          </span>
        )}
        {saveError && (
          <span className="text-sm text-red-400 max-w-md">{saveError}</span>
        )}
      </div>
    </div>
  );
}
