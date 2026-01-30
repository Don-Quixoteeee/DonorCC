import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'

export async function GET(request) {
  try {
    const cookieHeader = request.headers.get('cookie') || ''
    const match = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('donor_session='))
    const token = match ? match.split('=')[1] : null
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const session = await getSession(token)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { user } = session
    const { password, ...safeUser } = user
    return NextResponse.json({ user: safeUser })
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
