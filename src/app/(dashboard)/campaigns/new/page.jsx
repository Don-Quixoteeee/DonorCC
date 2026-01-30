'use client'

import CampaignForm from '@/components/campaigns/CampaignForm'
import { useRouter } from 'next/navigation'

export default function NewCampaignPage() {
  const router = useRouter()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Add New Campaign</h1>
        <p className="text-gray-600 mt-2">
          Create a new fundraising campaign
        </p>
      </div>
      <div className="mt-6">
        <CampaignForm onSuccess={() => router.push('/campaigns')} />
      </div>
    </div>
  )
}
