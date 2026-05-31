import type { RiskLevel } from '../types'

export const RiskBadge = ({ level }: { level: RiskLevel }) => (
  <span className={`risk-badge ${level.toLowerCase().replaceAll(' ', '-')}`}>{level}</span>
)
