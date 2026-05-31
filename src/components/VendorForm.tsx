import { useState } from 'react'
import type { Vendor, VendorDraft } from '../types'

interface VendorFormProps {
  vendor?: Vendor
  onCancel: () => void
  onSave: (draft: VendorDraft) => void
}

const emptyDraft: VendorDraft = {
  vendorName: '',
  industry: '',
  location: '',
  annualRevenue: 0,
  yearsInBusiness: 0,
  employeeCount: 0,
  debtRatio: 0,
  paymentDelaysPastYear: 0,
  revenueTrend: 'Stable',
  criticality: 'Medium',
  lastReviewed: new Date().toISOString().slice(0, 10),
}

export const VendorForm = ({ vendor, onCancel, onSave }: VendorFormProps) => {
  const [draft, setDraft] = useState<VendorDraft>(vendor ? { ...vendor } : emptyDraft)
  const [error, setError] = useState('')

  const update = (key: keyof VendorDraft, value: string | number) => setDraft((current) => ({ ...current, [key]: value }))
  const numberUpdate = (key: keyof VendorDraft, value: string) => update(key, Number(value))

  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    if (!draft.vendorName.trim() || !draft.industry.trim() || !draft.location.trim() || !draft.lastReviewed) {
      setError('Vendor name, industry, location, and review date are required.')
      return
    }
    if ([draft.annualRevenue, draft.yearsInBusiness, draft.employeeCount, draft.debtRatio, draft.paymentDelaysPastYear].some((value) => value < 0)) {
      setError('Numeric values cannot be negative.')
      return
    }
    if (draft.debtRatio > 1) {
      setError('Debt ratio must be between 0 and 1. Use 0.55 for 55%.')
      return
    }
    onSave(draft)
  }

  return (
    <>
      <button className="text-button" onClick={onCancel}>← Back to dashboard</button>
      <section className="form-card panel">
        <div className="section-heading"><div><span className="eyebrow">Vendor record</span><h2>{vendor ? 'Edit vendor' : 'Add a vendor'}</h2><p>Enter mock or approved non-sensitive information for this local demo.</p></div></div>
        <form onSubmit={submit}>
          <div className="form-grid">
            <label><span>Vendor name</span><input value={draft.vendorName} onChange={(event) => update('vendorName', event.target.value)} required /></label>
            <label><span>Industry</span><input value={draft.industry} onChange={(event) => update('industry', event.target.value)} required /></label>
            <label><span>Location</span><input value={draft.location} onChange={(event) => update('location', event.target.value)} required /></label>
            <label><span>Annual revenue ($)</span><input type="number" min="0" value={draft.annualRevenue} onChange={(event) => numberUpdate('annualRevenue', event.target.value)} /></label>
            <label><span>Years in business</span><input type="number" min="0" value={draft.yearsInBusiness} onChange={(event) => numberUpdate('yearsInBusiness', event.target.value)} /></label>
            <label><span>Employee count</span><input type="number" min="0" value={draft.employeeCount} onChange={(event) => numberUpdate('employeeCount', event.target.value)} /></label>
            <label><span>Debt ratio</span><input type="number" min="0" max="1" step="0.01" value={draft.debtRatio} onChange={(event) => numberUpdate('debtRatio', event.target.value)} /><small>Enter 0.55 for 55%.</small></label>
            <label><span>Payment delays, past year</span><input type="number" min="0" value={draft.paymentDelaysPastYear} onChange={(event) => numberUpdate('paymentDelaysPastYear', event.target.value)} /></label>
            <label><span>Revenue trend</span><select value={draft.revenueTrend} onChange={(event) => update('revenueTrend', event.target.value)}><option>Growing</option><option>Stable</option><option>Declining</option></select></label>
            <label><span>Business criticality</span><select value={draft.criticality} onChange={(event) => update('criticality', event.target.value)}><option>Low</option><option>Medium</option><option>High</option></select></label>
            <label><span>Last reviewed</span><input type="date" value={draft.lastReviewed} onChange={(event) => update('lastReviewed', event.target.value)} required /></label>
          </div>
          {error && <p className="form-error">{error}</p>}
          <div className="form-actions"><button className="button secondary" type="button" onClick={onCancel}>Cancel</button><button className="button primary" type="submit">Save vendor</button></div>
        </form>
      </section>
    </>
  )
}
