"use client"
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminDeleteDonorButton({ donorId }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleDelete = async (e) => {
    e.preventDefault()
    if (!donorId) {
      setError('Missing donor id')
      return
    }
    if (!confirm('Are you sure?')) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/donors/${encodeURIComponent(String(donorId))}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Failed to delete donor')
        setLoading(false)
        return
      }
      router.push('/donors')
      router.refresh()
    } catch (err) {
      setError('Network error')
      setLoading(false)
    }
  }
  return (
    <div>
      <button onClick={handleDelete} disabled={loading} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
        {loading ? 'Deleting...' : 'Delete Donor'}
      </button>
      {error && <div className="text-red-600 text-sm mt-2">{error}</div>}
    </div>
  )
}
