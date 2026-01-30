/**
 * Campaign Status Badge Component
 * TODO: Implement status badge for campaign states
 */

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function CampaignStatusBadge({ status, className }) {
  const statusVariants = {
    draft: 'secondary',
    active: 'success',
    paused: 'warning',
    completed: 'info',
    cancelled: 'destructive',
  }
  const variant = statusVariants[status?.toLowerCase()] || 'default'
  const formatted = status ? status.charAt(0).toUpperCase() + status.slice(1) : 'Unknown'
  return (
    <Badge variant={variant} className={className}>{formatted}</Badge>
  )
}

// TODO: Example usage:
// <CampaignStatusBadge status="active" />
// <CampaignStatusBadge status="draft" className="ml-2" />