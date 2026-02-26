import {LandingHeader} from '../components/landing/landing-header';
import LandingInstitutions from '../components/landing/landing-institutions';
import LandingCTA from '../components/landing/landing-cta';
import  { Footer } from '../components/landing/landing-footer';
import PartnersSection from '@/components/landing/partners-section';
import { FeaturesSlideshowSection } from '../components/landing/psychotherapists-section';
import GuidedReportSection from '@/components/landing/GuidedReportSection';
import { HowItWorksSection } from '@/components/landing/how-it-works';
import { FAQSection } from '@/components/landing/faq-section';
import { ProductTeaserCard } from '@/components/landing/landing-hero';
import { BankingScaleHero } from '@/components/landing/BankingScaleHelo';
import { CaseStudiesCarousel } from '@/components/landing/CaseStudiesCarousel';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <ProductTeaserCard />
      <BankingScaleHero/>
<CaseStudiesCarousel/>
      <HowItWorksSection />
        <FeaturesSlideshowSection />
             <FAQSection />
      <Footer />
      
    </div>
  )
}
