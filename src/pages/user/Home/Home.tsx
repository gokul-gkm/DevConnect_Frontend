import { Footer } from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import { FeaturesSection } from '@/components/user/home/FeaturesSection'
import { HeroSection } from '@/components/user/home/HeroSection'


const Home = () => {
  return (
    <div>
      <Navbar />
      <div>
        <HeroSection />
        <FeaturesSection/>
      </div>
      <Footer/>
      
    </div>
  )
}

export default Home
