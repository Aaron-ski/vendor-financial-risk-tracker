import { useMemo, useState } from 'react'
import type { RiskLevel, Vendor } from '../types'
import { calculateAssessment } from '../utils/scoring'
import { RiskBadge } from './RiskBadge'

interface VendorTableProps {
  vendors: Vendor[]
  onSelect: (vendor: Vendor) => void
}

type SortKey = 'vendorName' | 'score' | 'lastReviewed'

export const VendorTable = ({ vendors, onSelect }: VendorTableProps) => {
  const [search, setSearch] = useState('')
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'All'>('All')
  const [sortKey, setSortKey] = useState<SortKey>('score')

  const filteredVendors = useMemo(() => {
    const normalizedSearch = search.toLowerCase()
    return [...vendors]
      .filter((vendor) => {
        const assessment = calculateAssessment(vendor)
        return (riskFilter === 'All' || assessment.riskLevel === riskFilter)
          && `${vendor.vendorName} ${vendor.industry} ${vendor.location}`.toLowerCase().includes(normalizedSearch)
      })
      .sort((a, b) => {
        if (sortKey === 'score') return calculateAssessment(a).score - calculateAssessment(b).score
        return a[sortKey].localeCompare(b[sortKey])
      })
  }, [riskFilter, search, sortKey, vendors])

  return (
    <section className="panel vendor-table-panel">
      <div className="table-header">
        <div>
          <span className="eyebrow">Vendor watchlist</span>
          <h3>Financial health reviews</h3>
        </div>
        <span className="record-count">{filteredVendors.length} records</span>
      </div>
      <div className="table-tools">
        <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search vendor, industry, or location" />
        <select value={riskFilter} onChange={(event) => setRiskFilter(event.target.value as RiskLevel | 'All')}>
          <option>All</option>
          <option>High Risk</option>
          <option>Moderate Risk</option>
          <option>Low Risk</option>
        </select>
        <select value={sortKey} onChange={(event) => setSortKey(event.target.value as SortKey)}>
          <option value="score">Sort: Highest risk</option>
          <option value="vendorName">Sort: Vendor name</option>
          <option value="lastReviewed">Sort: Last reviewed</option>
        </select>
      </div>
      {filteredVendors.length ? (
        <div className="table-scroll">
          <table>
            <thead><tr><th>Vendor</th><th>Criticality</th><th>Health score</th><th>Risk</th><th>Last reviewed</th></tr></thead>
            <tbody>
              {filteredVendors.map((vendor) => {
                const assessment = calculateAssessment(vendor)
                return (
                  <tr key={vendor.id} onClick={() => onSelect(vendor)}>
                    <td><strong>{vendor.vendorName}</strong><span>{vendor.industry} · {vendor.location}</span></td>
                    <td>{vendor.criticality}</td>
                    <td><strong>{assessment.score}</strong><span>out of 100</span></td>
                    <td><RiskBadge level={assessment.riskLevel} /></td>
                    <td>{vendor.lastReviewed}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : <div className="empty-state"><h4>No vendors match these filters.</h4><p>Adjust the search or risk filter to view records.</p></div>}
    </section>
  )
}
