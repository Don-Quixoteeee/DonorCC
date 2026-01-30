import { useState, useEffect } from 'react'

export function useSegments(page = 1, limit = 20, filters = {}) {
	const [segments, setSegments] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const fetchSegments = async () => {
		setLoading(true)
		setError(null)
		try {
			const params = new URLSearchParams({ page, limit, ...filters })
			const res = await fetch(`/api/segments?${params}`)
			const data = await res.json()
			setSegments(data.segments || [])
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => { fetchSegments() }, [page, limit, JSON.stringify(filters)])
	return { segments, loading, error, refetch: fetchSegments }
}