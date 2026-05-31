import type { RiskLevel, Vendor } from '../types'
import { calculateAssessment } from '../utils/scoring'
import { RiskDistributionChart } from './RiskDistributionChart'
import { SummaryCard } from './SummaryCard'
import { VendorTable } from './VendorTable'

export const Dashboard = ({ vendors, onSelect }: { vendors: Vendor[]; onSelect: (vendor: Vendor) => void }) => {
  const counts: Record<RiskLevel, number> = { 'High Risk': 0, 'Moderate Risk': 0, 'Low Risk': 0 }
  vendors.forEach((vendor) => { counts[calculateAssessment(vendor).riskLevel] += 1 })

  return (
    <>
      <section className="hero">
        <div>
          <span className="eyebrow">Financial health monitoring</span>
          <h2>Know which vendor relationships need attention.</h2>
          <p>Review a transparent risk score based on the financial indicators your team tracks.</p>
        </div>
        <div className="hero-note"><strong>Demo data only</strong><span>Local browser storage · No external API</span></div>
      </section>
      <section className="summary-grid">
        <SummaryCard label="Total vendors" value={vendors.length} tone="neutral" />
        <SummaryCard label="High risk" value={counts['High Risk']} tone="danger" />
        <SummaryCard label="Moderate risk" value={counts['Moderate Risk']} tone="warning" />
        <SummaryCard label="Low risk" value={counts['Low Risk']} tone="success" />
      </section>
      <section className="dashboard-grid">
        <VendorTable vendors={vendors} onSelect={onSelect} />
        <RiskDistributionChart counts={counts} />
      </section>
    </>
  )
}
