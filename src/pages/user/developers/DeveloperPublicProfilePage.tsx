import { Footer } from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import DeveloperPublicProfile from '@/components/user/developers/DeveloperPublicProfile'


const DeveloperPublicProfilePage = () => {
  return (
    <div>
      <Navbar />
      <div>
        <DeveloperPublicProfile/>
      </div>
      <Footer/>
      
    </div>
  )
}

export default DeveloperPublicProfilePage
