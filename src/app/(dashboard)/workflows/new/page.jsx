'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { WorkflowForm } from '@/components/workflows/workflow-form'

export default function NewWorkflowPage() {
  const router = useRouter()
  const [error, setError] = useState(null)

  async function handleCreateWorkflow(data) {
    setError(null)
    try {
      const res = await fetch('/api/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const result = await res.json()
        setError(result?.error || 'Failed to create workflow')
        return
      }
      router.push('/workflows')
    } catch (err) {
      setError('Network error')
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Workflow</h1>
        <p className="text-gray-600 mt-2">Create a new automation workflow</p>
      </div>
      <div className="mt-6">
        {error && <div className="text-red-600 text-sm mb-2">{error}</div>}
        <WorkflowForm onSubmit={handleCreateWorkflow} onCancel={() => router.push('/workflows')} />
      </div>
    </div>
  )
}
