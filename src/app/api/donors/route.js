// Donors API - List and Create
import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/session'
import { prisma } from '@/lib/db'
import qs from 'querystring'

export async function GET(request) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const url = new URL(request.url)
    const page = parseInt(url.searchParams.get('page') || '1', 10)
    const limit = parseInt(url.searchParams.get('limit') || '20', 10)
    const skip = (Math.max(page, 1) - 1) * limit
    const search = url.searchParams.get('search') || undefined

    const where = { organizationId: session.user.organizationId }
    if (search) {
      where.OR = [{ firstName: { contains: search, mode: 'insensitive' } }, { lastName: { contains: search, mode: 'insensitive' } }, { email: { contains: search, mode: 'insensitive' } }]
    }

    const [items, total] = await Promise.all([
      prisma.donor.findMany({ where, take: limit, skip, orderBy: { updatedAt: 'desc' } }),
      prisma.donor.count({ where })
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

    const body = await request.json()
    const { firstName, lastName, email, phone } = body || {}
    if (!firstName || !lastName) return NextResponse.json({ error: 'firstName and lastName required' }, { status: 400 })

    const donor = await prisma.donor.create({ data: { firstName, lastName, email: email || null, phone: phone || null, organizationId: session.user.organizationId } })
    return NextResponse.json(donor)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}