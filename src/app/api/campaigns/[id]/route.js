// Campaigns API - Individual Operations
import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const id = params.id
    const campaign = await prisma.campaign.findUnique({ where: { id } })
    if (!campaign || campaign.organizationId !== session.user.organizationId) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(campaign)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function PATCH(request, { params }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const id = params.id
    const body = await request.json()
    const update = {}
    ;['name','description','goal','startDate','endDate','type','status'].forEach(k => { if (k in body) update[k] = body[k] })
    if ('goal' in update) update.goal = Number(update.goal)
    if ('startDate' in update) update.startDate = update.startDate ? new Date(update.startDate) : null
    if ('endDate' in update) update.endDate = update.endDate ? new Date(update.endDate) : null
    const updated = await prisma.campaign.updateMany({ where: { id, organizationId: session.user.organizationId }, data: update })
    if (updated.count === 0) return NextResponse.json({ error: 'Not found or not permitted' }, { status: 404 })
    const res = await prisma.campaign.findUnique({ where: { id } })
    return NextResponse.json(res)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    if (session.user.role !== 'ADMIN') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    const id = params.id
    await prisma.campaign.deleteMany({ where: { id, organizationId: session.user.organizationId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}