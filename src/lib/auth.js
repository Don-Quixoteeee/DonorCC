// Authentication utilities
import { prisma } from './db'
import { hashPassword, verifyPassword } from './password'

/**
 * TODO: Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Created user object
 */
export async function register(userData) {
  // Minimal registration helper (creates organization if missing)
  if (!userData.email || !userData.password) throw new Error('Email and password required')
  const existing = await prisma.user.findUnique({ where: { email: userData.email } })
  if (existing) throw new Error('User already exists')
  const hashed = await hashPassword(userData.password)

  let organizationId = userData.organizationId
  if (!organizationId) {
    const orgName = userData.organizationName || `${userData.email.split('@')[0]}'s Org`
    const org = await prisma.organization.create({ data: { name: orgName } })
    organizationId = org.id
  }

  const created = await prisma.user.create({
    data: {
      email: userData.email,
      password: hashed,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      organizationId
    }
  })
  const { password, ...safe } = created
  return safe
}

/**
 * TODO: Authenticate user login
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<Object|null>} User object or null if invalid
 */
export async function login(email, password) {
  if (!email || !password) return null
  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) return null
  const ok = await verifyPassword(password, user.password)
  if (!ok) return null
  const { password: _pwd, ...safe } = user
  return safe
}

/**
 * TODO: Get user by ID
 * @param {string} userId - User ID
 * @returns {Promise<Object|null>} User object or null
 */
export async function getUserById(userId) {
  if (!userId) return null
  const user = await prisma.user.findUnique({ where: { id: userId }, include: { organization: true } })
  if (!user) return null
  const { password, ...safe } = user
  return safe
}