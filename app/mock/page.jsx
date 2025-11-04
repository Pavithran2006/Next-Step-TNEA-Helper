'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import jsPDF from 'jspdf'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../components/AuthContext'

export default function MockChoiceFill() {
  const { user } = useAuth()
  const router = useRouter()
  const [colleges, setColleges] = useState([])
  const [selectedChoices, setSelectedChoices] = useState([])
  const [availableColleges, setAvailableColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    collegeCode: '',
    branchName: '',
    district: '',
    category: '',
    collegeName: '',
    course: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [isReorderMode, setIsReorderMode] = useState(false)

  useEffect(() => {
    if (!user) {
      try { alert('Please login to use Mock Choice Fill.'); } catch {}
      router.push('/login?redirect=/mock')
      return
    }
    // Enforce mandatory community in profile
    if (!user.profile?.community) {
      try { alert('Please fill your profile details (community) to proceed.'); } catch {}
      router.push('/profile?require=community')
      return
    }
    fetchColleges()
    loadSavedChoices()
  }, [user])

  useEffect(() => {
    filterAvailableColleges()
    setCurrentPage(1) // Reset to first page when filters change
  }, [colleges, selectedChoices, searchTerm, filters])

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
      setLoading(false)
    } catch (error) {
      console.error('Error fetching colleges:', error)
      setLoading(false)
    }
  }

  const loadSavedChoices = () => {
    const keyPrefix = user?.email ? `ns:${user.email}:` : 'ns:anon:'
    // Migrate legacy global key to per-user key if present
    const legacy = localStorage.getItem('tnea-mock-choices')
    const perUserKey = `${keyPrefix}mock-choices`
    if (legacy && !localStorage.getItem(perUserKey)) {
      localStorage.setItem(perUserKey, legacy)
      localStorage.removeItem('tnea-mock-choices')
    }
    const saved = localStorage.getItem(perUserKey)
    if (saved) {
      setSelectedChoices(JSON.parse(saved))
    }
  }

  const saveChoices = (choices) => {
    const keyPrefix = user?.email ? `ns:${user.email}:` : 'ns:anon:'
    localStorage.setItem(`${keyPrefix}mock-choices`, JSON.stringify(choices))
    setSelectedChoices(choices)
  }

  const filterAvailableColleges = () => {
    let available = colleges

    // Search term filter - Enhanced search for college name and course
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      available = available.filter(college => {
        // Search in college name
        if (college.name.toLowerCase().includes(searchLower)) return true
        
        // Search in location
        if (college.location.toLowerCase().includes(searchLower)) return true
        
        // Search in college code
        if (college.collegeCode.toLowerCase().includes(searchLower)) return true
        
        // Search in course names
        if (college.courses.some(course => 
          course.toLowerCase().includes(searchLower)
        )) return true
        
        // Search in college type
        if (college.type && college.type.toLowerCase().includes(searchLower)) return true
        
        return false
      })
    }

    // College Code filter
    if (filters.collegeCode) {
      available = available.filter(college =>
        college.collegeCode.toLowerCase().includes(filters.collegeCode.toLowerCase())
      )
    }

    // Branch Name filter
    if (filters.branchName) {
      available = available.filter(college =>
        college.courses.some(course =>
          course.toLowerCase().includes(filters.branchName.toLowerCase())
        )
      )
    }

    // District filter (using location)
    if (filters.district) {
      available = available.filter(college =>
        college.location.toLowerCase().includes(filters.district.toLowerCase())
      )
    }

    // Category filter (using type)
    if (filters.category) {
      available = available.filter(college =>
        college.type.toLowerCase().includes(filters.category.toLowerCase())
      )
    }

    // College Name filter
    if (filters.collegeName) {
      available = available.filter(college =>
        college.name.toLowerCase().includes(filters.collegeName.toLowerCase())
      )
    }

    // Course filter
    if (filters.course) {
      available = available.filter(college =>
        college.courses.some(course =>
          course.toLowerCase().includes(filters.course.toLowerCase())
        )
      )
    }

    setAvailableColleges(available)
  }

  const addToChoices = (college, course) => {
    const keyPrefix = user?.email ? `ns:${user.email}:` : 'ns:anon:'
    const locked = localStorage.getItem(`${keyPrefix}mock-choices-locked`) === 'true'
    if (locked) {
      try { alert('Your choices are locked and cannot be modified.'); } catch {}
      return
    }
    const newChoice = {
      id: `${college.id}-${course}`,
      college,
      course,
      priority: selectedChoices.length + 1
    }
    const updatedChoices = [...selectedChoices, newChoice]
    saveChoices(updatedChoices)
  }

  const removeFromChoices = (choiceId) => {
    const keyPrefix = user?.email ? `ns:${user.email}:` : 'ns:anon:'
    const locked = localStorage.getItem(`${keyPrefix}mock-choices-locked`) === 'true'
    if (locked) {
      try { alert('Your choices are locked and cannot be modified.'); } catch {}
      return
    }
    const updatedChoices = selectedChoices
      .filter(choice => choice.id !== choiceId)
      .map((choice, index) => ({ ...choice, priority: index + 1 }))
    saveChoices(updatedChoices)
  }

  const moveChoiceUp = (index) => {
    if (index === 0) return
    const newChoices = [...selectedChoices]
    const temp = newChoices[index]
    newChoices[index] = newChoices[index - 1]
    newChoices[index - 1] = temp
    
    const updatedChoices = newChoices.map((choice, idx) => ({
      ...choice,
      priority: idx + 1
    }))
    saveChoices(updatedChoices)
  }

  const moveChoiceDown = (index) => {
    if (index === selectedChoices.length - 1) return
    const newChoices = [...selectedChoices]
    const temp = newChoices[index]
    newChoices[index] = newChoices[index + 1]
    newChoices[index + 1] = temp
    
    const updatedChoices = newChoices.map((choice, idx) => ({
      ...choice,
      priority: idx + 1
    }))
    saveChoices(updatedChoices)
  }

  const onDragEnd = (result) => {
    if (!result.destination) return

    const { source, destination } = result

    if (source.droppableId === 'selected' && destination.droppableId === 'selected') {
      // Respect lock if set in choices page
      const keyPrefix = user?.email ? `ns:${user.email}:` : 'ns:anon:'
      const locked = localStorage.getItem(`${keyPrefix}mock-choices-locked`) === 'true'
      if (locked) return
      const reorderedChoices = Array.from(selectedChoices)
      const [removed] = reorderedChoices.splice(source.index, 1)
      reorderedChoices.splice(destination.index, 0, removed)

      const updatedChoices = reorderedChoices.map((choice, index) => ({
        ...choice,
        priority: index + 1
      }))

      saveChoices(updatedChoices)
    }
  }

  const resetChoices = () => {
    const keyPrefix = user?.email ? `ns:${user.email}:` : 'ns:anon:'
    localStorage.removeItem(`${keyPrefix}mock-choices`)
    setSelectedChoices([])
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
      collegeCode: '',
      branchName: '',
      district: '',
      category: '',
      collegeName: '',
      course: ''
    })
  }

  // Pagination logic
  const getPaginatedData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return availableColleges.slice(startIndex, endIndex)
  }

  const getTotalPages = () => {
    return Math.ceil(availableColleges.length / itemsPerPage)
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (newItemsPerPage) => {
    setItemsPerPage(newItemsPerPage)
    setCurrentPage(1) // Reset to first page
  }

  // Generate mock seat availability data
  const getSeatAvailability = (college, course) => {
    // Mock community-wise seat availability
    const randomSeed = Math.abs((college.id + course).split('').reduce((a, c) => a + c.charCodeAt(0), 0))
    const total = 60 + (randomSeed % 40)
    const allocations = {
      OC: Math.floor(total * 0.3),
      BC: Math.floor(total * 0.3),
      MBC: Math.floor(total * 0.2),
      SC: Math.floor(total * 0.18),
      ST: Math.max(0, total - (Math.floor(total * 0.3) + Math.floor(total * 0.3) + Math.floor(total * 0.2) + Math.floor(total * 0.18)))
    }
    const available = Object.fromEntries(Object.entries(allocations).map(([k, v]) => [k, Math.max(0, Math.floor(v - (randomSeed % (v + 1))))]))
    return { total, available }
  }

  // Get unique values for filter options
  const uniqueDistricts = [...new Set(colleges.map(c => c.location))].sort()
  const uniqueCategories = [...new Set(colleges.map(c => c.type))].sort()
  const uniqueBranches = [...new Set(colleges.flatMap(c => c.courses))].sort()

  const exportToPDF = () => {
    const doc = new jsPDF()
    
    // Title
    doc.setFontSize(20)
    doc.text('TNEA Mock Choice Filling', 20, 30)
    
    // Subtitle
    doc.setFontSize(12)
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 45)
    doc.text(`Total Choices: ${selectedChoices.length}`, 20, 55)
    
    // Choices list
    doc.setFontSize(14)
    doc.text('Choice Order:', 20, 75)
    
    let y = 90
    selectedChoices.forEach((choice, index) => {
      if (y > 270) {
        doc.addPage()
        y = 30
      }
      
      doc.setFontSize(10)
      doc.text(`${index + 1}. ${choice.college.name}`, 25, y)
      doc.text(`   Course: ${choice.course}`, 25, y + 10)
      doc.text(`   Location: ${choice.college.location}`, 25, y + 20)
      doc.text(`   Type: ${choice.college.type}`, 25, y + 30)
      
      y += 45
    })
    
    doc.save('tnea-mock-choices.pdf')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading colleges...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mock Choice Filling</h1>
          <p className="text-gray-600">
            Practice your TNEA choice filling by filtering colleges and selecting your preferences
          </p>
        </div>
        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          {/* Search Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Colleges & Courses:
                </label>
                <input
                  type="text"
                  placeholder="Search by college name or course name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => setSearchTerm('')}
                  className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors duration-200"
                >
                  Clear Search
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
            {/* College Code Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                College Code:
              </label>
              <select
                value={filters.collegeCode}
                onChange={(e) => handleFilterChange('collegeCode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select College Code</option>
                {[...new Set(colleges.map(c => c.collegeCode))].sort().map(code => (
                  <option key={code} value={code}>{code}</option>
                ))}
              </select>
        </div>

            {/* Branch Name Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Branch Name:
              </label>
              <select
                value={filters.branchName}
                onChange={(e) => handleFilterChange('branchName', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Branch Name</option>
                {uniqueBranches.map(branch => (
                  <option key={branch} value={branch}>{branch}</option>
                ))}
              </select>
            </div>

            {/* District Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                District:
              </label>
              <select
                value={filters.district}
                onChange={(e) => handleFilterChange('district', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select District</option>
                {uniqueDistricts.map(district => (
                  <option key={district} value={district}>{district}</option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category:
              </label>
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Category</option>
                {uniqueCategories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            {/* Course Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Course:
              </label>
              <select
                value={filters.course}
                onChange={(e) => handleFilterChange('course', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              >
                <option value="">Select Course</option>
                {uniqueBranches.map(course => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-green-600 font-medium">Changes are auto saved.</span>
              <button
                onClick={() => router.push('/choices')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <span>📋</span>
                <span>Reorder my choices</span>
              </button>
            </div>
          </div>
        </div>

        {/* Course Selection Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Select</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Choice order</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">College Code</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">College Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">Branch Name</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-gray-700">Seat Availability (Your: {user?.profile?.community || '—'})</th>
                </tr>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th className="px-4 py-2 text-center text-xs font-medium text-gray-600">
                    {(() => {
                      const comm = user?.profile?.community || 'OC'
                      const keys = comm === 'OC' ? ['OC'] : ['OC', comm]
                      const cols = keys.length
                      return (
                        <div className={`grid ${cols === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                          {keys.map((k) => (
                            <span key={k}>{k}</span>
                          ))}
                        </div>
                      )
                    })()}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {availableColleges.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-4 py-8 text-center text-gray-500">
                      No colleges found matching your criteria
                    </td>
                  </tr>
                ) : (
                  getPaginatedData().flatMap(college => 
                    college.courses.map(course => {
                      const seatInfo = getSeatAvailability(college, course)
                      const isSelected = selectedChoices.some(choice => 
                        choice.college.id === college.id && choice.course === course
                      )
                      const selectedChoice = selectedChoices.find(choice => 
                        choice.college.id === college.id && choice.course === course
                      )
                      
                      return (
                        <tr key={`${college.id}-${course}`} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {
                                if (isSelected) {
                                  removeFromChoices(selectedChoice.id)
                                } else {
                                  addToChoices(college, course)
                                }
                              }}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {selectedChoice ? selectedChoice.priority : ''}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {college.collegeCode}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900 max-w-xs">
                            <div className="truncate" title={college.name}>
                              {college.name}
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {course}
                          </td>
                          <td className="px-4 py-3">
                            {(() => {
                              const comm = user?.profile?.community || 'OC'
                              const keys = comm === 'OC' ? ['OC'] : ['OC', comm]
                              const cols = keys.length
                              return (
                                <div className={`grid ${cols === 2 ? 'grid-cols-2' : 'grid-cols-1'} gap-2 text-center`}>
                                  {keys.map((k) => {
                                    const value = seatInfo.available[k] ?? 0
                                    const isUser = (k === comm)
                                    return (
                                      <span key={k} className={`text-sm ${value === 0 ? 'text-red-600' : isUser ? 'font-semibold text-blue-700' : 'text-gray-900'}`}>{value}</span>
                                    )
                                  })}
                                </div>
                              )
                            })()}
                          </td>
                        </tr>
                      )
                    })
                  )
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination Controls */}
          {availableColleges.length > 0 && (
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                {/* Items per page selector */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-700">Show:</span>
                  <select
                    value={itemsPerPage}
                    onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                    className="text-sm border border-gray-300 rounded px-2 py-1 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value={5}>5</option>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                  </select>
                  <span className="text-sm text-gray-700">per page</span>
                  </div>

                {/* Page info */}
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, availableColleges.length)} of {availableColleges.length} colleges
                </div>

                {/* Pagination buttons */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                      currentPage === 1
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  {/* Page numbers */}
                  {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                        page === currentPage
                          ? 'bg-blue-600 text-white'
                          : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === getTotalPages()}
                    className={`px-3 py-1 text-sm rounded-md transition-colors duration-200 ${
                      currentPage === getTotalPages()
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          )}
          </div>

        {/* My Choices List moved to /choices page */}
      </div>
    </div>
  )
}
