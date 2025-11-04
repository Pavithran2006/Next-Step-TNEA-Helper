import { NextResponse } from 'next/server'
import { getDb } from '../db/mongodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const RESET_TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

export async function POST(request) {
  try {
    const { action, ...data } = await request.json()
    
    switch (action) {
      case 'login':
        return await handleLogin(data)
      case 'signup':
        return await handleSignup(data)
      case 'forgot-password':
        return await handleForgotPassword(data)
      case 'reset-password':
        return await handleResetPassword(data)
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
  } catch (error) {
    console.error('Auth API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function handleLogin({ email, password }) {
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
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}

async function handleSignup({ name, email, password }) {
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
  } catch (error) {
    console.error('Signup error:', error)
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}

async function handleForgotPassword({ email }) {
  try {
    const db = await getDb()
    const users = db.collection('users')
    const resetTokens = db.collection('resetTokens')
    
    const user = await users.findOne({ email: email.toLowerCase() })
    if (!user) {
      // Don't reveal if user exists or not for security
      return NextResponse.json({ 
        success: true, 
        message: 'If an account with that email exists, we have sent a password reset link.' 
      })
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + RESET_TOKEN_EXPIRY)

    // Store reset token
    await resetTokens.insertOne({
      token: resetToken,
      userId: user._id,
      email: user.email,
      expiresAt,
      createdAt: new Date()
    })

    // In a real application, you would send an email here
    // For now, we'll just log the reset link for development
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`
    console.log(`Password reset link for ${email}: ${resetLink}`)

    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Failed to process request' }, { status: 500 })
  }
}

async function handleResetPassword({ token, password }) {
  try {
    const db = await getDb()
    const users = db.collection('users')
    const resetTokens = db.collection('resetTokens')
    
    // Find and validate reset token
    const resetTokenDoc = await resetTokens.findOne({ token })
    if (!resetTokenDoc) {
      return NextResponse.json({ error: 'Invalid or expired reset token' }, { status: 400 })
    }

    if (resetTokenDoc.expiresAt < new Date()) {
      // Clean up expired token
      await resetTokens.deleteOne({ token })
      return NextResponse.json({ error: 'Reset token has expired' }, { status: 400 })
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Update user password
    await users.updateOne(
      { _id: resetTokenDoc.userId },
      { 
        $set: { 
          password: hashedPassword,
          updatedAt: new Date()
        }
      }
    )

    // Delete used reset token
    await resetTokens.deleteOne({ token })

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully'
    })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 })
  }
}
