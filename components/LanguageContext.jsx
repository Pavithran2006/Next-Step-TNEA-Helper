'use client'

import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  toggleLang: () => {},
})

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('en')

  useEffect(() => {
    try {
      const saved = localStorage.getItem('app-lang')
      if (saved === 'en' || saved === 'ta') setLang(saved)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('app-lang', lang)
    } catch {}
  }, [lang])

  const value = useMemo(() => ({
    lang,
    setLang,
    toggleLang: () => setLang(prev => (prev === 'en' ? 'ta' : 'en')),
  }), [lang])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}


