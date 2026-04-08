'use client';

import { useEffect, useState } from 'react';
import { Save, CheckCircle, XCircle, Mail, Phone, Globe } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/settings')
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
        <div className="animate-spin w-8 h-8 border-3 border-[#D52B1E] border-t-transparent rounded-full" />
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

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage site configuration and integrations</p>
      </div>

      {/* Contact Settings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Contact Information</h2>
          <p className="text-xs text-gray-500 mt-0.5">These values are stored in the database</p>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
              <Mail size={12} />
              Admin Email
            </label>
            <input
              value={settings.admin_email || ''}
              onChange={e => setSettings({ ...settings, admin_email: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E]"
            />
          </div>
          <div>
            <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
              <Mail size={12} />
              Notification Email (for new lead alerts)
            </label>
            <input
              value={settings.notification_email || ''}
              onChange={e => setSettings({ ...settings, notification_email: e.target.value })}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E]"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
                <Phone size={12} />
                Phone Number
              </label>
              <input
                value={settings.phone_number || ''}
                onChange={e => setSettings({ ...settings, phone_number: e.target.value })}
                placeholder="+41 XX XXX XX XX"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E]"
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 mb-1.5">
                <Phone size={12} />
                WhatsApp Number
              </label>
              <input
                value={settings.whatsapp_number || ''}
                onChange={e => setSettings({ ...settings, whatsapp_number: e.target.value })}
                placeholder="+41XXXXXXXXX"
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Email Settings */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Email Configuration</h2>
          <p className="text-xs text-gray-500 mt-0.5">Configure automated payment link emails</p>
        </div>
        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">From Name</label>
              <input
                value={settings.resend_from_name || ''}
                onChange={e => setSettings({ ...settings, resend_from_name: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E]"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1.5 block">From Domain</label>
              <input
                value={settings.resend_from_domain || ''}
                onChange={e => setSettings({ ...settings, resend_from_domain: e.target.value })}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#D52B1E]/20 focus:border-[#D52B1E]"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.auto_send_payment_email === 'true'}
                onChange={e => setSettings({ ...settings, auto_send_payment_email: e.target.checked ? 'true' : 'false' })}
                className="w-4 h-4 rounded border-gray-300 text-[#D52B1E] focus:ring-[#D52B1E]"
              />
              <span className="text-sm text-gray-700 font-medium">Auto-send payment email after lead submission</span>
            </label>
          </div>
        </div>
      </div>

      {/* Integrations Status */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">Integrations</h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Configure via environment variables in Vercel
          </p>
        </div>
        <div className="divide-y divide-gray-100">
          {integrations.map(integration => (
            <div key={integration.key} className="px-6 py-4 flex items-center gap-4">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${integration.configured ? 'bg-green-50' : 'bg-red-50'}`}>
                {integration.configured ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : (
                  <XCircle size={18} className="text-red-400" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">{integration.name}</p>
                <p className="text-xs text-gray-500">{integration.description}</p>
              </div>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                integration.configured
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-600'
              }`}>
                {integration.configured ? 'Connected' : 'Not configured'}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-[#D52B1E] text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-[#b8241a] transition disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
        {saved && (
          <span className="text-sm text-green-600 flex items-center gap-1">
            <CheckCircle size={14} />
            Settings saved successfully
          </span>
        )}
      </div>
    </div>
  );
}
