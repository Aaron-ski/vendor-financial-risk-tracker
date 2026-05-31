import type { Vendor } from '../types'
import { calculateAssessment } from '../utils/scoring'
import { RecommendationPanel } from './RecommendationPanel'
import { RiskBadge } from './RiskBadge'
import { TrendChart } from './TrendChart'

interface VendorDetailProps {
  vendor: Vendor
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export const VendorDetail = ({ vendor, onBack, onEdit, onDelete }: VendorDetailProps) => {
  const assessment = calculateAssessment(vendor)

  return (
    <>
      <button className="text-button" onClick={onBack}>← Back to dashboard</button>
      <section className="detail-hero">
        <div>
          <span className="eyebrow">{vendor.industry} · {vendor.location}</span>
          <h2>{vendor.vendorName}</h2>
          <p>Last reviewed {vendor.lastReviewed} · {vendor.criticality} business criticality</p>
        </div>
        <div className="detail-actions"><button className="button secondary" onClick={onEdit}>Edit vendor</button><button className="button danger-button" onClick={onDelete}>Delete</button></div>
      </section>
      <section className="detail-grid">
        <section className="score-panel panel">
          <span className="eyebrow">Financial health score</span>
          <div className="score-display"><strong>{assessment.score}</strong><span>/ 100</span></div>
          <RiskBadge level={assessment.riskLevel} />
          <p>Higher scores indicate a healthier financial profile based on this demo's review rules.</p>
        </section>
        <section className="panel">
          <div className="section-heading"><div><span className="eyebrow">Scoring breakdown</span><h3>Why this score?</h3></div></div>
          {assessment.factors.length ? (
            <ul className="factor-list">{assessment.factors.map((factor) => <li key={factor.label}><div><strong>{factor.label}</strong><span>{factor.detail}</span></div><b>{factor.impact}</b></li>)}</ul>
          ) : <p className="empty-inline">No score deductions. This vendor currently meets the healthy-profile thresholds.</p>}
        </section>
      </section>
      <section className="detail-grid">
        <section className="panel profile-panel">
          <div className="section-heading"><div><span className="eyebrow">Vendor profile</span><h3>Review inputs</h3></div></div>
          <dl>
            <div><dt>Annual revenue</dt><dd>{money.format(vendor.annualRevenue)}</dd></div>
            <div><dt>Years in business</dt><dd>{vendor.yearsInBusiness}</dd></div>
            <div><dt>Employee count</dt><dd>{vendor.employeeCount}</dd></div>
            <div><dt>Debt ratio</dt><dd>{Math.round(vendor.debtRatio * 100)}%</dd></div>
            <div><dt>Payment delays, past year</dt><dd>{vendor.paymentDelaysPastYear}</dd></div>
            <div><dt>Revenue trend</dt><dd>{vendor.revenueTrend}</dd></div>
          </dl>
        </section>
        <section className="panel">
          <div className="section-heading"><div><span className="eyebrow">Score trend</span><h3>Review history</h3></div></div>
          <TrendChart history={vendor.scoreHistory} />
        </section>
      </section>
      <RecommendationPanel recommendations={assessment.recommendations} />
    </>
  )
}
