'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useLanguage } from './LanguageContext'
import { useAuth } from './AuthContext'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const { lang, toggleLang } = useLanguage()
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const t = lang === 'en'
    ? { home: 'Home', explorer: 'College Explorer', cutoffs: 'Cutoff', mock: 'Mock Choice Fill', help: 'Help', appName: 'NextStep' }
    : { home: 'முகப்பு', explorer: 'கல்லூரி ஆராய்ச்சி', cutoffs: 'கட்-ஆஃப்', mock: 'பயிற்சி தேர்வு நிரப்பு', help: 'உதவி', appName: 'நெக்ஸ்ட் ஸ்டெப்' }

  const navigation = [
    { name: t.home, href: '/' },
    { name: t.explorer, href: '/explorer' },
    { name: t.cutoffs, href: '/cutoffs' },
    { name: t.mock, href: '/mock' },
    { name: t.help, href: '/help' },
  ]

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center group">
              <div className="h-9 w-9 mr-2 rounded-lg bg-white/20 ring-1 ring-white/30 flex items-center justify-center transition-all duration-300 group-hover:bg-white/25">
                <span className="text-white font-extrabold text-sm tracking-wider">NS</span>
              </div>
              <span className="text-white text-2xl font-bold group-hover:text-blue-200 transition-all duration-300 transform group-hover:scale-110">{t.appName}</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-link ${
                  pathname === item.href
                    ? 'nav-link-active'
                    : 'nav-link-inactive'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <button onClick={toggleLang} className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-white/10 text-white hover:bg-white/20 focus:outline-none">
              {lang === 'en' ? 'தமிழ்' : 'English'}
            </button>
            {user ? (
              <div className="ml-2 relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium bg-white/10 text-white hover:bg-white/20 focus:outline-none"
                >
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                    </span>
                  </div>
                  <span>{user.name || 'User'}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50">
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        logout()
                        setIsProfileDropdownOpen(false)
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="ml-2 px-3 py-2 rounded-md text-sm font-medium bg-white/10 text-white hover:bg-white/20">Login</Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-lg text-white hover:text-blue-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white transition-all duration-300"
            >
              <span className="sr-only">Open main menu</span>
              {!isOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-blue-700 to-purple-700">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`block px-4 py-3 rounded-lg text-base font-medium transition-all duration-300 transform hover:scale-105 ${
                  pathname === item.href
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-white hover:bg-white/10 hover:text-blue-200'
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="px-4 py-3">
              <button onClick={() => { toggleLang(); setIsOpen(false) }} className="w-full text-left px-4 py-2 rounded-lg text-base font-medium text-white bg-white/10 hover:bg-white/20">
                {lang === 'en' ? 'தமிழ்' : 'English'}
              </button>
            </div>
            <div className="px-4 pb-4">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-4 py-3 bg-white/10 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <span className="text-white font-semibold">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </span>
                    </div>
                    <div>
                      <div className="text-white font-medium">{user.name || 'User'}</div>
                      <div className="text-white/70 text-sm">{user.email}</div>
                    </div>
                  </div>
                  <Link href="/profile" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 rounded-lg text-base font-medium text-white bg-white/10 hover:bg-white/20">Profile</Link>
                  <button onClick={() => { logout(); setIsOpen(false) }} className="block w-full px-4 py-2 rounded-lg text-base font-medium text-white bg-white/10 hover:bg-white/20">Logout</button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setIsOpen(false)} className="block w-full text-center px-4 py-2 rounded-lg text-base font-medium text-white bg-white/10 hover:bg-white/20">Login</Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
