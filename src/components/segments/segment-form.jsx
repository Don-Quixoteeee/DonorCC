/**
 * Segment Form Component
 * TODO: Implement form for creating/editing donor segments
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { createSegmentSchema } from '@/lib/validation/segment-schema'
export function SegmentForm({ segment, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createSegmentSchema),
    defaultValues: segment || {},
  })
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <FormField>
        <FormLabel>Name</FormLabel>
        <FormControl>
          <Input {...register('name')} required />
        </FormControl>
        <FormMessage>{errors.name?.message}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Description</FormLabel>
        <FormControl>
          <Input {...register('description')} />
        </FormControl>
        <FormMessage>{errors.description?.message}</FormMessage>
      </FormField>
      {/* Add more criteria fields as needed */}
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={isSubmitting}>Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </Form>
  )
}

// TODO: Example usage:
// <SegmentForm 
//   segment={editingSegment} 
//   onSubmit={handleCreateSegment}
//   onCancel={() => setShowForm(false)}
// />