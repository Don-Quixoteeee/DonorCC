// React hook for donor data management
import { useState, useEffect } from 'react'

/**
 * TODO: Hook to fetch and manage donors list
 * @param {number} page - Page number for pagination
 * @param {number} limit - Items per page
 * @param {Object} filters - Search and filter options
 * @returns {Object} { donors, loading, error, refetch }
 */
export function useDonors(page = 1, limit = 20, filters = {}) {
  const [donors, setDonors] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fetchDonors = async () => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({ page, limit, ...filters })
      const res = await fetch(`/api/donors?${params}`)
      const data = await res.json()
      setDonors(data.donors || [])
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchDonors() }, [page, limit, JSON.stringify(filters)])
  return { donors, loading, error, refetch: fetchDonors }
}

/**
 * TODO: Hook to fetch single donor
 * @param {string} donorId - Donor ID
 * @returns {Object} { donor, loading, error, refetch }
 */
export function useDonor(donorId) {
  const [donor, setDonor] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const fetchDonor = async () => {
    if (!donorId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/donors/${donorId}`)
      const data = await res.json()
      setDonor(data.donor || null)
    } catch (err) {
      setError(err)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchDonor() }, [donorId])
  return { donor, loading, error, refetch: fetchDonor }
}