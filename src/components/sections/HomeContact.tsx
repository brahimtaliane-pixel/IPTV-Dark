import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { Mail, Phone, MessageCircle, ArrowRight } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/constants';
import type { SiteContact } from '@/lib/get-site-contact';

export default async function HomeContact({ contact }: { contact: SiteContact }) {
  const t = await getTranslations('homeContact');
  const telHref = `tel:${contact.phone.replace(/\s/g, '')}`;

  const cards = [
    {
      key: 'wa',
      icon: MessageCircle,
      title: t('whatsapp'),
      desc: t('whatsappDesc'),
      cta: t('ctaWhatsapp'),
      href: contact.whatsappUrl,
      external: true,
      color: 'text-[#25D366]',
      bg: 'bg-[#25D366]/8',
    },
    {
      key: 'mail',
      icon: Mail,
      title: t('email'),
      desc: t('emailDesc'),
      cta: t('ctaEmail'),
      href: `mailto:${SITE_CONFIG.email}`,
      external: false,
      color: 'text-swiss-red',
      bg: 'bg-swiss-red/8',
    },
    {
      key: 'phone',
      icon: Phone,
      title: t('phone'),
      desc: t('phoneDesc'),
      cta: t('ctaPhone'),
      href: telHref,
      external: false,
      color: 'text-blue-600',
      bg: 'bg-blue-600/8',
    },
  ] as const;

  return (
    <section className="py-14 lg:py-20 bg-surface border-t border-border">
      <div className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-swiss-red mb-2">{t('badge')}</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-text tracking-tight mb-3">
            {t('title')}
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto text-base leading-relaxed">{t('subtitle')}</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-10">
          {cards.map(({ key, icon: Icon, title, desc, cta, href, external, color, bg }) => (
            <a
              key={key}
              href={href}
              {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              className="group bg-bg rounded-2xl border border-border p-6 text-center hover:border-swiss-red/25 hover:shadow-md transition-all flex flex-col items-center"
            >
              <div className={`w-12 h-12 rounded-xl ${bg} flex items-center justify-center mb-4`}>
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <h3 className="text-base font-bold text-text mb-1">{title}</h3>
              <p className="text-sm text-text-muted mb-4 flex-1">{desc}</p>
              <span className="text-sm font-semibold text-swiss-red inline-flex items-center gap-1">
                {cta}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </span>
            </a>
          ))}
        </div>

        <div className="text-center">
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-swiss-red text-white font-semibold rounded-lg hover:bg-swiss-red-dark transition-colors text-sm"
          >
            {t('ctaPage')}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
