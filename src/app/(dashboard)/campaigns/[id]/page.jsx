/**
 * Campaign Detail Page
 * 
 * Displays detailed information about a specific campaign including:
 * - Campaign name, description, and status
 * - Total amount raised from all donations
 * - Associated donations list
 * 
 * Route: /campaigns/[id]
 * Authentication: Required (redirects to /login if not authenticated)
 * Multi-tenant: Only shows campaigns belonging to user's organization
 */

import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function CampaignDetailPage({ params }) {
  // Authenticate user - redirect to login if no session exists
  const user = await getSessionUser()
  if (!user) redirect('/login')
  
  // Extract campaign ID from URL params (Next.js 16 requires await)
  const { id } = await params
  
  // Fetch campaign with all related donations
  const campaign = await prisma.campaign.findUnique({ 
    where: { id }, 
    include: { donations: true } 
  })
  
  // Verify campaign exists and belongs to user's organization (multi-tenant security)
  if (!campaign || campaign.organizationId !== user.organizationId) {
    return <div>Not found</div>
  }

  // Calculate total amount raised from all donations
  const totalRaised = campaign.donations.reduce((s, d) => s + (d.amount || 0), 0)

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded p-4">
        <h1 className="text-2xl font-bold">{campaign.name}</h1>
        <p className="text-sm text-gray-600">{campaign.description || '—'}</p>
        <div className="mt-4">
          <strong>Status:</strong> {campaign.status}
        </div>
        <div className="mt-2">
          <strong>Total raised:</strong> ${totalRaised.toFixed(2)}
        </div>
      </div>
    </div>
  )
}
