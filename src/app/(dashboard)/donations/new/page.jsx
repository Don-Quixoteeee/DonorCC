'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function NewDonationPage() {
  const router = useRouter()
  const [donorId, setDonorId] = useState('')
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState('')
  const [method, setMethod] = useState('')
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/donors')
      if (res.ok) setDonors(await res.json().then(r => r.items || r))
    }
    load()
  }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch('/api/donations', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ donorId, amount: Number(amount), date, method }) })
      const data = await res.json()
      if (!res.ok) {
        setError(data?.error || 'Failed')
        setLoading(false)
        return
      }
      router.push('/donations')
    } catch (err) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Record New Donation</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
        {error && <div className="text-sm text-red-600">{error}</div>}
        <div>
          <label className="block text-sm font-medium text-gray-700">Donor</label>
          <select value={donorId} onChange={(e) => setDonorId(e.target.value)} className="mt-1 block w-full border rounded p-2" required>
            <option value="">Select donor</option>
            {donors.map(d => <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Amount</label>
          <input value={amount} onChange={(e) => setAmount(e.target.value)} type="number" step="0.01" className="mt-1 block w-full border rounded p-2" required />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Date</label>
          <input value={date} onChange={(e) => setDate(e.target.value)} type="date" className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Method</label>
          <input value={method} onChange={(e) => setMethod(e.target.value)} className="mt-1 block w-full border rounded p-2" />
        </div>
        <div>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{loading ? 'Saving...' : 'Save'}</button>
        </div>
      </form>
    </div>
  )
}
