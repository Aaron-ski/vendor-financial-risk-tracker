import type { ScoreHistoryPoint } from '../types'

export const TrendChart = ({ history }: { history: ScoreHistoryPoint[] }) => {
  if (!history.length) return <p className="empty-inline">Trend history will appear after future reviews.</p>

  const points = history.map((point, index) => ({
    ...point,
    x: history.length === 1 ? 50 : (index / (history.length - 1)) * 100,
    y: 100 - point.score,
  }))
  const path = points.map((point) => `${point.x},${point.y}`).join(' ')

  return (
    <div className="trend-wrap">
      <svg className="trend-chart" viewBox="0 0 100 100" role="img" aria-label="Financial health score trend">
        <line x1="0" y1="20" x2="100" y2="20" className="chart-grid" />
        <line x1="0" y1="40" x2="100" y2="40" className="chart-grid" />
        <line x1="0" y1="60" x2="100" y2="60" className="chart-grid" />
        <line x1="0" y1="80" x2="100" y2="80" className="chart-grid" />
        <polyline points={path} className="trend-line" />
        {points.map((point) => <circle key={point.date} cx={point.x} cy={point.y} r="2.4" className="trend-dot" />)}
      </svg>
      <div className="trend-labels">
        {history.map((point) => <span key={point.date}>{point.date.slice(0, 7)}<strong>{point.score}</strong></span>)}
      </div>
    </div>
  )
}
