'use client'

import Link from 'next/link'
import { useLanguage } from '../components/LanguageContext'

export default function Home() {
  const { lang } = useLanguage()
  const t = lang === 'en' ? {
    heroTitle: 'NextStep',
    heroSub1: 'Your Complete Guide to Tamil Nadu Engineering Admissions',
    heroSub2: 'Navigate through engineering colleges, analyze cutoff trends, practice choice filling, and get expert guidance for TNEA counselling - all in one place.',
    ctaExplore: '🏫 Explore Colleges',
    ctaGuide: '📚 TNEA Guide',
    gridTitle: 'Everything You Need for TNEA',
    gridSub: 'Comprehensive tools and resources to make your engineering admission journey smoother',
    statsTitle: 'Trusted by Thousands',
    statsSub: 'Join thousands of students who have successfully navigated their engineering admission journey',
    featuresTitle: 'Why Choose NextStep?',
    featuresSub: 'Discover what makes us the preferred choice for TNEA preparation',
  } : {
    heroTitle: 'நெக்ஸ்ட் ஸ்டெப்',
    heroSub1: 'தமிழ்நாடு பொறியியல் சேர்க்கைக்கான உங்கள் முழுமையான வழிகாட்டி',
    heroSub2: 'கல்லூரிகளை ஆராய்வது, கட்-ஆஃப் போக்குகளை பகுப்பாய்வு செய்வது, தேர்வு நிரப்பலைப் பயிற்சி செய்வது, மேலும் TNEA ஆலோசனைக்கான வழிகாட்டுதல்கள் — எல்லாம் ஒரே இடத்தில்.',
    ctaExplore: '🏫 கல்லூரிகளை ஆராயுங்கள்',
    ctaGuide: '📚 TNEA வழிகாட்டி',
    gridTitle: 'TNEA-க்கு தேவையான அனைத்தும்',
    gridSub: 'உங்கள் பொறியியல் சேர்க்கைப் பயணத்தை எளிதாக்கும் விரிவான கருவிகள் மற்றும் வளங்கள்',
    statsTitle: 'ஆயிரக்கணக்கானோரால் நம்பப்படுகிறது',
    statsSub: 'தங்கள் பொறியியல் சேர்க்கைப் பயணத்தை வெற்றிகரமாக நடத்திய ஆயிரக்கணக்கான மாணவர்களுடன் சேரவும்',
    featuresTitle: 'ஏன் நெக்ஸ்ட் ஸ்டெப்?',
    featuresSub: 'TNEA தயாரிப்புக்கு நாங்கள் விருப்பமான தேர்வாக இருக்கக் காரணம் என்ன என்பதைக் கண்டறியவும்',
  }
  const features = [
    {
      title: 'College Explorer',
      description: 'Discover engineering colleges across Tamil Nadu with detailed information, filters, and search capabilities.',
      icon: '🏫',
      href: '/explorer',
      color: 'bg-blue-50 border-blue-200 hover:bg-blue-100'
    },
    {
      title: 'Cutoff Viewer',
      description: 'View historical cutoff trends with interactive charts and filter by college, course, and community.',
      icon: '📊',
      href: '/cutoffs',
      color: 'bg-green-50 border-green-200 hover:bg-green-100'
    },
    {
      title: 'Mock Choice Fill',
      description: 'Practice choice filling with drag-and-drop interface and export your preferences as PDF.',
      icon: '📝',
      href: '/mock',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    },
    {
      title: 'TNEA Help Guide',
      description: 'Complete guide for TNEA counselling process with step-by-step instructions in Tamil and English.',
      icon: '❓',
      href: '/help',
      color: 'bg-orange-50 border-orange-200 hover:bg-orange-100'
    }
  ]

  const stats = [
    { number: '10,000+', label: lang === 'en' ? 'Students Helped' : 'மாணவர்களுக்கு உதவியது' },
    { number: '500+', label: lang === 'en' ? 'Colleges Listed' : 'கல்லூரிகள் பட்டியலிடப்பட்டுள்ளன' },
    { number: '95%', label: lang === 'en' ? 'Success Rate' : 'வெற்றி விகிதம்' },
    { number: '24/7', label: lang === 'en' ? 'Support Available' : 'ஆதரவு கிடைக்கும்' }
  ]

  const additionalFeatures = [
    {
      title: lang === 'en' ? 'Real-time Updates' : 'நேரடி புதுப்பிப்புகள்',
      description: lang === 'en' ? 'Get the latest cutoff data and college information updated in real-time.' : 'சமீபத்திய கட்-ஆஃப் தரவு மற்றும் கல்லூரி தகவல்களை நேரடியாகப் பெறுங்கள்.',
      icon: '⚡',
      color: 'bg-yellow-50 border-yellow-200 hover:bg-yellow-100'
    },
    {
      title: lang === 'en' ? 'Mobile Friendly' : 'மொபைல் நட்பு',
      description: lang === 'en' ? 'Access all features seamlessly on your mobile device, anywhere, anytime.' : 'எங்கும், எப்போதும் உங்கள் மொபைல் சாதனத்தில் அனைத்து அம்சங்களையும் சீராக அணுகவும்.',
      icon: '📱',
      color: 'bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
    },
    {
      title: lang === 'en' ? 'Expert Guidance' : 'நிபுணர் வழிகாட்டுதல்',
      description: lang === 'en' ? 'Get personalized advice and guidance from education experts and alumni.' : 'கல்வி நிபுணர்கள் மற்றும் முன்னாள் மாணவர்களிடமிருந்து தனிப்பட்ட ஆலோசனை மற்றும் வழிகாட்டுதலைப் பெறுங்கள்.',
      icon: '🎓',
      color: 'bg-teal-50 border-teal-200 hover:bg-teal-100'
    },
    {
      title: lang === 'en' ? 'Community Support' : 'சமூக ஆதரவு',
      description: lang === 'en' ? 'Connect with fellow students, share experiences, and get peer support.' : 'சக மாணவர்களுடன் இணைந்து, அனுபவங்களைப் பகிர்ந்து, சக ஆதரவைப் பெறுங்கள்.',
      icon: '🤝',
      color: 'bg-pink-50 border-pink-200 hover:bg-pink-100'
    }
  ]


  return (
    <div className="min-h-screen animated-bg">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 gradient-text animate-float">{t.heroTitle}</h1>
          <p className="text-xl md:text-2xl text-gray-700 mb-4 font-medium slide-up">
            {t.heroSub1}
          </p>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-10 leading-relaxed slide-up">
            {t.heroSub2}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center scale-in">
            <Link href="/explorer" className="btn-primary text-lg px-10 py-4 glow-effect hover-tilt">{t.ctaExplore}</Link>
            <Link 
              href="/help"
              className="btn-secondary text-lg px-10 py-4 hover-tilt"
            >
              {t.ctaGuide}
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 gradient-text-secondary">{t.gridTitle}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.gridSub}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
          {features.map((feature, index) => (
            <Link 
              key={index}
              href={feature.href}
              className={`feature-card hover-lift-strong ${feature.color} fade-in`}
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-center relative z-10">
                <div className="text-5xl mb-6 transform hover:scale-110 transition-transform duration-300 animate-float">{feature.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {feature.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>


      {/* Statistics Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 gradient-text-accent">{t.statsTitle}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.statsSub}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              <div className="bg-white rounded-2xl p-8 shadow-lg hover-lift-strong border border-gray-200">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.number}</div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Additional Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16 slide-up">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 gradient-text-secondary">{t.featuresTitle}</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t.featuresSub}
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {additionalFeatures.map((feature, index) => (
            <div 
              key={index}
              className={`card-premium hover-lift-strong ${feature.color} fade-in`}
              style={{ animationDelay: `${index * 0.15}s` }}
            >
              <div className="text-center relative z-10">
                <div className="text-4xl mb-4 transform hover:scale-110 transition-transform duration-300 animate-float">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}
