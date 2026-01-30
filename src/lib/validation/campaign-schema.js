// Zod validation schemas for campaign operations
import { z } from 'zod'

export const CampaignStatusEnum = z.enum(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED'])

export const createCampaignSchema = z.object({
	name: z.string().min(1).max(100),
	description: z.string().max(1000).optional(),
	goalAmount: z.coerce.number().positive().optional(),
	startDate: z.coerce.date(),
	endDate: z.coerce.date().optional(),
	status: CampaignStatusEnum.default('DRAFT'),
})

export const updateCampaignSchema = createCampaignSchema.partial()

export const campaignListQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	status: CampaignStatusEnum.optional(),
	search: z.string().optional(),
	sortBy: z.enum(['name', 'goalAmount', 'startDate', 'createdAt']).default('name'),
	sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export default {
	createCampaignSchema,
	updateCampaignSchema,
	campaignListQuerySchema,
}