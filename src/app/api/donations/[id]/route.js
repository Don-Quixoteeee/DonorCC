// Donations API - Individual Operations
import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const id = params.id
    const donation = await prisma.donation.findUnique({ where: { id }, include: { donor: true } })
    if (!donation || donation.donor.organizationId !== session.user.organizationId) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(donation)
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
    const up = {}
    ;['amount','date','type','method','notes'].forEach(k => { if (k in body) up[k] = body[k] })
    const existing = await prisma.donation.findUnique({ where: { id }, include: { donor: true } })
    if (!existing || existing.donor.organizationId !== session.user.organizationId) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    const updated = await prisma.donation.update({ where: { id }, data: up })
    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const id = params.id
    const existing = await prisma.donation.findUnique({ where: { id }, include: { donor: true } })
    if (!existing || existing.donor.organizationId !== session.user.organizationId) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    await prisma.donation.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}