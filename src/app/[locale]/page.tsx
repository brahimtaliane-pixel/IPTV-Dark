import { setRequestLocale } from 'next-intl/server';
import Hero from '@/components/sections/Hero';
import Features from '@/components/sections/Features';
import HowItWorks from '@/components/sections/HowItWorks';
import WhyUs from '@/components/sections/WhyUs';
import Pricing from '@/components/sections/Pricing';
import MultiScreenBanner from '@/components/sections/MultiScreenBanner';
import Testimonials from '@/components/sections/Testimonials';
import DeviceCompatibility from '@/components/sections/DeviceCompatibility';
import FAQ from '@/components/sections/FAQ';
import CityLinks from '@/components/sections/CityLinks';
import CTA from '@/components/sections/CTA';
import JsonLd from '@/components/sections/JsonLd';
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
