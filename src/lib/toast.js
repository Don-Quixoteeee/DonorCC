/**
 * Toast Utility Component
 * TODO: Implement toast notification system
 */

import { useState, useEffect } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState([])

  function addToast(type, message, timeout = 4000) {
    const id = Math.random().toString(36).slice(2)
    setToasts((s) => [...s, { id, type, message }])
    if (timeout) setTimeout(() => setToasts((s) => s.filter(t => t.id !== id)), timeout)
    return id
  }

  const toast = {
    success: (m) => addToast('success', m),
    error: (m) => addToast('error', m),
    info: (m) => addToast('info', m),
    warning: (m) => addToast('warning', m),
  }

  const dismissToast = (id) => setToasts((s) => s.filter(t => t.id !== id))

  return { toast, toasts, dismissToast }
}

export function Toaster() {
  const { toasts, dismissToast } = useToast()
  // lightweight render for toasts — you can mount this at root layout if desired
  return (
    <div aria-live="polite" className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map(t => (
        <div key={t.id} className={`p-3 rounded shadow text-sm ${t.type === 'success' ? 'bg-green-50 text-green-800' : t.type === 'error' ? 'bg-red-50 text-red-800' : 'bg-gray-50 text-gray-800'}`}>
          <div className="flex items-start justify-between space-x-4">
            <div>{t.message}</div>
            <button onClick={() => dismissToast(t.id)} className="text-xs text-gray-500">×</button>
          </div>
        </div>
      ))}
    </div>
  )
}

// Example usage (client components):
// const { toast } = useToast(); toast.success('Saved')