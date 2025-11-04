'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../components/AuthContext'

export default function SignupPage() {
  const { signup, user } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
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
      await signup(name.trim(), email.trim(), password)
      router.push('/profile')
    } catch (err) {
      setError(err.message || 'Signup failed')
    }
  }

  return (
    <div className="min-h-screen animated-bg flex items-center justify-center px-4 py-12">
      <div className="glass-effect-premium rounded-2xl shadow-xl p-8 w-full max-w-md fade-in">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 gradient-text-accent text-center">Sign Up</h1>
        {error && (
          <div className="mb-4 alert-error bounce-in">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="form-group">
            <label className="form-label">Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="form-input" 
              placeholder="Enter your full name"
            />
          </div>
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
              placeholder="Create a strong password"
            />
          </div>
          <button type="submit" className="w-full btn-success text-lg py-3 hover-tilt">Create account</button>
        </form>
        <p className="text-sm text-gray-600 mt-6 text-center">
          Already have an account? <Link href="/login" className="link-hover-bold text-blue-600 hover:text-blue-800">Login</Link>
        </p>
      </div>
    </div>
  )
}


