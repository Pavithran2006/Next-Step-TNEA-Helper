import { NextResponse } from 'next/server'
import { getDb } from '../../db/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })
    }

    try {
      const db = await getDb()
      const users = db.collection('users')
      
      const user = await users.findOne({ email: email.toLowerCase() })
      if (!user) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const isValidPassword = await bcrypt.compare(password, user.password)
      if (!isValidPassword) {
        return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
      }

      const token = jwt.sign(
        { userId: user._id, email: user.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        token
      })
    } catch (dbError) {
      console.error('Database error, falling back to localStorage:', dbError)
      
      // Fallback to localStorage-based authentication
      // This is a simplified fallback - in production, you'd want proper error handling
      return NextResponse.json({ 
        error: 'Database connection failed. Please try again later or contact support.' 
      }, { status: 503 })
    }
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
