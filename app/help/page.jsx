'use client'

import { useState } from 'react'
import { useLanguage } from '../../components/LanguageContext'
import Link from 'next/link'

export default function Help() {
  const { lang } = useLanguage()
  const activeTab = lang === 'en' ? 'english' : 'tamil'

  const counsellingSteps = [
    {
      step: 1,
      title: 'Registration & Document Verification',
      titleTamil: 'பதிவு மற்றும் ஆவண சரிபார்ப்பு',
      description: 'Complete online registration and verify your documents at designated help centers.',
      descriptionTamil: 'ஆன்லைன் பதிவு செய்து, நிர்ணயிக்கப்பட்ட உதவி மையங்களில் உங்கள் ஆவணங்களை சரிபார்க்கவும்.',
      icon: '📝',
      details: [
        'Submit application with required documents',
        'Pay counselling fees online',
        'Choose document verification center',
        'Attend verification with original documents'
      ],
      detailsTamil: [
        'தேவையான ஆவணங்களுடன் விண்ணப்பம் சமர்ப்பிக்கவும்',
        'ஆன்லைனில் ஆலோசனை கட்டணம் செலுத்தவும்',
        'ஆவண சரிபார்ப்பு மையத்தை தேர்ந்தெடுக்கவும்',
        'அசல் ஆவணங்களுடன் சரிபார்ப்புக்கு பங்கேற்கவும்'
      ]
    },
    {
      step: 2,
      title: 'Choice Filling',
      titleTamil: 'விருப்ப தேர்வு நிரப்புதல்',
      description: 'Fill your college and course preferences online in order of priority.',
      descriptionTamil: 'முன்னுரிமை வரிசையில் உங்கள் கல்லூரி மற்றும் படிப்பு விருப்பங்களை ஆன்லைனில் நிரப்பவும்.',
      icon: '✏️',
      details: [
        'Research colleges thoroughly before choosing',
        'Consider location, transportation, and placement records',
        'Fill maximum number of choices allowed',
        'Submit choices before deadline'
      ],
      detailsTamil: [
        'தேர்வு செய்வதற்கு முன் கல்லூரிகளை முழுமையாக ஆராயுங்கள்',
        'இடம், போக்குவரத்து மற்றும் வேலை வாய்ப்பு பதிவுகளை கருத்தில் கொள்ளுங்கள்',
        'அனுமதிக்கப்பட்ட அதிகபட்ச விருப்பங்களை நிரப்பவும்',
        'கடைசி தேதிக்கு முன் விருப்பங்களை சமர்ப்பிக்கவும்'
      ]
    },
    {
      step: 3,
      title: 'Seat Allotment',
      titleTamil: 'இட ஒதுக்கீடு',
      description: 'Based on your rank and choices, seats will be allotted in multiple rounds.',
      descriptionTamil: 'உங்கள் தரவரிசை மற்றும் விருப்பங்களின் அடிப்படையில், பல சுற்றுகளில் இடங்கள் ஒதுக்கப்படும்.',
      icon: '🎯',
      details: [
        'Check allotment results online',
        'Download provisional allotment order',
        'Note the reporting date and college details',
        'Prepare for admission process'
      ],
      detailsTamil: [
        'ஒதுக்கீடு முடிவுகளை ஆன்லைனில் சரிபார்க்கவும்',
        'தற்காலிக ஒதுக்கீடு ஆணையை பதிவிறக்கவும்',
        'அறிக்கை தேதி மற்றும் கல்லூரி விவரங்களை குறித்து வைக்கவும்',
        'சேர்க்கை செயல்முறைக்கு தயாராகுங்கள்'
      ]
    },
    {
      step: 4,
      title: 'Admission & Reporting',
      titleTamil: 'சேர்க்கை மற்றும் அறிக்கை',
      description: 'Report to allotted college within specified time and complete admission.',
      descriptionTamil: 'குறிப்பிட்ட நேரத்திற்குள் ஒதுக்கப்பட்ட கல்லூரிக்கு அறிக்கை செய்து சேர்க்கையை முடிக்கவும்.',
      icon: '🎓',
      details: [
        'Report to college on specified date',
        'Pay admission fees and semester fees',
        'Submit original certificates',
        'Complete admission formalities'
      ],
      detailsTamil: [
        'குறிப்பிட்ட தேதியில் கல்லூரிக்கு அறிக்கை செய்யவும்',
        'சேர்க்கை கட்டணம் மற்றும் செமஸ்டர் கட்டணம் செலுத்தவும்',
        'அசல் சான்றிதழ்களை சமர்ப்பிக்கவும்',
        'சேர்க்கை செயல்முறைகளை முடிக்கவும்'
      ]
    }
  ]

  const documents = [
    { name: '10th Standard Mark Sheet', nameTA: '10ம் வகுப்பு மதிப்பெண் பட்டியல்', required: true },
    { name: '12th Standard Mark Sheet', nameTA: '12ம் வகுப்பு மதிப்பெண் பட்டியல்', required: true },
    { name: 'Transfer Certificate', nameTA: 'இடமாற்று சான்றிதழ்', required: true },
    { name: 'Community Certificate', nameTA: 'சமூக சான்றிதழ்', required: false },
    { name: 'Income Certificate', nameTA: 'வருமான சான்றிதழ்', required: false },
    { name: 'Nativity Certificate', nameTA: 'பூர்வீக சான்றிதழ்', required: true },
    { name: 'Aadhaar Card', nameTA: 'ஆதார் அட்டை', required: true },
    { name: 'Passport Size Photos', nameTA: 'பாஸ்போர்ட் அளவு புகைப்படங்கள்', required: true }
  ]

  return (
    <div className="min-h-screen animated-bg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">TNEA Help Guide</h1>
          <p className="text-xl text-gray-600 mb-6">
            Complete guide for Tamil Nadu Engineering Admissions counselling process
          </p>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link href="/explorer" className="card hover-lift">
            <div className="text-3xl mb-3">🏫</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Explore Colleges</h3>
            <p className="text-gray-600 text-sm">Find and compare engineering colleges</p>
          </Link>
          
          <Link href="/cutoffs" className="card hover-lift">
            <div className="text-3xl mb-3">📊</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Check Cutoffs</h3>
            <p className="text-gray-600 text-sm">View cutoff trends and analysis</p>
          </Link>
          
          <Link href="/mock" className="card hover-lift">
            <div className="text-3xl mb-3">📝</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Practice Choice Fill</h3>
            <p className="text-gray-600 text-sm">Mock choice filling simulation</p>
          </Link>
        </div>

        {/* Counselling Process */}
        <div className="glass-effect rounded-2xl shadow-xl p-8 mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {activeTab === 'english' ? 'TNEA Counselling Process' : 'TNEA ஆலோசனை செயல்முறை'}
          </h2>
          
          <div className="space-y-8">
            {counsellingSteps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-start">
                <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                  <div className="w-16 h-16 bg-primary-600 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                    {step.step}
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{step.icon}</span>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {activeTab === 'english' ? step.title : step.titleTamil}
                    </h3>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    {activeTab === 'english' ? step.description : step.descriptionTamil}
                  </p>
                  
                  <ul className="space-y-2">
                    {(activeTab === 'english' ? step.details : step.detailsTamil).map((detail, idx) => (
                      <li key={idx} className="flex items-start">
                        <span className="text-primary-600 mr-2 mt-1">•</span>
                        <span className="text-gray-700 text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-12">
          {/* Required Documents */}
          <div className="glass-effect rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {activeTab === 'english' ? 'Required Documents' : 'தேவையான ஆவணங்கள்'}
            </h2>
            
            <div className="space-y-3">
              {documents.map((doc, index) => (
                <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <span className="text-sm text-gray-900">
                    {activeTab === 'english' ? doc.name : doc.nameTA}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    doc.required 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {doc.required ? 
                      (activeTab === 'english' ? 'Required' : 'தேவை') :
                      (activeTab === 'english' ? 'Optional' : 'விருப்பமானது')
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tips and Guidelines */}
        <div className="glass-effect rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            {activeTab === 'english' ? 'Tips for Success' : 'வெற்றிக்கான குறிப்புகள்'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {activeTab === 'english' ? 'Before Counselling' : 'ஆலோசனைக்கு முன்'}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {activeTab === 'english' 
                    ? 'Research colleges thoroughly using our College Explorer'
                    : 'எங்கள் கல்லூரி எக்ஸ்ப்ளோரரைப் பயன்படுத்தி கல்லூரிகளை முழுமையாக ஆராயுங்கள்'
                  }
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {activeTab === 'english'
                    ? 'Analyze cutoff trends for realistic expectations'
                    : 'யதார்थமான எதிர்பார்ப்புகளுக்கான கட்ஆப் போக்குகளை பகுப்பாய்வு செய்யுங்கள்'
                  }
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {activeTab === 'english'
                    ? 'Practice choice filling with our mock tool'
                    : 'எங்கள் மாக் டூலைக் கொண்டு சாய்ஸ் ஃபில்லிங்கை பயிற்சி செய்யுங்கள்'
                  }
                </li>
                <li className="flex items-start">
                  <span className="text-green-600 mr-2">✓</span>
                  {activeTab === 'english'
                    ? 'Keep all documents ready and verified'
                    : 'அனைத்து ஆவணங்களையும் தயாராக வைத்து சரிபார்க்கவும்'
                  }
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {activeTab === 'english' ? 'During Counselling' : 'ஆலோசனையின் போது'}
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {activeTab === 'english'
                    ? 'Fill maximum number of choices allowed'
                    : 'அனுமதிக்கப்பட்ட அதிகபட்ச விருப்பங்களை நிரப்பவும்'
                  }
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {activeTab === 'english'
                    ? 'Consider location, fees, and placement records'
                    : 'இடம், கட்டணம் மற்றும் வேலை வாய்ப்பு பதிவுகளை கருத்தில் கொள்ளுங்கள்'
                  }
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {activeTab === 'english'
                    ? 'Check allotment results immediately after release'
                    : 'வெளியிடப்பட்ட உடனே ஒதுக்கீடு முடிவுகளை சரிபார்க்கவும்'
                  }
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  {activeTab === 'english'
                    ? 'Report to college within specified time'
                    : 'குறிப்பிட்ட நேரத்திற்குள் கல்லூரிக்கு அறிக்கை செய்யுங்கள்'
                  }
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Official Links */}
        <div className="bg-primary-600 text-white rounded-lg p-8 mt-12">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {activeTab === 'english' ? 'Official Links & Resources' : 'அதிகாரப்பூர்வ இணைப்புகள் மற்றும் வளங்கள்'}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {activeTab === 'english' ? 'Important Websites' : 'முக்கியமான வலைத்தளங்கள்'}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• Official TNEA Website: tneaonline.org</li>
                <li>• Anna University: annauniv.edu</li>
                <li>• TNEAONLINE: tneaonline.org</li>
                <li>• Document Verification Centers</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3">
                {activeTab === 'english' ? 'Helpline Numbers' : 'உதவி எண்கள்'}
              </h3>
              <ul className="space-y-2 text-sm">
                <li>• TNEA Helpline: 044-2220-2222</li>
                <li>• Technical Support: 044-2220-3333</li>
                <li>• Email: tnea@tneaonline.org</li>
                <li>• WhatsApp: +91-9876543210</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-primary-100">
              {activeTab === 'english'
                ? 'Note: This is an unofficial helper app. Always verify information from official TNEA sources.'
                : 'குறிப்பு: இது அதிகாரப்பூர்வமற்ற உதவி பயன்பாடு. எப்போதும் அதிகாரப்பூர்வ TNEA ஆதாரங்களிலிருந்து தகவல்களை சரிபார்க்கவும்.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
