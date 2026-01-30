import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createCampaignSchema } from '@/lib/validation/campaign-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function CampaignForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createCampaignSchema),
  })

  async function onSubmit(data) {
    const res = await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (res.ok) {
      reset()
      if (onSuccess) onSuccess()
    }
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <Input {...register('name')} />
        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <Input {...register('description')} />
        {errors.description && <p className="text-red-500 text-xs">{errors.description.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Goal</label>
        <Input type="number" {...register('goal')} />
        {errors.goal && <p className="text-red-500 text-xs">{errors.goal.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Start Date</label>
        <Input type="date" {...register('startDate')} />
        {errors.startDate && <p className="text-red-500 text-xs">{errors.startDate.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">End Date</label>
        <Input type="date" {...register('endDate')} />
        {errors.endDate && <p className="text-red-500 text-xs">{errors.endDate.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Type</label>
        <Input {...register('type')} />
        {errors.type && <p className="text-red-500 text-xs">{errors.type.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>Add Campaign</Button>
    </form>
  )
}
