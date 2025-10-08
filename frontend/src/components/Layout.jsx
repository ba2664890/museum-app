import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import LanguageSelector from './LanguageSelector'
import { useLanguage } from '../context/LanguageContext'

const Layout = ({ children }) => {
  const { currentLanguage } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50" dir={currentLanguage === 'ar' ? 'rtl' : 'ltr'}>
      <Header />
      <LanguageSelector />
      <main className="min-h-screen">
        {children || <Outlet />}
      </main>
      <Footer />
    </div>
  )
}

export default Layout