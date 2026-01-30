// Zod validation schemas for segment operations
import { z } from 'zod'

export const createSegmentSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(1000).optional(),
	criteria: z.string().max(2000).optional(),
})

export const updateSegmentSchema = createSegmentSchema.partial()

export const segmentListQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	search: z.string().optional(),
	sortBy: z.enum(['name', 'createdAt']).default('name'),
	sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export default {
	createSegmentSchema,
	updateSegmentSchema,
	segmentListQuerySchema,
}