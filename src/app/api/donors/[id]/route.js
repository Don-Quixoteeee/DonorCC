// Donors API - Individual Donor Operations
import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // params can be a promise in Next.js 16+; await to ensure we read the id
    const { id } = await params
    const donor = await prisma.donor.findUnique({ where: { id }, include: { donations: true, interactions: true, tasks: true } })
    if (!donor || donor.organizationId !== session.user.organizationId) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(donor)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const { id } = await params
    const body = await request.json()
    const update = {}
    ;['firstName','lastName','email','phone','address','city','state','zipCode','status','retentionRisk'].forEach(k => { if (k in body) update[k] = body[k] })
    const donor = await prisma.donor.updateMany({ where: { id, organizationId: session.user.organizationId }, data: update })
    if (donor.count === 0) return NextResponse.json({ error: 'Not found or not permitted' }, { status: 404 })
    const updated = await prisma.donor.findUnique({ where: { id } })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    // basic permission check: only ADMIN can delete
    if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const { id } = await params
    if (!id) return NextResponse.json({ error: 'Missing donor id' }, { status: 400 })
    const result = await prisma.donor.deleteMany({ where: { id, organizationId: session.user.organizationId } })
    if (result.count === 0) return NextResponse.json({ error: 'Not found or not permitted' }, { status: 404 })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
