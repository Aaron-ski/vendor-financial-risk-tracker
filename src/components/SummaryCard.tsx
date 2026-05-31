interface SummaryCardProps {
  label: string
  value: number
  tone: 'neutral' | 'danger' | 'warning' | 'success'
}

export const SummaryCard = ({ label, value, tone }: SummaryCardProps) => (
  <article className={`summary-card ${tone}`}>
    <span>{label}</span>
    <strong>{value}</strong>
  </article>
)
