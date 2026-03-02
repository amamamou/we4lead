import LandingHeader from '../components/landing/landing-header';
import LandingCTA from '../components/landing/landing-cta';
import   Footer  from '../components/landing/landing-footer';
import  TherapistsSection  from '../components/landing/psychotherapists-section';
import { HowItWorksSection } from '@/components/landing/how-it-works';
import { FAQSection } from '@/components/landing/faq-section';
import HeroSection from '@/components/landing/landing-hero';
import { BentoGrid } from '@/components/landing/bento-grid';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <HeroSection />
        <HowItWorksSection />
        <TherapistsSection />
        <BentoGrid />

        <LandingCTA/>
             <FAQSection />
      <Footer />
      
    </div>
  )
}
