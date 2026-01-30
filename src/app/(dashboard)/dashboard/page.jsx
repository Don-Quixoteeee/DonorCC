// Dashboard home page  
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login')

  const [totalDonors, donationAgg] = await Promise.all([
    prisma.donor.count({ where: { organizationId: user.organizationId } }),
    prisma.donation.aggregate({ where: { donor: { organizationId: user.organizationId } }, _sum: { amount: true } })
  ])

  const totalDonations = donationAgg._sum.amount || 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome to your donor retention platform</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-sm text-gray-500">Total donors</h3>
          <p className="text-2xl font-bold">{totalDonors}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-sm text-gray-500">Total donations</h3>
          <p className="text-2xl font-bold">${totalDonations.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-white shadow rounded">
          <h3 className="text-sm text-gray-500">Placeholder</h3>
          <p className="text-2xl font-bold">—</p>
        </div>
      </div>

    </div>
  )
}