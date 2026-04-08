'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  CreditCard,
  MessageSquare,
  MessageCircle,
  Eye,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
} from 'lucide-react';

type BadgeKey = 'leads' | 'messages' | 'chat' | 'visitors';

const NAV_ITEMS: { href: string; label: string; icon: typeof LayoutDashboard; badgeKey?: BadgeKey }[] = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/leads', label: 'Leads', icon: Users, badgeKey: 'leads' },
  { href: '/admin/messages', label: 'Messages', icon: MessageSquare, badgeKey: 'messages' },
  { href: '/admin/chat', label: 'Live Chat', icon: MessageCircle, badgeKey: 'chat' },
  { href: '/admin/visitors', label: 'Visitors', icon: Eye, badgeKey: 'visitors' },
  { href: '/admin/plans', label: 'Plans', icon: CreditCard },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [badges, setBadges] = useState<Record<BadgeKey, number>>({
    leads: 0, messages: 0, chat: 0, visitors: 0,
  });
  const router = useRouter();
  const pathname = usePathname();

  const fetchBadges = useCallback(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => {
        if (data.badges) {
          setBadges({
            leads: data.badges.leads || 0,
            messages: data.badges.messages || 0,
            chat: data.badges.chat || 0,
            visitors: data.badges.visitors || 0,
          });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    fetch('/api/admin/auth')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setAuthenticated(true);
          setEmail(data.email);
        } else {
          router.push('/admin/login');
        }
      })
      .catch(() => router.push('/admin/login'));
  }, [router]);

  // Poll notification badges every 10 seconds
  useEffect(() => {
    if (!authenticated) return;
    fetchBadges();
    const interval = setInterval(fetchBadges, 10_000);
    return () => clearInterval(interval);
  }, [authenticated, fetchBadges]);

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' });
    router.push('/admin/login');
  }

  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-3 border-[#D52B1E] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!authenticated) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-gray-100">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#D52B1E] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">IS</span>
            </div>
            <span className="font-bold text-gray-900 text-sm">IPTV Suisse</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-400">
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-0.5">
          {NAV_ITEMS.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            const count = item.badgeKey ? badges[item.badgeKey] : 0;
            const isVisitors = item.badgeKey === 'visitors';
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-[#D52B1E]/5 text-[#D52B1E]'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                {item.label}
                {count > 0 && (
                  <span
                    className={`ml-auto min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                      isVisitors
                        ? 'bg-green-100 text-green-700'
                        : 'bg-[#D52B1E] text-white'
                    }`}
                  >
                    {count}
                  </span>
                )}
                {isActive && count === 0 && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            );
          })}
        </nav>

        {/* User section */}
        <div className="p-3 border-t border-gray-100">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
              <span className="text-xs font-semibold text-gray-600">
                {email.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">{email}</p>
              <p className="text-[10px] text-gray-400">Super Admin</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-gray-400 hover:text-red-500 transition"
              title="Sign out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 lg:px-8 gap-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden text-gray-500"
          >
            <Menu size={20} />
          </button>
          <div className="flex-1" />
          <Link
            href="/"
            target="_blank"
            className="text-xs text-gray-400 hover:text-gray-600 transition"
          >
            View Site &rarr;
          </Link>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
