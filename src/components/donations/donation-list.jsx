/**
 * Donation List Component
 * TODO: Implement table for displaying donations with filtering and sorting
 */

import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function DonationList({ donations, onEdit, onDelete, isLoading }) {
  const [sortField, setSortField] = useState('date')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filters, setFilters] = useState({
    donorName: '',
    donationType: '',
    minAmount: '',
    maxAmount: '',
  })

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value })
  }

  // Simple filtering and sorting logic
  let filteredAndSortedDonations = donations
    .filter(d =>
      (!filters.donorName || `${d.donor?.firstName || ''} ${d.donor?.lastName || ''}`.toLowerCase().includes(filters.donorName.toLowerCase())) &&
      (!filters.donationType || d.type === filters.donationType) &&
      (!filters.minAmount || d.amount >= Number(filters.minAmount)) &&
      (!filters.maxAmount || d.amount <= Number(filters.maxAmount))
    )
    .sort((a, b) => {
      let valA = a[sortField]
      let valB = b[sortField]
      if (valA < valB) return sortDirection === 'asc' ? -1 : 1
      if (valA > valB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <input name="donorName" value={filters.donorName} onChange={handleFilterChange} placeholder="Donor name" className="input" />
        <select name="donationType" value={filters.donationType} onChange={handleFilterChange} className="input">
          <option value="">All Types</option>
          <option value="ONE_TIME">One Time</option>
          <option value="RECURRING">Recurring</option>
          <option value="PLEDGE">Pledge</option>
          <option value="IN_KIND">In Kind</option>
        </select>
        <input name="minAmount" type="number" value={filters.minAmount} onChange={handleFilterChange} placeholder="Min Amount" className="input" />
        <input name="maxAmount" type="number" value={filters.maxAmount} onChange={handleFilterChange} placeholder="Max Amount" className="input" />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead onClick={() => handleSort('date')}>Date</TableHead>
              <TableHead onClick={() => handleSort('donor')}>Donor</TableHead>
              <TableHead onClick={() => handleSort('amount')}>Amount</TableHead>
              <TableHead onClick={() => handleSort('type')}>Type</TableHead>
              <TableHead onClick={() => handleSort('campaign')}>Campaign</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6}>Loading...</TableCell></TableRow>
            ) : filteredAndSortedDonations.length === 0 ? (
              <TableRow><TableCell colSpan={6}>No donations found.</TableCell></TableRow>
            ) : (
              filteredAndSortedDonations.map(donation => (
                <TableRow key={donation.id}>
                  <TableCell>{donation.date}</TableCell>
                  <TableCell>{donation.donor ? `${donation.donor.firstName} ${donation.donor.lastName}` : 'Unknown'}</TableCell>
                  <TableCell>${donation.amount.toFixed(2)}</TableCell>
                  <TableCell><Badge>{donation.type}</Badge></TableCell>
                  <TableCell>{donation.campaign?.name || '—'}</TableCell>
                  <TableCell>
                    <Button size="sm" onClick={() => onEdit(donation)}>Edit</Button>
                    <Button size="sm" variant="destructive" onClick={() => onDelete(donation)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

// TODO: Example usage:
// <DonationList 
//   donations={donations}
//   onEdit={handleEditDonation}
//   onDelete={handleDeleteDonation}
//   isLoading={isLoading}
// />