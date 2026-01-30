/**
 * Donor Detail Page
 * 
 * Displays comprehensive information about a specific donor including:
 * - Donor contact information (name, email)
 * - Total gifts count and total donation amount
 * - Complete donation history with dates and amounts
 * - Interaction history (emails, calls, meetings)
 * 
 * Route: /donors/[id]
 * Authentication: Required (redirects to /login if not authenticated)
 * Multi-tenant: Only shows donors belonging to user's organization
 */

import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'
import { getSessionUser } from '@/lib/session'
import AdminDeleteDonorButton from '@/components/donors/AdminDeleteDonorButton'
import { Suspense } from 'react'

export default async function DonorDetailPage({ params }) {
  // Authenticate user - redirect to login if no session exists
  const user = await getSessionUser()
  if (!user) redirect('/login')

  // Extract donor ID from URL params (Next.js 16+ requires await)
  const { id } = await params
  if (!id) {
    return <div className="text-red-600 font-bold">Error: No donor ID provided in URL.</div>
  }

  // Fetch donor with all related donations and interactions
  const donor = await prisma.donor.findUnique({
    where: { id },
    include: {
      donations: true,
      interactions: true
    }
  })

  // Verify donor exists and belongs to user's organization (multi-tenant security)
  if (!donor || donor.organizationId !== user.organizationId) {
    return <div>Not found</div>
  }

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-bold">{donor.firstName} {donor.lastName}</h2>
        <p className="text-sm text-gray-600">{donor.email || 'No email'}</p>
        <div className="mt-4">
          <strong>Total gifts:</strong> {donor.totalGifts} <strong>Total amount:</strong> ${donor.totalAmount?.toFixed(2) || '0.00'}
        </div>
      </div>

      {/* Admin-only section */}
      {user.role === 'ADMIN' && (
        <div className="bg-red-50 border border-red-200 rounded p-4">
          <h3 className="font-semibold text-red-700 mb-2">Admin Actions</h3>
          <p className="text-sm text-red-600 mb-2">Only admins can see this section.</p>
          <Suspense fallback={<div>Loading admin actions...</div>}>
            <AdminDeleteDonorButton donorId={donor.id} />
          </Suspense>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold">Donations</h3>
          <ul className="mt-2 space-y-2">
            {donor.donations.map(d => {
              // Use stable UTC formatting to avoid hydration mismatches
              const displayDate = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC' }).format(new Date(d.date))
              return (
                <li key={d.id} className="text-sm">{displayDate} ${d.amount.toFixed(2)}</li>
              )
            })}
          </ul>
        </div>
        <div className="bg-white shadow rounded p-4">
          <h3 className="font-semibold">Interactions</h3>
          <ul className="mt-2 space-y-2">
            {donor.interactions.map(i => (
              <li key={i.id} className="text-sm">{i.type} {i.subject || 'No subject'}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
