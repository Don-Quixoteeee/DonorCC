// Donations API - List and Create
import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function GET(request) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '20', 10)
    const skip = (Math.max(page, 1) - 1) * limit

    const where = { donor: { organizationId: session.user.organizationId } }
    const [items, total] = await Promise.all([
      prisma.donation.findMany({ where, take: limit, skip, orderBy: { date: 'desc' } }),
      prisma.donation.count({ where })
    ])
    return NextResponse.json({ items, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (!['ADMIN','STAFF'].includes(session.user.role)) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

    const body = await request.json()
    const { donorId, amount, date, type, method, notes } = body || {}
    if (!donorId || !amount) return NextResponse.json({ error: 'donorId and amount required' }, { status: 400 })

    // ensure donor belongs to organization
    const donor = await prisma.donor.findUnique({ where: { id: donorId } })
    if (!donor || donor.organizationId !== session.user.organizationId) return NextResponse.json({ error: 'Invalid donor' }, { status: 400 })

    const created = await prisma.donation.create({ data: { donorId, amount: Number(amount), date: date ? new Date(date) : new Date(), type: type || 'ONE_TIME', method: method || null, notes: notes || null } })

    // update donor metrics (simple recalculation)
    const agg = await prisma.donation.aggregate({ where: { donorId }, _sum: { amount: true }, _count: { id: true }, _min: { date: true }, _max: { date: true } })
    await prisma.donor.update({ where: { id: donorId }, data: { totalAmount: agg._sum.amount || 0, totalGifts: agg._count.id || 0, firstGiftDate: agg._min.date || null, lastGiftDate: agg._max.date || null } })

    return NextResponse.json(created)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
