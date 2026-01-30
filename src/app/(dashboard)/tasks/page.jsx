// Tasks page  
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function TasksPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login')

  const tasks = await prisma.task.findMany({ where: { OR: [{ donor: { organizationId: user.organizationId } }, { assignedUser: { organizationId: user.organizationId } }] }, include: { donor: true, assignedUser: true }, orderBy: { dueDate: 'asc' } })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tasks & Reminders</h1>
        <p className="text-gray-600 mt-1">Open tasks for your organization</p>
      </div>

      <div className="bg-white shadow rounded">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Donor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Assigned</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {tasks.map(t => (
              <tr key={t.id}>
                <td className="px-6 py-4">{t.title}</td>
                <td className="px-6 py-4">{t.donor ? `${t.donor.firstName} ${t.donor.lastName}` : '—'}</td>
                <td className="px-6 py-4">{t.assignedUser ? `${t.assignedUser.firstName || ''} ${t.assignedUser.lastName || ''}` : '—'}</td>
                <td className="px-6 py-4">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}