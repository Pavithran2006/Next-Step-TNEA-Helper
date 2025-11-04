'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from './AuthContext'

export default function CollegeCard({ college }) {
  const [isExpanded, setIsExpanded] = useState(false)
  const { user, wishlist, addToWishlist, removeFromWishlist } = useAuth()
  const router = useRouter()

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  const isInWishlist = user && wishlist?.some((c) => c.id === college.id)

  const handleWishlist = () => {
    if (!user) {
      try { alert('Please login to add to wishlist. You will be redirected to login.'); } catch {}
      router.push('/login?redirect=/explorer')
      return
    }
    if (isInWishlist) {
      removeFromWishlist(college.id)
    } else {
      addToWishlist(college)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 pr-4">
          <h3 className="text-xl font-semibold text-gray-900 leading-tight mb-2">
            {college.name}
          </h3>
          <div className="flex items-center space-x-2 text-gray-600">
            <span className="text-sm">📍</span>
            <span className="text-sm">{college.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            aria-label={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            onClick={handleWishlist}
            className={`p-2 rounded-lg border transition-colors duration-200 ${
              isInWishlist 
                ? 'bg-red-50 text-red-500 border-red-200' 
                : 'bg-gray-50 text-gray-400 border-gray-200 hover:bg-red-50 hover:text-red-500'
            }`}
          >
            <span className="text-lg">
              {isInWishlist ? '❤️' : '🤍'}
            </span>
          </button>
          <span className={`px-3 py-1 text-xs font-medium rounded-md ${
            college.type === 'Government' 
              ? 'bg-green-100 text-green-800' 
              : college.type === 'Private'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-purple-100 text-purple-800'
          }`}>
            {college.type}
          </span>
        </div>
      </div>
      
      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-3">
            <span className="text-gray-500">🏆</span>
            <span className="text-sm text-gray-600">NIRF Rank</span>
          </div>
          <span className="text-sm font-medium text-gray-900">
            {college.nirfRank != null ? `#${college.nirfRank}` : "Not Ranked"}
          </span>
        </div>
        
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center space-x-3">
            <span className="text-gray-500">🔢</span>
            <span className="text-sm text-gray-600">College Code</span>
          </div>
          <span className="text-sm font-medium text-gray-900">{college.collegeCode}</span>
        </div>
      </div>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            college.autonomy === 'Autonomous' 
              ? 'bg-purple-100 text-purple-800' 
              : 'bg-orange-100 text-orange-800'
          }`}>
            {college.autonomy}
          </span>
          {college.transportation === 'Available' && (
            <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
              🚌 Transport
            </span>
          )}
        </div>
        
        <button
          onClick={toggleExpanded}
          className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
        >
          <span>{isExpanded ? '👁️ Show Less' : '🔍 Know More'}</span>
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
          {/* Transportation */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-3">
              <span className="text-gray-500">🚌</span>
              <span className="text-sm text-gray-600">Transportation</span>
            </div>
            <span className="text-sm font-medium text-gray-900">{college.transportation}</span>
          </div>

          {/* All Courses */}
          <div>
            <h4 className="text-base font-semibold text-gray-900 mb-3 flex items-center">
              <span className="mr-2">📚</span>
              Available Courses
            </h4>
            <div className="space-y-2">
              {college.courses.map((course, index) => (
                <div 
                  key={index}
                  className="flex items-center space-x-3 p-2 bg-gray-50 rounded-md"
                >
                  <span className="w-6 h-6 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <span className="text-sm text-gray-800">
                    {course}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Website */}
          {college.website && (
            <div className="pt-3">
              <a 
                href={college.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors duration-200"
              >
                <span>🌐</span>
                <span>Visit Official Website</span>
                <span>→</span>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
