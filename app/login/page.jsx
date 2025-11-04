'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useAuth } from '../../components/AuthContext'

export default function LoginPage() {
  const { login, user } = useAuth()
  const router = useRouter()
  const params = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (user) {
      router.push('/profile')
    }
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    try {
      await login(email.trim(), password)
      const redirectTo = params.get('redirect') || '/profile'
      try { alert('Logged in successfully.'); } catch {}
      router.push(redirectTo)
    } catch (err) {
      setError(err.message || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-12">
      <div className="glass-effect-premium rounded-2xl shadow-xl p-8 w-full max-w-md fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 gradient-text text-center">Login</h1>
        {error && (
          <div className="mb-4 alert-error bounce-in">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="form-input" 
              placeholder="Enter your email address"
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="form-input" 
              placeholder="Enter your password"
            />
          </div>
          <button type="submit" className="w-full btn-primary text-lg py-3 hover-tilt">Login</button>
        </form>
        <div className="mt-6 space-y-3">
          <p className="text-sm text-gray-600 text-center">
            <Link href="/forgot-password" className="link-hover-bold text-blue-600 hover:text-blue-800">
              Forgot your password?
            </Link>
          </p>
          <p className="text-sm text-gray-600 text-center">
            No account? <Link href="/signup" className="link-hover-bold text-blue-600 hover:text-blue-800">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}


