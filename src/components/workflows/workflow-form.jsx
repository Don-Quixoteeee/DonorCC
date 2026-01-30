/**
 * Workflow Form Component
 * TODO: Implement form for creating/editing automated workflows
 */

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { createWorkflowSchema, WorkflowTriggerEnum } from '@/lib/validation/workflow-schema'
export function WorkflowForm({ workflow, onSubmit, onCancel }) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(createWorkflowSchema),
    defaultValues: workflow || {},
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
        <FormLabel>Trigger</FormLabel>
        <FormControl>
          <select {...register('trigger')} required>
            {WorkflowTriggerEnum.options.map(opt => (
              <option key={opt} value={opt}>{opt.replace(/_/g, ' ')}</option>
            ))}
          </select>
        </FormControl>
        <FormMessage>{errors.trigger?.message}</FormMessage>
      </FormField>
      <FormField>
        <FormLabel>Active</FormLabel>
        <FormControl>
          <input type="checkbox" {...register('isActive')} defaultChecked />
        </FormControl>
      </FormField>
      {/* Add more fields for config/actions as needed */}
      <div className="flex gap-2 mt-4">
        <Button type="submit" disabled={isSubmitting}>Save</Button>
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
      </div>
    </Form>
  )
}

// TODO: Example usage:
// <WorkflowForm 
//   workflow={editingWorkflow} 
//   onSubmit={handleCreateWorkflow}
//   onCancel={() => setShowForm(false)}
// />