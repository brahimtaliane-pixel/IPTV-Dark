import nextDynamic from 'next/dynamic';
import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import Pricing from '@/components/sections/Pricing';
import JsonLd from '@/components/sections/JsonLd';

/** Code-split below the fold — smaller initial JS (Framer, Lucide per chunk). */
const Features = nextDynamic(() => import('@/components/sections/Features'));
const MultiScreenBanner = nextDynamic(() => import('@/components/sections/MultiScreenBanner'));
const DeviceCompatibility = nextDynamic(() => import('@/components/sections/DeviceCompatibility'));
const HowItWorks = nextDynamic(() => import('@/components/sections/HowItWorks'));
const WhyUs = nextDynamic(() => import('@/components/sections/WhyUs'));
const Testimonials = nextDynamic(() => import('@/components/sections/Testimonials'));
const FAQ = nextDynamic(() => import('@/components/sections/FAQ'));
const CityLinks = nextDynamic(() => import('@/components/sections/CityLinks'));
const CTA = nextDynamic(() => import('@/components/sections/CTA'));
import { getPlans, selectHomePricingPlans } from '@/lib/get-plans';
import { getSiteContact } from '@/lib/get-site-contact';
import { STATS } from '@/lib/constants';

type Props = {
  params: Promise<{ locale: string }>;
};

/** Always resolve plans at request time (DB prices), never a stale prerender vs client snapshot */
export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [plans, contact] = await Promise.all([getPlans(), getSiteContact()]);
  const homePricingPlans = selectHomePricingPlans(plans);

  return (
    <>
      <JsonLd locale={locale} plans={plans} phone={contact.phone} />
      <Hero
        statValues={{
          channels: STATS.channels,
          movies: STATS.movies,
          uptime: STATS.uptime,
          supportHours: STATS.supportHours,
        }}
      />
      <Features />
      <Pricing plans={homePricingPlans} />
      <MultiScreenBanner />
      <DeviceCompatibility />
      <HowItWorks />
      <WhyUs />
      <Testimonials />
      <FAQ />
      <CityLinks />
      <CTA />
    </>
  );
}
