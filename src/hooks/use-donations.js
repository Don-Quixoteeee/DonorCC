import { useState, useEffect } from 'react'

export function useDonations(page = 1, limit = 20, filters = {}) {
	const [donations, setDonations] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const fetchDonations = async () => {
		setLoading(true)
		setError(null)
		try {
			const params = new URLSearchParams({ page, limit, ...filters })
			const res = await fetch(`/api/donations?${params}`)
			const data = await res.json()
			setDonations(data.donations || [])
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => { fetchDonations() }, [page, limit, JSON.stringify(filters)])
	return { donations, loading, error, refetch: fetchDonations }
}