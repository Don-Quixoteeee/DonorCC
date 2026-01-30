import Link from 'next/link'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function DonationsPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login')

  const donations = await prisma.donation.findMany({ where: { donor: { organizationId: user.organizationId } }, include: { donor: true }, orderBy: { date: 'desc' }, take: 50 })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Donations</h1>
          <p className="text-gray-600 mt-2">Record and manage donations</p>
        </div>
        <Link href="/donations/new" className="text-sm text-blue-600">Record New Donation</Link>
      </div>

      <div className="bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donations.map(d => (
              <tr key={d.id}>
                <td className="px-6 py-4">{new Date(d.date).toLocaleDateString()}</td>
                <td className="px-6 py-4">{d.donor ? `${d.donor.firstName} ${d.donor.lastName}` : '—'}</td>
                <td className="px-6 py-4">${d.amount.toFixed(2)}</td>
                <td className="px-6 py-4">{d.method || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}