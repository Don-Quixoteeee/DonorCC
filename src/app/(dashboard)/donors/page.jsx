// Donors list page
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function DonorsPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login')

  const donors = await prisma.donor.findMany({ where: { organizationId: user.organizationId }, take: 50, orderBy: { updatedAt: 'desc' } })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Donors</h1>
          <p className="text-gray-600 mt-2">Manage your donor relationships and track engagement</p>
        </div>
        <Link href="/donors/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Donor
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gifts</th>
              <th className="px-6 py-3" />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {donors.map(d => (
              <tr key={d.id}>
                <td className="px-6 py-4 whitespace-nowrap">{d.firstName} {d.lastName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{d.email || '—'}</td>
                <td className="px-6 py-4 whitespace-nowrap">{d.totalGifts}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <Link href={`/donors/${d.id}`} className="text-blue-600 hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
