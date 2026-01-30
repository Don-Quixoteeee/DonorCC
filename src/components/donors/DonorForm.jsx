import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { createDonorSchema } from '@/lib/validation/donor-schema'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function DonorForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: zodResolver(createDonorSchema),
  })

  async function onSubmit(data) {
    const res = await fetch('/api/donors', {
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
        <label className="block text-sm font-medium">First Name</label>
        <Input {...register('firstName')} />
        {errors.firstName && <p className="text-red-500 text-xs">{errors.firstName.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Last Name</label>
        <Input {...register('lastName')} />
        {errors.lastName && <p className="text-red-500 text-xs">{errors.lastName.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Email</label>
        <Input {...register('email')} />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
      </div>
      <div>
        <label className="block text-sm font-medium">Phone</label>
        <Input {...register('phone')} />
        {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
      </div>
      <Button type="submit" disabled={isSubmitting}>Add Donor</Button>
    </form>
  )
}
