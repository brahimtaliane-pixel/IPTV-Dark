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

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <JsonLd locale={locale} />
      <Hero />
      <Features />
      <Pricing />
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
