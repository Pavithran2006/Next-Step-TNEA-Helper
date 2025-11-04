import { NextResponse } from 'next/server'
import { getDb } from '../../db/mongodb'
import bcrypt from 'bcryptjs'

export async function POST(request) {
  try {
    const { token, password } = await request.json()
    
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 })
    }

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
