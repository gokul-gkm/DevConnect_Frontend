import { Footer } from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import SessionBooking from '@/components/user/Sessions/SessionBooking'


const SessionBookingPage = () => {
  return (
    <div>
      <Navbar />
      <div>
        <SessionBooking/>
      </div>
      <Footer/>
      
    </div>
  )
}

export default SessionBookingPage
