/**
 * Donor Status Badge Component
 * TODO: Implement status badge for donor states
 */

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function DonorStatusBadge({ status, className }) {
  const statusVariants = {
    ACTIVE: 'success',
    INACTIVE: 'secondary',
    LAPSED: 'warning',
    PROSPECTIVE: 'info',
  }
  const variant = statusVariants[status?.toUpperCase()] || 'default'
  const formatted = status ? status.charAt(0).toUpperCase() + status.slice(1).toLowerCase() : 'Unknown'
  return (
    <Badge variant={variant} className={className}>{formatted}</Badge>
  )
}

// TODO: Example usage:
// <DonorStatusBadge status="ACTIVE" />
// <DonorStatusBadge status="LAPSED" className="ml-2" />