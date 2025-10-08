import { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const { i18n } = useTranslation()
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language || 'fr')

  const languages = [
    { code: 'fr', name: 'Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'wo', name: 'Wolof', flag: '🇸🇳' },
  ]

  const changeLanguage = (languageCode) => {
    setCurrentLanguage(languageCode)
    i18n.changeLanguage(languageCode)
    localStorage.setItem('language', languageCode)
  }

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language')
    if (savedLanguage && savedLanguage !== currentLanguage) {
      changeLanguage(savedLanguage)
    }
  }, [])

  const value = {
    currentLanguage,
    languages,
    changeLanguage,
    t: i18n.t,
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}