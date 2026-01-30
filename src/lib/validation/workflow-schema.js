// Zod validation schemas for workflow operations
import { z } from 'zod'

export const WorkflowTriggerEnum = z.enum([
	'DONATION_RECEIVED',
	'DONOR_LAPSED',
	'CAMPAIGN_COMPLETED',
	'SEGMENT_UPDATED',
])

export const createWorkflowSchema = z.object({
	name: z.string().min(1).max(100),
	trigger: WorkflowTriggerEnum,
	isActive: z.boolean().default(true),
	config: z.record(z.any()).optional(),
})

export const updateWorkflowSchema = createWorkflowSchema.partial()

export const workflowListQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	search: z.string().optional(),
	sortBy: z.enum(['name', 'createdAt']).default('name'),
	sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export default {
	createWorkflowSchema,
	updateWorkflowSchema,
	workflowListQuerySchema,
}