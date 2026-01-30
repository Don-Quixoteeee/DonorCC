import { NextResponse } from 'next/server'
import { getSession } from '@/lib/session'
import { predictDonorRisk } from '@/lib/ai'

export async function POST(request) {
  try {
    const sessionToken = request.cookies.get('session')?.value
    const session = await getSession(sessionToken)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const donor = await request.json()
    if (!donor) return NextResponse.json({ error: 'Missing donor data' }, { status: 400 })
    const risk = await predictDonorRisk(donor)
    return NextResponse.json({ risk })
  } catch (error) {
    return NextResponse.json({ error: error.message || 'AI prediction failed' }, { status: 500 })
  }
}
