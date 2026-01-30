/**
 * Donation Form Component
 * TODO: Implement form for creating/editing donations
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { createDonationSchema, DonationTypeEnum } from '@/lib/validation/donation-schema'
export function DonationForm({ donation, donors, onSubmit, onCancel }) {
  const today = new Date().toISOString().split('T')[0]
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createDonationSchema),
    defaultValues: { ...donation, date: donation?.date || today },
  })
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <FormLabel>Donor</FormLabel>
        <FormControl>
          <select {...register('donorId')} required>
            {donors?.map(d => (
              <option key={d.id} value={d.id}>{d.firstName} {d.lastName}</option>
            ))}
          </select>
        </FormControl>
        <FormMessage>{errors.donorId?.message}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Amount</FormLabel>
        <FormControl>
          <Input type="number" step="0.01" {...register('amount')} required />
        </FormControl>
        <FormMessage>{errors.amount?.message}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Type</FormLabel>
        <FormControl>
          <select {...register('type')} required>
            {DonationTypeEnum.options.map(opt => (
              <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </FormControl>
        <FormMessage>{errors.type?.message}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Date</FormLabel>
        <FormControl>
          <Input type="date" {...register('date')} required />
        </FormControl>
        <FormMessage>{errors.date?.message}</FormMessage>
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
// <DonationForm 
//   donation={editingDonation} 
//   donors={allDonors}
//   onSubmit={handleCreateDonation}
//   onCancel={() => setShowForm(false)}
// />