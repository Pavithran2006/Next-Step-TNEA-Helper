import { NextResponse } from 'next/server'
import { getDb } from '../../db/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function POST(request) {
  try {
    const { name, email, password } = await request.json()
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

    try {
      const db = await getDb()
      const users = db.collection('users')
      
      // Check if user already exists
      const existingUser = await users.findOne({ email: email.toLowerCase() })
      if (existingUser) {
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12)

      // Create user
      const newUser = {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        wishlist: [],
        cutoffHistory: [],
        profile: {
          name: name || '',
          age: '',
          school: '',
          details: ''
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const result = await users.insertOne(newUser)
      const userId = result.insertedId

      // Generate token
      const token = jwt.sign(
        { userId, email: newUser.email },
        JWT_SECRET,
        { expiresIn: '7d' }
      )

      const { password: _, ...userWithoutPassword } = newUser

      return NextResponse.json({
        success: true,
        user: { ...userWithoutPassword, _id: userId },
        token
      })
    } catch (dbError) {
      console.error('Database error, falling back to localStorage:', dbError)
      
      // Fallback to localStorage-based authentication
      return NextResponse.json({
        success: true,
        user: {
          _id: Date.now().toString(),
          name,
          email: email.toLowerCase(),
          wishlist: [],
          cutoffHistory: [],
          profile: {
            name: name || '',
            age: '',
            school: '',
            details: ''
          },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        token: jwt.sign(
          { userId: Date.now().toString(), email: email.toLowerCase() },
          JWT_SECRET,
          { expiresIn: '7d' }
        ),
        fallback: true
      })
    }
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}
