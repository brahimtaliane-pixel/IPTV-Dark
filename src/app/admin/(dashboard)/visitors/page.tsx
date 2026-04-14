'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Eye,
  Globe,
  Monitor,
  Smartphone,
  Tablet,
  Clock,
  MapPin,
  RefreshCw,
  Circle,
  Mail,
  Users,
} from 'lucide-react';

interface Visitor {
  id: string;
  visitor_id: string;
  email: string | null;
  page_url: string | null;
  page_title: string | null;
  referrer: string | null;
  device: string | null;
  browser: string | null;
  country: string | null;
  city: string | null;
  locale: string;
  first_seen_at: string;
  last_seen_at: string;
}

const COUNTRY_FLAGS: Record<string, string> = {
  CH: '🇨🇭', DE: '🇩🇪', FR: '🇫🇷', AT: '🇦🇹', IT: '🇮🇹', US: '🇺🇸', GB: '🇬🇧',
  ES: '🇪🇸', PT: '🇵🇹', NL: '🇳🇱', BE: '🇧🇪', SE: '🇸🇪', NO: '🇳🇴', DK: '🇩🇰',
  PL: '🇵🇱', CZ: '🇨🇿', TR: '🇹🇷', RU: '🇷🇺', CA: '🇨🇦', BR: '🇧🇷', AU: '🇦🇺',
  JP: '🇯🇵', CN: '🇨🇳', IN: '🇮🇳', KR: '🇰🇷',
};

function DeviceIcon({ device }: { device: string | null }) {
  if (device === 'Mobile') return <Smartphone className="w-4 h-4" />;
  if (device === 'Tablet') return <Tablet className="w-4 h-4" />;
  return <Monitor className="w-4 h-4" />;
}

export default function AdminVisitorsPage() {
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [onlineCount, setOnlineCount] = useState(0);
  const [todayTotal, setTodayTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchVisitors = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/visitors');
      const data = await res.json();
      setVisitors(data.visitors || []);
      setOnlineCount(data.online_count || 0);
      setTodayTotal(data.today_total || 0);
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVisitors();
    const interval = setInterval(fetchVisitors, 5000);
    return () => clearInterval(interval);
  }, [fetchVisitors]);

  function timeOnSite(firstSeen: string) {
    const diff = Date.now() - new Date(firstSeen).getTime();
    const secs = Math.floor(diff / 1000);
    if (secs < 60) return `${secs}s`;
    const mins = Math.floor(secs / 60);
    if (mins < 60) return `${mins}m`;
    const hours = Math.floor(mins / 60);
    return `${hours}h ${mins % 60}m`;
  }

  function getPagePath(url: string | null) {
    if (!url) return '/';
    try {
      return new URL(url).pathname;
    } catch {
      return url;
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text flex items-center gap-2">
            <Eye className="w-6 h-6 text-swiss-red" />
            Live Visitors
          </h1>
          <p className="text-sm text-text-muted mt-1">
            Real-time visitor tracking
          </p>
        </div>
        <button
          type="button"
          onClick={fetchVisitors}
          className="text-text-muted hover:text-text transition p-2"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-surface rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/15 rounded-lg flex items-center justify-center">
              <Circle className="w-5 h-5 fill-green-400 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{onlineCount}</p>
              <p className="text-xs text-text-muted">Online now</p>
            </div>
          </div>
        </div>
        <div className="bg-surface rounded-xl border border-border p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-500/15 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-text">{todayTotal}</p>
              <p className="text-xs text-text-muted">Visitors today</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="animate-spin w-6 h-6 border-2 border-swiss-red border-t-transparent rounded-full mx-auto" />
          </div>
        ) : visitors.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            <Eye className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">No visitors online right now</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-bg-alt">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Visitor
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Page
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Device
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-text-muted uppercase tracking-wider">
                    Time on site
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {visitors.map(v => (
                  <tr key={v.id} className="hover:bg-bg-alt/50 transition">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="w-9 h-9 bg-bg-alt border border-border rounded-full flex items-center justify-center">
                            <span className="text-xs font-semibold text-text-muted">
                              {(v.email || v.visitor_id).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-surface" />
                        </div>
                        <div className="min-w-0">
                          {v.email ? (
                            <div className="flex items-center gap-1.5">
                              <Mail className="w-3 h-3 text-text-muted" />
                              <span className="text-sm font-medium text-text truncate max-w-[180px]">
                                {v.email}
                              </span>
                            </div>
                          ) : (
                            <span className="text-sm text-text-muted">
                              {v.visitor_id.slice(0, 8)}...
                            </span>
                          )}
                          <span className="text-[11px] text-text-muted">
                            {v.locale.toUpperCase()}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        <Globe className="w-3.5 h-3.5 text-text-muted shrink-0" />
                        <span className="text-sm text-text-secondary truncate max-w-[200px]" title={v.page_url || ''}>
                          {getPagePath(v.page_url)}
                        </span>
                      </div>
                      {v.referrer && (
                        <p className="text-[11px] text-text-muted mt-0.5 truncate max-w-[200px]">
                          via {new URL(v.referrer).hostname}
                        </p>
                      )}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5">
                        {v.country ? (
                          <>
                            <span className="text-base leading-none">
                              {COUNTRY_FLAGS[v.country] || '🌍'}
                            </span>
                            <span className="text-sm text-text-secondary">
                              {v.city ? `${v.city}, ${v.country}` : v.country}
                            </span>
                          </>
                        ) : (
                          <>
                            <MapPin className="w-3.5 h-3.5 text-text-muted" />
                            <span className="text-sm text-text-muted">Unknown</span>
                          </>
                        )}
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <DeviceIcon device={v.device} />
                        <span className="text-sm">{v.browser || 'Unknown'}</span>
                      </div>
                      <p className="text-[11px] text-text-muted mt-0.5">
                        {v.device || 'Desktop'}
                      </p>
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-1.5 text-text-secondary">
                        <Clock className="w-3.5 h-3.5" />
                        <span className="text-sm font-medium">
                          {timeOnSite(v.first_seen_at)}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
