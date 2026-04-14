import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { CheckCircle, Mail, ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

type Props = { params: Promise<{ locale: string }> };

export default async function MerciPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: 'merci' });

  return (
    <div className="min-h-screen flex items-center justify-center px-5 bg-bg">
      <div className="max-w-sm w-full text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-5">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-extrabold text-text mb-2">{t('title')}</h1>
        <p className="text-text-secondary text-sm mb-8">{t('subtitle')}</p>

        <div className="bg-bg rounded-xl border border-border p-5 mb-8">
          <Mail className="w-6 h-6 text-swiss-red mx-auto mb-2" />
          <h2 className="font-bold text-text text-sm mb-1">{t('checkEmail')}</h2>
          <p className="text-xs text-text-muted">{t('emailInfo')}</p>
        </div>

        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-swiss-red hover:underline font-medium">
          <ArrowLeft className="w-4 h-4" />
          {t('backHome')}
        </Link>
      </div>
    </div>
  );
}
