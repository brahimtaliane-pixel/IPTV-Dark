import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { ArrowRight, Play, CheckCircle } from 'lucide-react';
import type { SiteStatsSnapshot } from '@/lib/constants';
import BrandMark from '@/components/ui/BrandMark';
import HeroDesktopImage from '@/components/sections/HeroDesktopImage';

export default async function Hero({ statValues }: { statValues: SiteStatsSnapshot }) {
  const t = await getTranslations('hero');
  const stats = await getTranslations('stats');

  return (
    <section className="relative bg-white pt-32 pb-16 lg:pt-44 lg:pb-24 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        <div className="absolute -top-40 -right-40 w-[500px] h-[500px] bg-swiss-red/[0.04] rounded-full blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-5 sm:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-swiss-red/5 border border-swiss-red/15 rounded-full mb-6">
              <BrandMark className="w-6 h-6 shrink-0" />
              <span className="text-xs font-semibold text-swiss-red tracking-wide uppercase">{t('badge')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold leading-[1.08] tracking-tight text-text mb-6">
              {t('title')} <span className="text-swiss-red">{t('titleHighlight')}</span> {t('titleEnd')}
            </h1>

            <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mb-8">{t('subtitle')}</p>

            <div className="flex flex-wrap gap-3 mb-8">
              <Link
                href="/#pricing"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-swiss-red text-white font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
              >
                {t('ctaPrimary')}
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/faq"
                className="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-text font-semibold rounded-lg hover:bg-bg-alt transition-colors text-sm"
              >
                <Play className="w-4 h-4" />
                {t('ctaSecondary')}
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm text-text-secondary">
              <CheckCircle className="w-4 h-4 text-success shrink-0" />
              {t('trust')}
            </div>
          </div>

          <div className="relative hidden lg:block min-h-[min(408px,50vw)]">
            <HeroDesktopImage alt={t('imageAlt')} badgeText={t('deviceBadge')} />
          </div>
        </div>

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-px bg-border rounded-xl overflow-hidden border border-border">
          {[
            { value: statValues.channels, label: stats('channels') },
            { value: statValues.movies, label: stats('movies') },
            { value: statValues.uptime, label: stats('uptime') },
            { value: statValues.supportHours, label: stats('support') },
          ].map((stat) => (
            <div key={stat.label} className="bg-white px-6 py-5 text-center">
              <div className="text-2xl sm:text-3xl font-extrabold text-swiss-red">{stat.value}</div>
              <div className="text-xs text-text-muted mt-1 uppercase tracking-wider font-medium">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
