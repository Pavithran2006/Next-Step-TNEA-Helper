'use client'

import { useState, useEffect } from 'react'
import CollegeCard from '../../components/CollegeCard'
import { useLanguage } from '../../components/LanguageContext'

export default function CollegeExplorer() {
  const { lang } = useLanguage()
  const isEN = lang === 'en'
  const [colleges, setColleges] = useState([])
  const [filteredColleges, setFilteredColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    course: '',
    location: '',
    type: '',
    nirfRankRange: '',
    transportation: ''
  })

  useEffect(() => {
    fetchColleges()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [colleges, searchTerm, filters])

  const fetchColleges = async () => {
    try {
      let data
      try {
        const response = await fetch('/api/institutions?include=colleges', { cache: 'no-store' })
        const payload = await response.json()
        if (payload?.ok && Array.isArray(payload.data)) {
          data = payload.data
        }
      } catch {}
      if (!data) {
        const response = await fetch('/data/colleges.json')
        data = await response.json()
      }
      setColleges(data)
      setFilteredColleges(data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching colleges:', error)
      setLoading(false)
    }
  }

  const applyFilters = () => {
    let filtered = colleges

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Course filter
    if (filters.course) {
      filtered = filtered.filter(college =>
        college.courses.some(course =>
          course.toLowerCase().includes(filters.course.toLowerCase())
        )
      )
    }

    // Location filter
    if (filters.location) {
      filtered = filtered.filter(college =>
        college.location.toLowerCase().includes(filters.location.toLowerCase())
      )
    }

    // Type filter
    if (filters.type) {
      filtered = filtered.filter(college =>
        college.type === filters.type
      )
    }

    if(filters.transportation) {
      filtered = filtered.filter(college =>
        college.transportation === filters.transportation
      )
    }

    // NIRF Rank filter
    if (filters.nirfRankRange) {
      const [min, max] = filters.nirfRankRange.split('-').map(Number)
      filtered = filtered.filter(college =>
        college.nirfRank >= min && college.nirfRank <= max
      )
    }

    setFilteredColleges(filtered)
  }

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }))
  }

  const clearFilters = () => {
    setSearchTerm('')
    setFilters({
      course: '',
      location: '',
      type: '',
      nirfRankRange: '',
      transportation: ''
    })
  }

  // Get unique values for filter options
  const uniqueLocations = [...new Set(colleges.map(c => c.location))].sort()
  const uniqueCourses = [...new Set(colleges.flatMap(c => c.courses))].sort()

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">
            {isEN ? 'Loading colleges...' : 'கல்லூரிகள் ஏற்றப்படுகிறது...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-6">
            <span className="text-2xl text-white">🏫</span>
          </div>
          <h1 className="text-4xl font-bold mb-4 text-gray-900">
            {isEN ? 'College Explorer' : 'கல்லூரி ஆராய்ச்சி'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {isEN
              ? 'Discover and explore engineering colleges across Tamil Nadu with detailed information and filtering options'
              : 'தமிழ்நாட்டில் உள்ள பொறியியல் கல்லூரிகளை விரிவான தகவல்கள் மற்றும் வடிகட்டி விருப்பங்களுடன் ஆராயுங்கள்'}
          </p>
          <div className="mt-6 flex justify-center space-x-6">
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
              <span className="text-sm">{colleges.length} Colleges</span>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <span className="w-2 h-2 bg-green-600 rounded-full"></span>
              <span className="text-sm">Real-time Data</span>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-12">
          {/* Search Bar */}
          <div className="mb-8">
            <label htmlFor="search" className="block text-lg font-semibold text-gray-800 mb-3">
              {isEN ? '🔍 Search Colleges' : '🔍 கல்லூரிகளை தேடுங்கள்'}
            </label>
            <input
              type="text"
              id="search"
              placeholder={isEN ? 'Search by college name or location...' : 'கல்லூரி பெயர் அல்லது இடம் மூலம் தேடுங்கள்...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-base transition-colors duration-200"
            />
          </div>

          {/* Filters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {/* Course Filter */}
            <div>
              <label htmlFor="course" className="block text-sm font-medium text-gray-700 mb-2">
                {isEN ? '📚 Course' : '📚 பாடநெறி'}
              </label>
              <select
                id="course"
                value={filters.course}
                onChange={(e) => handleFilterChange('course', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
              >
                <option value="">{isEN ? 'All Courses' : 'அனைத்து பாடநெறிகள்'}</option>
                {uniqueCourses.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            {/* Location Filter */}
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                {isEN ? '📍 Location' : '📍 இடம்'}
              </label>
              <select
                id="location"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
              >
                <option value="">{isEN ? 'All Locations' : 'அனைத்து இடங்கள்'}</option>
                {uniqueLocations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
            </div>

            {/* Type Filter */}
            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                {isEN ? '🏛️ College Type' : '🏛️ கல்லூரி வகை'}
              </label>
              <select
                id="type"
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
              >
                <option value="">{isEN ? 'All Types' : 'அனைத்து வகைகள்'}</option>
                <option value="Government">{isEN ? 'Government' : 'அரசு'}</option>
                <option value="Private">{isEN ? 'Private' : 'தனியார்'}</option>
                <option value="Government Aided">{isEN ? 'Government Aided' : 'அரசு உதவிபெற்ற'}</option>
              </select>
            </div>

            {/* NIRF Rank Filter */}
            <div>
              <label htmlFor="nirf" className="block text-sm font-medium text-gray-700 mb-2">
                {isEN ? '🏆 NIRF Rank' : '🏆 NIRF தரவரிசை'}
              </label>
              <select
                id="nirf"
                value={filters.nirfRankRange}
                onChange={(e) => handleFilterChange('nirfRankRange', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
              >
                <option value="">{isEN ? 'All Ranks' : 'அனைத்து தரவரிசைகள்'}</option>
                <option value="1-50">1-50</option>
                <option value="51-100">51-100</option>
                <option value="101-150">101-150</option>
                <option value="151-200">151-200</option>
              </select>
            </div>

            {/* Transportation Filter */}
            <div>
              <label htmlFor="transportation" className="block text-sm font-medium text-gray-700 mb-2">
                {isEN ? '🚗 Transportation' : '🚗 போக்குவரத்து'}
              </label>
              <select
                id="transportation"
                value={filters.transportation}
                onChange={(e) => handleFilterChange('transportation', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm transition-colors duration-200"
              >
                <option value="">{isEN ? 'All Transportation' : 'அனைத்து போக்குவரத்து'}</option>
                <option value="Available">{isEN ? 'Available' : 'உள்ளது'}</option>
                <option value="Not Available">{isEN ? 'Not Available' : 'இல்லை'}</option>
              </select>
            </div>
          </div>

          {/* Clear Filters Button */}
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-lg">📊</span>
                <span className="text-sm font-medium">
                  {isEN
                    ? `Showing ${filteredColleges.length} of ${colleges.length} colleges`
                    : `${colleges.length} கல்லூரிகளில் ${filteredColleges.length} காட்சிப்படுத்தப்படுகிறது`}
                </span>
              </div>
              {filteredColleges.length !== colleges.length && (
                <div className="flex items-center space-x-2 text-orange-600">
                  <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                  <span className="text-sm font-medium">
                    {isEN ? 'Filters Active' : 'வடிகட்டிகள் செயலில்'}
                  </span>
                </div>
              )}
            </div>
            <button
              onClick={clearFilters}
              className="flex items-center space-x-2 text-red-600 hover:text-red-800 text-sm font-medium transition-colors duration-200"
            >
              <span>🗑️</span>
              <span>{isEN ? 'Clear All Filters' : 'அனைத்து வடிகட்டிகளையும் அழிக்கவும்'}</span>
            </button>
          </div>
        </div>

        {/* Results */}
        {filteredColleges.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-400 text-6xl mb-6">🏫</div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              {isEN ? 'No colleges found' : 'கல்லூரிகள் எதுவும் கிடைக்கவில்லை'}
            </h3>
            <p className="text-gray-600 mb-6">
              {isEN 
                ? 'Try adjusting your search criteria or clearing filters to find more colleges' 
                : 'மேலும் கல்லூரிகளைக் கண்டறிய உங்கள் தேடல் அளவுகோலை மாற்றவும் அல்லது வடிகட்டிகளை அழிக்கவும் முயற்சிக்கவும்'}
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md text-sm font-medium transition-colors duration-200"
            >
              {isEN ? '🔄 Reset Filters' : '🔄 வடிகட்டிகளை மீட்டமைக்கவும்'}
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {isEN ? '🎓 Discover Your Perfect College' : '🎓 உங்கள் சரியான கல்லூரியைக் கண்டறியுங்கள்'}
              </h2>
              <p className="text-gray-600">
                {isEN 
                  ? 'Browse through our curated list of engineering colleges with detailed information'
                  : 'விரிவான தகவல்களுடன் எங்கள் பொறியியல் கல்லூரிகளின் தேர்ந்தெடுக்கப்பட்ட பட்டியலைப் பாருங்கள்'}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredColleges.map((college, index) => (
                <CollegeCard key={college.id} college={college} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
