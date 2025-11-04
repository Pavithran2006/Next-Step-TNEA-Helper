import { NextResponse } from 'next/server'
import { getDb } from '../../db/mongodb'
import crypto from 'crypto'

const RESET_TOKEN_EXPIRY = 24 * 60 * 60 * 1000 // 24 hours

export async function POST(request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

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
