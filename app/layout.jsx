import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import Script from 'next/script'
import { LanguageProvider } from '../components/LanguageContext'
import { AuthProvider } from '../components/AuthContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'NextStep - Your Engineering Admission Guide',
  description: 'Complete guide and tools for Tamil Nadu Engineering Admissions (TNEA) - Navigate your engineering journey with confidence',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <LanguageProvider>
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </AuthProvider>
        </LanguageProvider>
        
      </body>
    </html>
  )
}
