// Workflows API - Individual Operations
import { NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/session'
import { prisma } from '@/lib/db'

export async function GET(request, { params }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const id = params.id
    const wf = await prisma.workflow.findUnique({ where: { id } })
    if (!wf || wf.organizationId !== session.user.organizationId) return NextResponse.json({ error: 'Not found' }, { status: 404 })
    return NextResponse.json(wf)
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
    ;['name','trigger','actions'].forEach(k => { if (k in body) update[k] = k === 'actions' ? JSON.stringify(body[k]) : body[k] })
    const updated = await prisma.workflow.updateMany({ where: { id, organizationId: session.user.organizationId }, data: update })
    if (updated.count === 0) return NextResponse.json({ error: 'Not found or not permitted' }, { status: 404 })
    const res = await prisma.workflow.findUnique({ where: { id } })
    return NextResponse.json(res)
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getSessionFromRequest(request)
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    const id = params.id
    await prisma.workflow.deleteMany({ where: { id, organizationId: session.user.organizationId } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
