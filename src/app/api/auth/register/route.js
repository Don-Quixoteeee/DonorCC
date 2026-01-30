// Authentication API - User Registration
import { NextResponse } from 'next/server'
import { register } from '@/lib/auth'

export async function POST(request) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, password, organizationId, organizationName } = body || {}
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
    }

    const user = await register({ firstName, lastName, email, password, organizationId, organizationName })

    // Auto-login: create session and set cookie
    const { createSession } = await import('@/lib/session')
    const token = await createSession(user.id)
    const res = NextResponse.json({ success: true, user })
    res.cookies.set('donor_session', token, { httpOnly: true, path: '/', sameSite: 'lax', maxAge: 60 * 60 * 24 * 7 })
    return res
  } catch (error) {
    if (error.message && error.message.includes('exists')) {
      return NextResponse.json({ error: error.message }, { status: 409 })
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}