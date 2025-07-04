import { Footer } from '@/components/layout/Footer'
import Navbar from '@/components/layout/Navbar'
import SearchDevelopers from './SearchDevelopers'


const SearchDevelopersPage = () => {
  return (
    <div>
      <Navbar />
      <div>
        <SearchDevelopers/>
      </div>
      <Footer/>
      
    </div>
  )
}

export default SearchDevelopersPage
