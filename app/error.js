'use client'
import './globals.css'

export default function Error({ error, reset }) {
  return (
    <div style={{ minHeight: '60vh' }} className="flex flex-col items-center justify-center p-8 text-center">
      <h2 className="text-2xl font-bold text-red-700 mb-2">Something went wrong</h2>
      <p className="text-gray-700 max-w-xl mb-6">
        {error?.message || 'An unexpected error occurred while rendering this page.'}
      </p>
      <button
        onClick={() => reset?.()}
        className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md"
      >
        Try again
      </button>
    </div>
  )
}


