import { getSessionUser } from '@/lib/session'
import { prisma } from '@/lib/db'
import { notFound, redirect } from 'next/navigation'

export default async function WorkflowDetailPage({ params }) {
  const user = await getSessionUser()
  if (!user) redirect('/login')
  // Debug: log params
  // console.log('WorkflowDetailPage params:', params)
  const id = params?.id || (Array.isArray(params) ? params[0] : undefined)
  if (!id) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-2xl font-bold mb-2 text-red-600">Error: No workflow ID provided in URL.</h1>
      </div>
    )
  }
  const workflow = await prisma.workflow.findUnique({
    where: { id },
  })
  if (!workflow || workflow.organizationId !== user.organizationId) return notFound()
  return (
    <div className="max-w-2xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">{workflow.name}</h1>
      <div className="mb-2 text-gray-600">Trigger: {workflow.trigger}</div>
      <div className="mb-2 text-gray-600">Active: {workflow.isActive ? 'Yes' : 'No'}</div>
      {workflow.description && <div className="mb-2">{workflow.description}</div>}
      <div className="mb-2 text-gray-600">Created: {new Date(workflow.createdAt).toLocaleString()}</div>
      <div className="mb-2 text-gray-600">Updated: {new Date(workflow.updatedAt).toLocaleString()}</div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-1">Steps</h2>
        <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">{JSON.stringify(workflow.steps, null, 2)}</pre>
      </div>
    </div>
  )
}
