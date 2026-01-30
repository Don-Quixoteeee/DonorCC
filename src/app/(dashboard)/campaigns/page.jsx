import Link from 'next/link'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function CampaignsPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login')

  const campaigns = await prisma.campaign.findMany({ where: { organizationId: user.organizationId }, orderBy: { updatedAt: 'desc' } })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Campaigns</h1>
          <p className="text-gray-600 mt-2">Manage campaigns for your organization</p>
        </div>
        <Link href="/campaigns/new" className="text-sm text-blue-600">Create Campaign</Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {campaigns.map(c => (
          <div key={c.id} className="p-4 bg-white shadow rounded">
            <h3 className="font-semibold"><Link href={`/campaigns/${c.id}`} className="text-blue-600">{c.name}</Link></h3>
            <p className="text-sm text-gray-600 mt-1">{c.description || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}