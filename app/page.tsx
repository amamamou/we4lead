import LandingHeader from '../components/landing/landing-header';
import LandingInstitutions from '../components/landing/landing-institutions';
import LandingCTA from '../components/landing/landing-cta';
import   Footer  from '../components/landing/landing-footer';
import PartnersSection from '@/components/landing/partners-section';
import  TherapistsSection  from '../components/landing/psychotherapists-section';
import GuidedReportSection from '@/components/landing/GuidedReportSection';
import { HowItWorksSection } from '@/components/landing/how-it-works';
import { FAQSection } from '@/components/landing/faq-section';
import { CaseStudiesCarousel } from '@/components/landing/CaseStudiesCarousel';
import { ProductTeaserCard } from '@/components/landing/BankingScaleHelo';
import HeroSection from '@/components/landing/landing-hero';
import { SocialProof } from '@/components/landing/social-proof';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
      <SocialProof />
        <HowItWorksSection />
        <TherapistsSection />
              <CaseStudiesCarousel />

        <LandingCTA/>
             <FAQSection />
      <Footer />
      
    </div>
  )
}
