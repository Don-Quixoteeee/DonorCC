// Zod validation schemas for donor operations
import { z } from 'zod'

// TODO: Define DonorStatusEnum - ACTIVE, LAPSED, PENDING, INACTIVE

// TODO: Define RetentionRiskEnum - LOW, MEDIUM, HIGH, CRITICAL

// TODO: Define createDonorSchema with fields:
// - firstName: required string, max 50 chars
// - lastName: required string, max 50 chars  
// - email: required email format
// - phone: optional string, max 20 chars
// - address: optional object with street, city, state, zip
// - status: DonorStatusEnum, default ACTIVE
// - retentionRisk: RetentionRiskEnum, default LOW
// - notes: optional string, max 1000 chars
export const DonorStatusEnum = z.enum(['ACTIVE', 'LAPSED', 'PENDING', 'INACTIVE'])

export const RetentionRiskEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])

export const addressSchema = z
	.object({
		street: z.string().max(200).optional(),
		city: z.string().max(100).optional(),
		state: z.string().max(100).optional(),
		zip: z.string().max(20).optional(),
	})
	.optional()

export const createDonorSchema = z.object({
	firstName: z.string().min(1).max(50),
	lastName: z.string().min(1).max(50),
	email: z.string().email(),
	phone: z.string().max(20).optional(),
	address: addressSchema,
	status: DonorStatusEnum.default('ACTIVE'),
	retentionRisk: RetentionRiskEnum.default('LOW'),
	notes: z.string().max(1000).optional(),
})

export const updateDonorSchema = createDonorSchema.partial()

export const donorListQuerySchema = z.object({
	page: z.coerce.number().min(1).default(1),
	limit: z.coerce.number().min(1).max(100).default(20),
	search: z.string().optional(),
	status: DonorStatusEnum.optional(),
	retentionRisk: RetentionRiskEnum.optional(),
	sortBy: z.enum(['firstName', 'lastName', 'email', 'createdAt']).default('firstName'),
	sortOrder: z.enum(['asc', 'desc']).default('asc'),
})

export default {
	createDonorSchema,
	updateDonorSchema,
	donorListQuerySchema,
}