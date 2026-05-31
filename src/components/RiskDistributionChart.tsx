import type { RiskLevel } from '../types'

const LEVELS: RiskLevel[] = ['High Risk', 'Moderate Risk', 'Low Risk']

export const RiskDistributionChart = ({ counts }: { counts: Record<RiskLevel, number> }) => {
  const total = Object.values(counts).reduce((sum, count) => sum + count, 0)

  return (
    <section className="panel distribution">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Portfolio view</span>
          <h3>Risk distribution</h3>
        </div>
      </div>
      <div className="distribution-chart" aria-label="Risk distribution chart">
        {LEVELS.map((level) => (
          <div className="distribution-row" key={level}>
            <div><span>{level}</span><strong>{counts[level]}</strong></div>
            <div className="bar-track">
              <div className={`bar-fill ${level.toLowerCase().replaceAll(' ', '-')}`} style={{ width: `${total ? (counts[level] / total) * 100 : 0}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
