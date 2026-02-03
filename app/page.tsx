import Header from '@/components/header'
import HeroSection from '@/components/hero-section'
import InstitutionFinder from '@/components/institution-finder'
import ConsultantsDirectory from '@/components/consultants-directory'
import Footer from '@/components/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <HeroSection />
      <InstitutionFinder />
      <ConsultantsDirectory />
      <Footer />
    </div>
  )
}
