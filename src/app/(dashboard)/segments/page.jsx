import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function SegmentsPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login')

  const segments = await prisma.segment.findMany({ where: { organizationId: user.organizationId }, orderBy: { updatedAt: 'desc' } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Segments</h1>
        <p className="text-gray-600 mt-1">Donor segments help target groups of donors</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {segments.map(s => (
          <div key={s.id} className="p-4 bg-white shadow rounded">
            <h3 className="font-semibold">{s.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{s.description || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}