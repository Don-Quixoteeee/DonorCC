// Authentication API - User Login
import { NextResponse } from 'next/server'
import { login } from '@/lib/auth'
import { createSession } from '@/lib/session'

export async function POST(request) {
  try {
    const body = await request.json()
    const { email, password } = body || {}
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await login(email, password)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    const token = await createSession(user.id)

    const res = NextResponse.json({ success: true })
    // Set HTTP-only cookie for session
    res.cookies.set('donor_session', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })

    return res
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}