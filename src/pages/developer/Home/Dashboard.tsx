import { Footer } from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import { HeroSection } from '@/components/user/home/HeroSection'


const DevDashboard = () => {
  return (
    <div>
      <Navbar />

      <div>
        <HeroSection />
      </div>
      <Footer/>
      
    </div>
  )
}

export default DevDashboard
