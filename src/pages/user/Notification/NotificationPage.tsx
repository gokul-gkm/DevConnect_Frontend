import { Footer } from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import UserNotificationList from '../../../components/user/notification/NotificationList'


const UserNotificationPage = () => {
  return (
    <div>
      <Navbar />
      <div>
        <UserNotificationList/>
      </div>
      <Footer/>
      
    </div>
  )
}

export default UserNotificationPage
