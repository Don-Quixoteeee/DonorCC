// Authentication API - User Logout
import { NextResponse } from 'next/server'
import { deleteSession } from '@/lib/session'

export async function POST(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const match = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('donor_session='))
    const token = match ? match.split('=')[1] : null
    if (token) {
      await deleteSession(token)
    }

    const res = NextResponse.json({ success: true })
    res.cookies.set('donor_session', '', { httpOnly: true, path: '/', maxAge: 0 })
    return res
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}