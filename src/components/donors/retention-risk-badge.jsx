/**
 * Retention Risk Badge Component
 * TODO: Implement badge for donor retention risk levels
 */

import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

export function RetentionRiskBadge({ risk, className }) {
  const riskVariants = {
    LOW: 'success',
    MEDIUM: 'warning',
    HIGH: 'destructive',
    CRITICAL: 'destructive',
  }
  const variant = riskVariants[risk?.toUpperCase()] || 'default'
  const formatted = risk ? risk.charAt(0).toUpperCase() + risk.slice(1).toLowerCase() : 'Unknown'
  return (
    <Badge variant={variant} className={className}>{formatted}</Badge>
  )
}

// TODO: Example usage:
// <RetentionRiskBadge risk="LOW" />
// <RetentionRiskBadge risk="HIGH" className="ml-2" />