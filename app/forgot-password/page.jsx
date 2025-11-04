'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage('Password reset instructions have been sent to your email address.')
        setEmail('')
      } else {
        setError(data.error || 'Failed to send reset email')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-12">
      <div className="glass-effect-premium rounded-2xl shadow-xl p-8 w-full max-w-md fade-in">
        <div className="text-center mb-6 slide-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 gradient-text">Forgot Password</h1>
          <p className="text-gray-600">
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {message && (
          <div className="mb-4 alert-success bounce-in">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 alert-error bounce-in">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="form-input" 
              placeholder="Enter your email address"
            />
          </div>
          
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full btn-primary text-lg py-3 hover-tilt disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <div className="loading-spinner w-5 h-5 mr-2"></div>
                Sending...
              </span>
            ) : (
              'Send Reset Instructions'
            )}
          </button>
        </form>

        <div className="mt-6 text-center space-y-3">
          <p className="text-sm text-gray-600">
            Remember your password?{' '}
            <Link href="/login" className="link-hover-bold text-blue-600 hover:text-blue-800">
              Back to Login
            </Link>
          </p>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link href="/signup" className="link-hover-bold text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
