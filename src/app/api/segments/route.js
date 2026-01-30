// Segments API - List and Create
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
    const skip = (Math.max(page,1)-1)*limit
    const where = { organizationId: session.user.organizationId }
    const [items, total] = await Promise.all([
      prisma.segment.findMany({ where, take: limit, skip, orderBy: { updatedAt: 'desc' } }),
      prisma.segment.count({ where })
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
    const { name, description, query } = body || {}
    if (!name) return NextResponse.json({ error: 'Name required' }, { status: 400 })
    const created = await prisma.segment.create({ data: { name, description: description || null, query: query || null, organizationId: session.user.organizationId } })
    return NextResponse.json(created)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}