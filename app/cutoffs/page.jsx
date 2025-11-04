'use client'

import { useEffect, useMemo, useState } from 'react'
import { useLanguage } from '../../components/LanguageContext'
import { useAuth } from '../../components/AuthContext'
import { useRouter } from 'next/navigation'

export default function CutoffCalculator() {
  const { lang } = useLanguage()
  const isEN = lang === 'en'
  const [marks, setMarks] = useState({ maths: '', physics: '', chemistry: '' })
  const [recentCutoffs, setRecentCutoffs] = useState([])
  const [institutions, setInstitutions] = useState([])
  const [predictorTab, setPredictorTab] = useState('cutoff') // kept for compatibility, no UI tabs now
  const [filters, setFilters] = useState({ community: '', college: '', course: '' })
  const [lookup, setLookup] = useState({ college: '', course: '', community: '' })
  const [predictor, setPredictor] = useState({ useCalculator: true, manualCutoff: '', course: '', community: '' })
  const [results, setResults] = useState([])
  const [saveMsg, setSaveMsg] = useState('')
  const [showCutoffs, setShowCutoffs] = useState(false)
  const [displayedCutoffs, setDisplayedCutoffs] = useState([])
  const { user, addCutoffRecord } = useAuth()
  const router = useRouter()

  const handleChange = (field) => (e) => {
    setMarks(prev => ({ ...prev, [field]: e.target.value }))
  }

  const handleSliderChange = (field) => (e) => {
    setMarks(prev => ({ ...prev, [field]: String(e.target.value) }))
  }

  useEffect(() => {
    try {
      const saved = localStorage.getItem('cutoffMarks')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (parsed && typeof parsed === 'object') {
          if (parsed.marks) setMarks(parsed.marks)
        }
      }
    } catch {}
  }, [])

  useEffect(() => {
    const fetchCutoffs = async () => {
      try {
        const res = await fetch('/api/institutions', { cache: 'no-store' })
        const payload = await res.json()
        if (payload?.ok && Array.isArray(payload.data)) {
          const docs = payload.data
          setInstitutions(docs)
          const all = docs.flatMap(d => (d.cutoffs || []).map(c => ({ ...c, collegeId: d.id })))
          const years = Array.from(new Set(all.map(c => c.year))).sort((a,b) => b - a)
          const filtered = all.filter(c => years[0] ? c.year === years[0] : true)
          setRecentCutoffs(filtered)
        }
      } catch {}
    }
    fetchCutoffs()
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('cutoffMarks', JSON.stringify({ marks }))
    } catch {}
  }, [marks])

  const cutoff = useMemo(() => {
    const maths = Math.max(0, Number(marks.maths) || 0)
    const physics = Math.max(0, Number(marks.physics) || 0)
    const chemistry = Math.max(0, Number(marks.chemistry) || 0)
    return maths + physics / 2 + chemistry / 2
  }, [marks])

  const reset = () => setMarks({ maths: '', physics: '', chemistry: '' })

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(cutoff.toFixed(2))
    } catch {}
  }

  const saveToProfile = () => {
    if (!user) {
      router.push('/login?redirect=/cutoffs')
      return
    }
    addCutoffRecord({ value: cutoff, marks })
    setSaveMsg(isEN ? 'Saved to profile' : 'சுயவிவரத்தில் சேமிக்கப்பட்டது')
    setTimeout(() => setSaveMsg(''), 1500)
  }

  const summarizeByYear = (items) => {
    const map = new Map()
    items.forEach((i) => {
      const arr = map.get(i.year) || []
      arr.push(Number(i.cutoff ?? i.value ?? 0))
      map.set(i.year, arr)
    })
    return Array.from(map.entries()).map(([year, arr]) => {
      const nums = arr.filter((n) => !Number.isNaN(n))
      const avg = nums.reduce((a,b)=>a+b,0) / (nums.length || 1)
      const min = Math.min(...nums)
      const max = Math.max(...nums)
      return { year, count: nums.length, avg, min, max }
    }).sort((a,b)=> b.year - a.year)
  }

  // Predictor derive options and results
  // Options strictly from DB (cutoffs present)
  const uniqueColleges = useMemo(() => {
    const names = new Set()
    institutions.forEach((i) => { if ((i.cutoffs || []).length) names.add(i.name) })
    return Array.from(names).sort()
  }, [institutions])
  const uniqueCourses = useMemo(() => {
    const set = new Set()
    institutions.forEach((i) => (i.cutoffs || []).forEach((c) => set.add(c.course)))
    return Array.from(set).sort()
  }, [institutions])
  const latestYear = useMemo(() => {
    const y = new Set()
    institutions.forEach(i => (i.cutoffs || []).forEach(c => y.add(c.year)))
    return Array.from(y).sort((a,b)=>b-a)[0]
  }, [institutions])

  // Courses for predictor strictly constrained to those with cutoff data for selected year/community
  const predictorCourses = useMemo(() => {
    const year = latestYear || null
    const community = predictor.community || ''
    const set = new Set()
    institutions.forEach((i) => {
      let list = i.cutoffs || []
      if (year) list = list.filter((c) => c.year === year)
      if (community) list = list.filter((c) => c.category === community)
      list.forEach((c) => set.add(c.course))
    })
    return Array.from(set).sort()
  }, [institutions, predictor.community, latestYear])

  const communities = [
    { value: 'OC', label: 'OC (Open Category)' },
    { value: 'BC', label: 'BC' },
    { value: 'BCM', label: 'BCM' },
    { value: 'MBC', label: 'MBC' },
    { value: 'SC', label: 'SC' },
    { value: 'ST', label: 'ST' },
  ]

  const selectedCollegeCourses = useMemo(() => {
    const inst = institutions.find(i => i.name === lookup.college)
    if (!inst) return []
    let entries = inst.cutoffs || []
    if (latestYear) entries = entries.filter((e) => e.year === Number(latestYear))
    if (lookup.community) entries = entries.filter((e) => e.category === lookup.community)
    return Array.from(new Set(entries.map((e) => e.course))).sort()
  }, [institutions, lookup.college, lookup.community, latestYear])

  const lookedUpCutoff = useMemo(() => {
    if (!lookup.college || !lookup.course || !lookup.community) return null
    const inst = institutions.find(i => i.name === lookup.college)
    if (!inst) return null
    const yr = Number(latestYear)
    const entry = (inst.cutoffs || []).find(c => c.year === yr && c.course === lookup.course && c.category === lookup.community)
    return typeof entry?.cutoff === 'number' ? entry.cutoff : null
  }, [institutions, lookup, latestYear])

  const runPrediction = () => {
    const usedCutoff = predictor.useCalculator ? cutoff : Math.max(0, Number(predictor.manualCutoff) || 0)
    const year = Number(latestYear)
    const preferredCourse = predictor.course
    const preferredCommunity = predictor.community

    // Only institutions that have cutoff entries matching filters
    let candidates = institutions.filter(i => {
      const set = (i.cutoffs || []).filter(c => (!Number.isNaN(year) ? c.year === year : true) && (!preferredCourse || c.course === preferredCourse) && (!preferredCommunity || c.category === preferredCommunity))
      return set.length > 0
    })

    // For each institution, find the required cutoff for the chosen year/course/community
    const enriched = candidates.map(i => {
      const set = (i.cutoffs || []).filter(c => (Number.isNaN(year) ? true : c.year === year) && (!preferredCourse || c.course === preferredCourse) && (!preferredCommunity || c.category === preferredCommunity))
      const required = set.length ? Math.max(...set.map(c => Number(c.cutoff) || 0)) : -Infinity
      return { inst: i, requiredCutoff: required }
    })
    // Keep only those the user qualifies for
    const qualified = enriched.filter(e => e.requiredCutoff !== -Infinity && usedCutoff >= e.requiredCutoff)
    // Sort by required cutoff descending (most competitive first), then NIRF asc, then name
    qualified.sort((a,b) => {
      if (b.requiredCutoff !== a.requiredCutoff) return b.requiredCutoff - a.requiredCutoff
      const ar = a.inst.nirfRank ?? 1e9
      const br = b.inst.nirfRank ?? 1e9
      if (ar !== br) return ar - br
      return a.inst.name.localeCompare(b.inst.name)
    })
    setResults(qualified.slice(0, 5).map(e => ({ ...e.inst, requiredCutoff: e.requiredCutoff })))
  }

  const displayCutoffs = () => {
    if (!lookup.college) {
      alert(isEN ? 'Please select a college first' : 'முதலில் ஒரு கல்லூரியைத் தேர்ந்தெடுக்கவும்')
      return
    }

    const inst = institutions.find(i => i.name === lookup.college)
    if (!inst) return

    let cutoffs = inst.cutoffs || []
    
    // Filter by year if available
    if (latestYear) {
      cutoffs = cutoffs.filter(c => c.year === latestYear)
    }
    
    // Filter by course if selected
    if (lookup.course) {
      cutoffs = cutoffs.filter(c => c.course === lookup.course)
    }
    
    // Filter by community if selected
    if (lookup.community) {
      cutoffs = cutoffs.filter(c => c.category === lookup.community)
    }

    setDisplayedCutoffs(cutoffs)
    setShowCutoffs(true)
  }

  const clearCutoffs = () => {
    setShowCutoffs(false)
    setDisplayedCutoffs([])
  }

  // Clear cutoffs display when filters change
  useEffect(() => {
    if (showCutoffs) {
      clearCutoffs()
    }
  }, [lookup.college, lookup.course, lookup.community])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-3">{isEN ? 'Cutoff Calculator' : 'கட்-ஆஃப் கணக்குபடுத்தி'}</h1>
          <p className="text-gray-600">{isEN ? 'Formula' : 'சூத்திரம்'}: <span className="font-medium">cutoff = {isEN ? 'Maths' : 'கணிதம்'} + {isEN ? 'Physics' : 'இயற்பியல்'}/2 + {isEN ? 'Chemistry' : 'வேதியியல்'}/2</span></p>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg ring-1 ring-gray-100 p-6 md:p-8">
          {/* 1) Cutoff Calculator */}
          <div className="mb-3 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 font-semibold">1) {isEN ? 'Cutoff Calculator' : 'கட்-ஆஃப் கணக்குபடுத்தி'}</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="maths" className="block text-sm font-medium text-gray-700 mb-1">{isEN ? 'Maths' : 'கணிதம்'}</label>
              <input
                id="maths"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={marks.maths}
                onChange={handleChange('maths')}
                placeholder={isEN ? `Enter Maths marks (0–100)` : `கணித மதிப்பெண்களை உள்ளிடவும் (0–100)`}
              />
              <input
                aria-hidden
                type="range"
                min="0"
                max={100}
                step="1"
                className="w-full mt-2"
                value={Number(marks.maths) || 0}
                onChange={handleSliderChange('maths')}
              />
            </div>

            <div>
              <label htmlFor="physics" className="block text-sm font-medium text-gray-700 mb-1">{isEN ? 'Physics' : 'இயற்பியல்'}</label>
              <input
                id="physics"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={marks.physics}
                onChange={handleChange('physics')}
                placeholder={isEN ? `Enter Physics marks (0–100)` : `இயற்பியல் மதிப்பெண்களை உள்ளிடவும் (0–100)`}
              />
              <input
                aria-hidden
                type="range"
                min="0"
                max={100}
                step="1"
                className="w-full mt-2"
                value={Number(marks.physics) || 0}
                onChange={handleSliderChange('physics')}
              />
            </div>

            <div>
              <label htmlFor="chemistry" className="block text-sm font-medium text-gray-700 mb-1">{isEN ? 'Chemistry' : 'வேதியியல்'}</label>
              <input
                id="chemistry"
                type="number"
                inputMode="decimal"
                step="0.01"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                value={marks.chemistry}
                onChange={handleChange('chemistry')}
                placeholder={isEN ? `Enter Chemistry marks (0–100)` : `வேதியியல் மதிப்பெண்களை உள்ளிடவும் (0–100)`}
              />
              <input
                aria-hidden
                type="range"
                min="0"
                max={100}
                step="1"
                className="w-full mt-2"
                value={Number(marks.chemistry) || 0}
                onChange={handleSliderChange('chemistry')}
              />
            </div>
          </div>

          <div className="mt-8 flex items-end justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500">{isEN ? 'Your cutoff' : 'உங்கள் கட்-ஆஃப்'}</p>
              <p className="text-5xl font-extrabold bg-gradient-to-r from-primary-700 to-primary-500 bg-clip-text text-transparent">
                {cutoff.toFixed(2)}
              </p>
              <div className="mt-4 flex justify-end gap-3 flex-wrap">
                <button
                  onClick={reset}
                  className="px-4 py-2 text-sm font-medium text-primary-700 hover:text-primary-800"
                  type="button"
                >
                  {isEN ? 'Reset' : 'மீட்டமை'}
                </button>
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md shadow"
                  type="button"
                >
                  {isEN ? 'Copy' : 'நகலெடு'}
                </button>
                <button
                  onClick={saveToProfile}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow"
                  type="button"
                >
                  {isEN ? 'Save to Profile' : 'சுயவிவரத்திற்கு சேமிக்கவும்'}
                </button>
                {saveMsg && <span className="self-center text-green-700 text-sm">{saveMsg}</span>}
              </div>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-1">{isEN ? 'Formula breakdown' : 'சூத்திரத்தின் பிரிவு'}</p>
              <p className="text-sm text-gray-700">
                M + P/2 + C/2 = {Math.max(0, Number(marks.maths) || 0).toFixed(2)} + {Math.max(0, Number(marks.physics) || 0).toFixed(2)}/2 + {Math.max(0, Number(marks.chemistry) || 0).toFixed(2)}/2
              </p>
              <p className="text-sm text-gray-700 mt-1">
                = {(Math.max(0, Number(marks.maths) || 0)).toFixed(2)} + {(Math.max(0, Number(marks.physics) || 0) / 2).toFixed(2)} + {(Math.max(0, Number(marks.chemistry) || 0) / 2).toFixed(2)}
              </p>
              <p className="text-sm text-gray-900 font-semibold mt-1">= {cutoff.toFixed(2)}</p>
            </div>

            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-2">{isEN ? 'Tips' : 'உதவிக்குறிப்புகள்'}</p>
              <ul className="list-disc pl-5 space-y-1 text-sm text-gray-700">
                <li>{isEN ? 'Use the sliders for quick adjustments.' : 'விரைவான திருத்தங்களுக்கு ஸ்லைடர்களைப் பயன்படுத்தவும்.'}</li>
                <li>{isEN ? 'Your inputs are saved in the browser automatically.' : 'உங்கள் உள்ளீடுகள் தானாகவே உலாவியில் சேமிக்கப்படுகின்றன.'}</li>
              </ul>
            </div>
          </div>

          {/* 2) Cutoff Lookup by College */}
          <div className="mb-8 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
            <div className="mb-4 text-emerald-900 font-semibold">2) {isEN ? 'Cutoff by College' : 'கல்லூரி அடிப்படையிலான கட்-ஆஃப்'}</div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isEN ? 'College' : 'கல்லூரி'}</label>
                <select value={lookup.college} onChange={(e)=>setLookup(prev=>({...prev, college: e.target.value, course: ''}))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option value="">{isEN ? 'Select College' : 'கல்லூரியை தேர்ந்தெடுக்கவும்'}</option>
                  {uniqueColleges.map(college => <option key={college} value={college}>{college}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isEN ? 'Course' : 'பாடநெறி'}</label>
                <select value={lookup.course} onChange={(e)=>setLookup(prev=>({...prev, course: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option value="">{isEN ? 'Select Course' : 'பாடநெறியை தேர்ந்தெடுக்கவும்'}</option>
                  {selectedCollegeCourses.map(course => <option key={course} value={course}>{course}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isEN ? 'Community' : 'சமூகம்'}</label>
                <select value={lookup.community} onChange={(e)=>setLookup(prev=>({...prev, community: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
                  <option value="">{isEN ? 'Select Community' : 'சமூகத்தைத் தேர்ந்தெடுக்கவும்'}</option>
                  {communities.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              <div className="flex items-end">
                <button 
                  onClick={displayCutoffs}
                  className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-medium transition-colors duration-200"
                >
                  {isEN ? 'Display Cutoffs' : 'கட்-ஆஃப்களைக் காட்டு'}
                </button>
              </div>
            </div>
            <div className="text-sm text-gray-700">
              {lookedUpCutoff == null ? (
                <span>{isEN ? 'Select all fields to view the cutoff.' : 'கட்-ஆஃப்பைக் காண அனைத்து புலங்களையும் தேர்ந்தெடுக்கவும்.'}</span>
              ) : (
                <span>
                  {isEN ? 'Cutoff' : 'கட்-ஆஃப்'}: <span className="font-semibold">{lookedUpCutoff.toFixed(2)}</span>
                </span>
              )}
            </div>
          </div>

          {/* Cutoff Display Section */}
          {showCutoffs && displayedCutoffs.length > 0 && (
            <div className="mb-8 p-6 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border-2 border-emerald-200 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-emerald-900">
                  {isEN ? 'Cutoff Details' : 'கட்-ஆஃப் விவரங்கள்'}
                </h3>
                <button 
                  onClick={clearCutoffs}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md font-medium transition-colors duration-200"
                >
                  {isEN ? 'Close' : 'மூடு'}
                </button>
              </div>
              
              <div className="mb-4 p-4 bg-white rounded-lg border border-emerald-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {isEN ? 'College' : 'கல்லூரி'}: <span className="text-emerald-700">{lookup.college}</span>
                </h4>
                <div className="text-sm text-gray-600">
                  {isEN ? 'Year' : 'ஆண்டு'}: <span className="font-medium">{latestYear || 'All Years'}</span>
                  {lookup.course && (
                    <>
                      {' • '}
                      {isEN ? 'Course' : 'பாடநெறி'}: <span className="font-medium">{lookup.course}</span>
                    </>
                  )}
                  {lookup.community && (
                    <>
                      {' • '}
                      {isEN ? 'Community' : 'சமூகம்'}: <span className="font-medium">{lookup.community}</span>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayedCutoffs.map((cutoff, index) => (
                  <div key={index} className="bg-white rounded-lg p-6 border-2 border-emerald-200 shadow-md hover:shadow-lg transition-shadow duration-200">
                    <div className="text-center">
                      <div className="text-sm text-gray-600 mb-2">
                        {cutoff.course}
                      </div>
                      <div className="text-lg font-semibold text-emerald-700 mb-2">
                        {cutoff.category}
                      </div>
                      <div className="text-4xl font-extrabold text-emerald-900 mb-2">
                        {cutoff.cutoff !== null ? cutoff.cutoff.toFixed(2) : 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {isEN ? 'Year' : 'ஆண்டு'}: {cutoff.year}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {displayedCutoffs.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-500 text-lg">
                    {isEN ? 'No cutoff data found for the selected filters.' : 'தேர்ந்தெடுக்கப்பட்ட வடிகட்டிகளுக்கு கட்-ஆஃப் தரவு இல்லை.'}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 3) College Predictor (uses calculator or manual) */}
          <div className="mb-6 p-4 rounded-xl bg-purple-50 border border-purple-200">
            <div className="mb-4 text-purple-900 font-semibold">3) {isEN ? 'College Predictor' : 'கல்லூரி கணிப்பி'}</div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isEN ? 'Use calculator value' : 'கணக்குபடுத்தியின் மதிப்பு'}</label>
                <div className="flex items-center gap-3">
                  <input id="useCalc" type="checkbox" checked={predictor.useCalculator} onChange={(e)=>setPredictor(prev=>({...prev, useCalculator: e.target.checked}))} />
                  <label htmlFor="useCalc" className="text-sm text-gray-700">{cutoff.toFixed(2)}</label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isEN ? 'Or enter cutoff' : 'அல்லது கட்-ஆஃப் உள்ளிடவும்'}</label>
                <input type="number" inputMode="decimal" step="0.01" min="0" value={predictor.manualCutoff} onChange={(e)=>setPredictor(prev=>({...prev, manualCutoff: e.target.value}))} disabled={predictor.useCalculator} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder={isEN ? 'e.g., 195.75' : 'எ.கா., 195.75'} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isEN ? 'Preferred Course' : 'விருப்பமான பாடநெறி'}</label>
                <select value={predictor.course} onChange={(e)=>setPredictor(prev=>({...prev, course: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">{isEN ? 'Any Course' : 'எந்த பாடநெறியும்'}</option>
                  {predictorCourses.map(course => <option key={course} value={course}>{course}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{isEN ? 'Community' : 'சமூகம்'}</label>
                <select value={predictor.community} onChange={(e)=>setPredictor(prev=>({...prev, community: e.target.value}))} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                  <option value="">{isEN ? 'Any' : 'எதுவும்'}</option>
                  {communities.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                </select>
              </div>
              
            </div>
            <div className="flex justify-end mb-4">
              <button onClick={runPrediction} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md">{isEN ? 'Predict colleges' : 'கல்லூரிகளை கணிக்கவும்'}</button>
            </div>
          </div>

          {results.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {isEN ? 'Top 5 Predicted Colleges' : 'சிறந்த 5 கணிக்கப்பட்ட கல்லூரிகள்'}
              </h3>
              <div className="text-xs text-gray-600 mb-3">
                {(predictor.course || predictor.community || predictor.year) && (
                  <span>
                    {predictor.course && <span>{isEN ? 'Course' : 'பாடநெறி'}: {predictor.course} • </span>}
                    {predictor.community && <span>{isEN ? 'Community' : 'சமூகம்'}: {predictor.community} • </span>}
                    {predictor.year && <span>{isEN ? 'Year' : 'ஆண்டு'}: {predictor.year}</span>}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {results.map((i, idx) => (
                  <div key={i.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-600 text-white text-sm font-bold">{idx + 1}</span>
                        <div>
                          <div className="font-semibold text-gray-900">{i.name}</div>
                          <div className="text-sm text-gray-600">{i.location} • {i.type}</div>
                        </div>
                      </div>
                      {typeof i.nirfRank === 'number' && (
                        <span className="text-xs bg-purple-100 text-purple-800 border border-purple-200 px-2 py-1 rounded">NIRF #{i.nirfRank}</span>
                      )}
                    </div>
                    <div className="mt-3 flex items-center justify-between text-sm">
                      <div className="text-gray-700">
                        {isEN ? 'Required cutoff' : 'தேவையான கட்-ஆஃப்'}: <span className="font-semibold">{(i.requiredCutoff ?? 0).toFixed(2)}</span>
                      </div>
                      {predictor.course && (
                        <div className="text-xs text-gray-500">{isEN ? 'Course' : 'பாடநெறி'}: {predictor.course}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
                  </div>
      </div>
    </div>
  )
}


