import { useState, useEffect } from 'react'

export function useCampaigns(page = 1, limit = 20, filters = {}) {
	const [campaigns, setCampaigns] = useState([])
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const fetchCampaigns = async () => {
		setLoading(true)
		setError(null)
		try {
			const params = new URLSearchParams({ page, limit, ...filters })
			const res = await fetch(`/api/campaigns?${params}`)
			const data = await res.json()
			setCampaigns(data.campaigns || [])
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => { fetchCampaigns() }, [page, limit, JSON.stringify(filters)])
	return { campaigns, loading, error, refetch: fetchCampaigns }
}

export function useCampaign(campaignId) {
	const [campaign, setCampaign] = useState(null)
	const [loading, setLoading] = useState(false)
	const [error, setError] = useState(null)
	const fetchCampaign = async () => {
		if (!campaignId) return
		setLoading(true)
		setError(null)
		try {
			const res = await fetch(`/api/campaigns/${campaignId}`)
			const data = await res.json()
			setCampaign(data.campaign || null)
		} catch (err) {
			setError(err)
		} finally {
			setLoading(false)
		}
	}
	useEffect(() => { fetchCampaign() }, [campaignId])
	return { campaign, loading, error, refetch: fetchCampaign }
}