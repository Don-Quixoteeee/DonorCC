import Link from 'next/link'
import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import { redirect } from 'next/navigation'

export default async function WorkflowsPage() {
  const user = await getSessionUser()
  if (!user) redirect('/login')

  const workflows = await prisma.workflow.findMany({ where: { organizationId: user.organizationId }, orderBy: { updatedAt: 'desc' } })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Automation Workflows</h1>
          <p className="text-gray-600 mt-1">Automations to run on donor events</p>
        </div>
        <Link href="/workflows/new" className="text-sm text-blue-600">Create Workflow</Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {workflows.map(w => (
          <div key={w.id} className="p-4 bg-white shadow rounded">
            <h3 className="font-semibold"><Link href={`/workflows/${w.id}`} className="text-blue-600">{w.name}</Link></h3>
            <p className="text-sm text-gray-600 mt-1">Trigger: {w.trigger}</p>
          </div>
        ))}
      </div>
    </div>
  )
}