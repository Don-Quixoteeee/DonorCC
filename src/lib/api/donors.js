// Business logic for donor operations
import { prisma } from '../db'

/**
 * TODO: Get a single donor by ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object|null>} Donor object or null
 */
export async function getDonor({ id, organizationId }) {
  if (!id || !organizationId) return null
  const donor = await prisma.donor.findUnique({
    where: { id, organizationId },
    include: {
      donations: true,
      interactions: true,
      tasks: true,
    },
  })
  if (!donor) return null
  const totalAmount = donor.donations.reduce((sum, d) => sum + d.amount, 0)
  const totalGifts = donor.donations.length
  const avgGift = totalGifts ? totalAmount / totalGifts : 0
  const lastGiftDate = donor.donations.length ? donor.donations[0].date : null
  return { ...donor, totalAmount, totalGifts, avgGift, lastGiftDate }
}

/**
 * TODO: Create a new donor
 * @param {Object} donorData - Donor data to create
 * @returns {Promise<Object>} Created donor object
 */
export async function createDonor(donorData) {
  const donor = await prisma.donor.create({ data: donorData })
  return await getDonor({ id: donor.id, organizationId: donor.organizationId })
}

/**
 * TODO: Update an existing donor
 * @param {Object} params - Update parameters (id, organizationId, data)
 * @returns {Promise<Object>} Updated donor object
 */
export async function updateDonor({ id, organizationId, data }) {
  await prisma.donor.update({ where: { id, organizationId }, data })
  return await getDonor({ id, organizationId })
}

/**
 * TODO: Delete a donor
 * @param {Object} params - Delete parameters (id, organizationId)
 */
export async function deleteDonor({ id, organizationId }) {
  // Cascade delete donations, interactions, tasks
  await prisma.donation.deleteMany({ where: { donorId: id } })
  await prisma.interaction.deleteMany({ where: { donorId: id } })
  await prisma.task.deleteMany({ where: { donorId: id } })
  await prisma.donor.delete({ where: { id, organizationId } })
}

/**
 * TODO: Update donor metrics after donation changes
 * @param {string} donorId - Donor ID to update metrics for
 */
export async function updateDonorMetrics(donorId) {
  const donor = await prisma.donor.findUnique({
    where: { id: donorId },
    include: { donations: true },
  })
  if (!donor) return
  const totalAmount = donor.donations.reduce((sum, d) => sum + d.amount, 0)
  const totalGifts = donor.donations.length
  const avgGift = totalGifts ? totalAmount / totalGifts : 0
  const lastGiftDate = donor.donations.length ? donor.donations[0].date : null
  // Example retention risk logic
  let retentionRisk = 'LOW'
  if (totalGifts === 0) retentionRisk = 'HIGH'
  else if (totalAmount < 100) retentionRisk = 'MEDIUM'
  await prisma.donor.update({
    where: { id: donorId },
    data: { totalAmount, totalGifts, avgGift, lastGiftDate, retentionRisk },
  })
}