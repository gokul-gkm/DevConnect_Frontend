import { Footer } from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import DevHeroSection from '@/components/user/home/DevHeroSection'
import {FAQ} from '@/components/user/home/FAQ'
import { FeaturesSection } from '@/components/user/home/FeaturesSection'
import { HeroSection } from '@/components/user/home/HeroSection'
import { Testimonials } from '@/components/user/home/Testimonials'

const LandingHome = () => {
  return (
    <div>
      <Navbar />

      <div>
        <HeroSection />
        <FeaturesSection/>
        <Testimonials />
        <FAQ />
        <DevHeroSection/>
      </div>
      <Footer/>
      
    </div>
  )
}

export default LandingHome
