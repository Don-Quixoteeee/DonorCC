/**
 * Confirm Dialog Component - Reusable confirmation dialog
 * TODO: Implement confirmation dialog for destructive actions
 */

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'

import { useState } from 'react'
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'destructive',
}) {
  const [loading, setLoading] = useState(false)

  const handleConfirm = async () => {
    setLoading(true)
    try {
      await onConfirm()
      onClose()
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>{cancelText}</Button>
          <Button variant={variant} onClick={handleConfirm} loading={loading}>{confirmText}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// TODO: Example usage:
// <ConfirmDialog
//   isOpen={showDeleteDialog}
//   onClose={() => setShowDeleteDialog(false)}
//   onConfirm={handleDeleteDonor}
//   title="Delete Donor"
//   description="Are you sure you want to delete this donor? This action cannot be undone."
//   confirmText="Delete"
//   variant="destructive"
// />