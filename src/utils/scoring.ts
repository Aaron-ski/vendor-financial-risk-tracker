import type { RiskLevel, Vendor } from '../types'

export interface ScoreFactor {
  label: string
  impact: number
  detail: string
}

export interface VendorAssessment {
  score: number
  riskLevel: RiskLevel
  factors: ScoreFactor[]
  recommendations: string[]
}

export const calculateAssessment = (vendor: Vendor): VendorAssessment => {
  const factors: ScoreFactor[] = []

  if (vendor.revenueTrend === 'Declining') {
    factors.push({ label: 'Declining revenue', impact: -20, detail: 'Revenue is trending downward.' })
  } else if (vendor.revenueTrend === 'Stable') {
    factors.push({ label: 'Stable revenue', impact: -8, detail: 'Revenue is steady but not growing.' })
  }

  if (vendor.debtRatio > 0.65) {
    factors.push({ label: 'High debt ratio', impact: -15, detail: 'Debt ratio is above 65%.' })
  } else if (vendor.debtRatio >= 0.45) {
    factors.push({ label: 'Elevated debt ratio', impact: -8, detail: 'Debt ratio is between 45% and 65%.' })
  }

  const paymentDelayImpact = Math.min(vendor.paymentDelaysPastYear * 5, 25)
  if (paymentDelayImpact > 0) {
    factors.push({
      label: 'Payment delays',
      impact: -paymentDelayImpact,
      detail: `${vendor.paymentDelaysPastYear} payment delay${vendor.paymentDelaysPastYear === 1 ? '' : 's'} reported in the past year.`,
    })
  }

  if (vendor.yearsInBusiness < 2) {
    factors.push({ label: 'New business', impact: -10, detail: 'Operating history is less than two years.' })
  }

  if (vendor.annualRevenue < 500000) {
    factors.push({ label: 'Smaller revenue base', impact: -5, detail: 'Annual revenue is below $500,000.' })
  }

  const score = Math.max(0, 100 + factors.reduce((sum, factor) => sum + factor.impact, 0))
  const riskLevel: RiskLevel = score >= 80 ? 'Low Risk' : score >= 60 ? 'Moderate Risk' : 'High Risk'
  const recommendations = getRecommendations(vendor, riskLevel)

  return { score, riskLevel, factors, recommendations }
}

const getRecommendations = (vendor: Vendor, riskLevel: RiskLevel) => {
  const recommendations: string[] = []

  if (vendor.debtRatio > 0.65) recommendations.push('Request updated financial statements or a management explanation.')
  if (vendor.revenueTrend === 'Declining') recommendations.push('Review dependency on this vendor and identify backup suppliers.')
  if (vendor.paymentDelaysPastYear >= 2) recommendations.push('Increase monitoring frequency or request payment references.')
  if (vendor.yearsInBusiness < 2) recommendations.push('Limit exposure until more operating history is available.')
  if (vendor.criticality === 'High' && riskLevel !== 'Low Risk') recommendations.push('Create a mitigation plan and identify alternate vendors.')
  if (recommendations.length === 0) recommendations.push('Continue the standard review schedule and monitor for changes.')

  return recommendations
}
