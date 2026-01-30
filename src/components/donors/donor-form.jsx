/**
 * Donor Form Component 
 * TODO: Implement form for creating/editing donors
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { createDonorSchema, DonorStatusEnum, RetentionRiskEnum } from '@/lib/validation/donor-schema'
export function DonorForm({ donor, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createDonorSchema),
    defaultValues: donor || {},
  })
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <FormLabel>First Name</FormLabel>
        <FormControl>
          <Input {...register('firstName')} required />
        </FormControl>
        <FormMessage>{errors.firstName?.message}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Last Name</FormLabel>
        <FormControl>
          <Input {...register('lastName')} required />
        </FormControl>
        <FormMessage>{errors.lastName?.message}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Email</FormLabel>
        <FormControl>
          <Input type="email" {...register('email')} required />
        </FormControl>
        <FormMessage>{errors.email?.message}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Phone</FormLabel>
        <FormControl>
          <Input {...register('phone')} />
        </FormControl>
        <FormMessage>{errors.phone?.message}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Status</FormLabel>
        <FormControl>
          <select {...register('status')} required>
            {DonorStatusEnum.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </FormControl>
        <FormMessage>{errors.status?.message}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Retention Risk</FormLabel>
        <FormControl>
          <select {...register('retentionRisk')} required>
            {RetentionRiskEnum.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </FormControl>
        <FormMessage>{errors.retentionRisk?.message}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Notes</FormLabel>
        <FormControl>
          <Input {...register('notes')} />
        </FormControl>
        <FormMessage>{errors.notes?.message}</FormMessage>
      </FormField>
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={isSubmitting}>Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </Form>
  )
}

// TODO: Example usage:
// <DonorForm 
//   donor={editingDonor} 
//   onSubmit={handleCreateDonor}
//   onCancel={() => setShowForm(false)}
// />
