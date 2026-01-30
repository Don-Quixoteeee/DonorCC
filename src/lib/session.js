// Session management for authentication
import { cookies } from 'next/headers'
import { prisma } from './db'
import crypto from 'crypto'

const DEFAULT_SESSION_TTL = 7 * 24 * 60 * 60 * 1000 // 7 days in ms

/**
 * Create a new session for a user and store it in DB
 * @param {string} userId - User ID to create session for
 * @returns {Promise<string>} Session token
 */
export async function createSession(userId) {
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + DEFAULT_SESSION_TTL)
  await prisma.session.create({ data: { token, userId, expiresAt } })
  return token
}

/**
 * Get session and user data from session token
 * @param {string} sessionToken - Session token to validate
 * @returns {Promise<Object|null>} Session with user data or null
 */
export async function getSession(sessionToken) {
  if (!sessionToken) return null
  const session = await prisma.session.findUnique({ where: { token: sessionToken }, include: { user: true } })
  if (!session) return null
  if (new Date(session.expiresAt) < new Date()) return null
  return session
}

/**
 * Extract session from a Next.js `Request` object by reading the `donor_session` cookie
 * @param {Request} request
 * @returns {Promise<Object|null>} session or null
 */
export async function getSessionFromRequest(request) {
  if (!request) return null
  const cookieHeader = request.headers.get('cookie') || ''
  const match = cookieHeader.split(';').map(s => s.trim()).find(s => s.startsWith('donor_session='))
  const token = match ? match.split('=')[1] : null
  if (!token) return null
  return await getSession(token)
}

/**
 * Get current user from session (for server components)
 * @returns {Promise<Object|null>} User object or null
 */
export async function getSessionUser() {
  const cookieStore = await cookies()
  const cookie = cookieStore.get('donor_session')
  const token = cookie?.value
  if (!token) return null
  const session = await getSession(token)
  if (!session) return null
  return session.user
}

/**
 * Delete a session (logout)
 * @param {string} sessionToken - Session token to delete
 */
export async function deleteSession(sessionToken) {
  if (!sessionToken) return
  await prisma.session.deleteMany({ where: { token: sessionToken } })
  try {
    const cookieStore = await cookies()
    cookieStore.delete('donor_session')
  } catch (e) {
    // cookie deletion may not be available in all contexts
  }
}
