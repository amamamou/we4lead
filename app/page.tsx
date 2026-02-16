import LandingHeader from '../components/landing/landing-header';
import LandingHero from '../components/landing/landing-hero';
import LandingInstitutions from '../components/landing/landing-institutions';
import LandingCTA from '../components/landing/landing-cta';
import LandingFooter from '../components/landing/landing-footer';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <LandingHeader />
      <LandingHero />
      <LandingInstitutions />
      <LandingCTA />
      <LandingFooter />
    </div>
  )
}
