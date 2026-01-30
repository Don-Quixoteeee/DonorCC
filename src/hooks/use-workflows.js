import { useState, useEffect } from 'react'

export function useWorkflows(page = 1, limit = 20, filters = {}) {
	const [workflows, setWorkflows] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const fetchWorkflows = async () => {
		setLoading(true)
		setError(null)
		try {
			const params = new URLSearchParams({ page, limit, ...filters })
			const res = await fetch(`/api/workflows?${params}`)
			const data = await res.json()
			setWorkflows(data.workflows || [])
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => { fetchWorkflows() }, [page, limit, JSON.stringify(filters)])
	return { workflows, loading, error, refetch: fetchWorkflows }
}