# Authentication Setup Guide

## Overview
The application now includes a complete authentication system with backend integration, including:
- User login/signup with MongoDB backend
- Password reset functionality
- JWT token-based authentication
- Secure password hashing

## Required Dependencies
Install the new dependencies:
```bash
npm install bcryptjs jsonwebtoken
```

## Environment Variables
Create a `.env.local` file in the root directory with:
```
MONGODB_URI=mongodb://localhost:27017/nextstep
JWT_SECRET=your-super-secret-jwt-key-change-in-production
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Database Setup
The authentication system uses MongoDB collections:
- `users` - stores user accounts
- `resetTokens` - stores password reset tokens

## Features Added

### 1. Forgot Password Page (`/forgot-password`)
- Users can request password reset by email
- Generates secure reset tokens
- Sends reset links (currently logged to console for development)

### 2. Reset Password Page (`/reset-password`)
- Users can reset password using token from email
- Validates token expiration (24 hours)
- Secure password hashing

### 3. Backend API Routes
- `/api/auth/login` - User authentication
- `/api/auth/signup` - User registration
- `/api/auth/forgot-password` - Password reset request
- `/api/auth/reset-password` - Password reset confirmation

### 4. Updated Authentication Context
- Now uses backend API instead of localStorage
- JWT token management
- Automatic token storage and cleanup

## Security Features
- Password hashing with bcryptjs
- JWT token authentication
- Secure reset token generation
- Token expiration handling
- Input validation and sanitization

## Development Notes
- Password reset links are logged to console in development
- In production, integrate with email service (SendGrid, AWS SES, etc.)
- Change JWT_SECRET in production
- Use HTTPS in production

## Usage
1. Users can sign up with name, email, and password
2. Login with email and password
3. Use "Forgot Password" link on login page
4. Check console for reset link in development
5. Complete password reset process

The system maintains backward compatibility with existing localStorage functionality while providing a robust backend authentication system.
