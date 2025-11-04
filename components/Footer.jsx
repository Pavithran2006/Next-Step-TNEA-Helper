'use client'

import { useLanguage } from './LanguageContext'

export default function Footer() {
  const { lang } = useLanguage()
  const t = lang === 'en' ? {
    title: 'NextStep',
    desc1: 'Your complete guide for Tamil Nadu Engineering Admissions.',
    desc2: 'Get insights on colleges, cutoffs, and make informed decisions for your engineering career.',
    quick: 'Quick Links',
    imp: 'Important',
    unofficial: 'This is an unofficial helper app',
    verify: 'Always verify information from official TNEA website',
    approx: 'Cutoff data is approximate and for reference only',
    official: 'For official counselling, visit tneaonline.org',
    copyright: '© 2024 NextStep. Built for students, by students.',
    love: 'Made with ❤️ for aspiring engineers in Tamil Nadu',
    nav: { explorer: '🏫 College Explorer', cutoffs: '📊 Cutoff Trends', mock: '📝 Mock Choice Filling', help: '❓ TNEA Help Guide' },
  } : {
    title: 'நெக்ஸ்ட் ஸ்டெப்',
    desc1: 'தமிழ்நாடு பொறியியல் சேர்க்கைக்கான உங்கள் முழுமையான வழிகாட்டி.',
    desc2: 'கல்லூரிகள், கட்-ஆஃப் மற்றும் உங்கள் பொறியியல் பயணத்திற்கான நுணுக்கமான முடிவுகள் குறித்து அறிக.',
    quick: 'விரைவு இணைப்புகள்',
    imp: 'முக்கியம்',
    unofficial: 'இது அதிகாரப்பூர்வமற்ற உதவி பயன்பாடு',
    verify: 'எப்போதும் அதிகாரப்பூர்வ TNEA வலைத்தளத்தில் தகவலை சரிபார்க்கவும்',
    approx: 'கட்-ஆஃப் தரவு சுமார் மதிப்பாகும், குறிப்பு பயன்பாட்டிற்கே',
    official: 'அதிகாரப்பூர்வ ஆலோசனைக்கு tneaonline.org ஐ பார்வையிடவும்',
    copyright: '© 2024 நெக்ஸ்ட் ஸ்டெப். மாணவர்களுக்காக, மாணவர்களால் உருவாக்கப்பட்டது.',
    love: 'தமிழ்நாட்டின் எதிர்கால பொறியாளர்களுக்காக அன்புடன் ❤️',
    nav: { explorer: '🏫 கல்லூரி ஆராய்ச்சி', cutoffs: '📊 கட்-ஆஃப் போக்குகள்', mock: '📝 மாக் தேர்வு நிரப்பு', help: '❓ TNEA உதவி வழிகாட்டி' },
  }
  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-xl font-bold mb-6 gradient-text">{t.title}</h3>
            <p className="text-gray-300 text-base leading-relaxed">
              {t.desc1}
              <br />
              {t.desc2}
            </p>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">{t.quick}</h3>
            <ul className="space-y-3 text-base">
              <li><a href="/explorer" className="text-gray-300 hover:text-blue-300 transition-all duration-300 link-hover">{t.nav.explorer}</a></li>
              <li><a href="/cutoffs" className="text-gray-300 hover:text-blue-300 transition-all duration-300 link-hover">{t.nav.cutoffs}</a></li>
              <li><a href="/mock" className="text-gray-300 hover:text-blue-300 transition-all duration-300 link-hover">{t.nav.mock}</a></li>
              <li><a href="/help" className="text-gray-300 hover:text-blue-300 transition-all duration-300 link-hover">{t.nav.help}</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6 text-red-400">⚠️ {t.imp}</h3>
            <ul className="space-y-3 text-base text-gray-300">
              <li className="flex items-center"><span className="text-red-400 mr-2">•</span> {t.unofficial}</li>
              <li className="flex items-center"><span className="text-red-400 mr-2">•</span> {t.verify}</li>
              <li className="flex items-center"><span className="text-red-400 mr-2">•</span> {t.approx}</li>
              <li className="flex items-center"><span className="text-red-400 mr-2">•</span> {t.official}</li>
            </ul>
            <div className="mt-4">
              <a 
                href="https://www.tneaonline.org/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-red-600 text-white text-sm font-semibold rounded-lg hover:bg-red-700 transition-all duration-300 transform hover:scale-105"
              >
                <span className="mr-2">🌐</span>
                {lang === 'en' ? 'Official TNEA Website' : 'அதிகாரப்பூர்வ TNEA வலைத்தளம்'}
              </a>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400 text-base">
            {t.copyright}
            <span className="block mt-2 text-lg">{t.love}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
