'use client'

import DonorForm from '@/components/donors/DonorForm'
import { useRouter } from 'next/navigation'

export default function NewDonorPage() {
  const router = useRouter()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Donor</h1>
        <p className="text-gray-600 mt-2">
          Create a new donor profile
        </p>
      </div>
      <div className="mt-6">
        <DonorForm onSuccess={() => router.push('/donors')} />
      </div>
    </div>
  )
}