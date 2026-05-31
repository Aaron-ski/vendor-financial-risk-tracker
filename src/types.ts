export type RevenueTrend = 'Growing' | 'Stable' | 'Declining'
export type Criticality = 'Low' | 'Medium' | 'High'
export type RiskLevel = 'Low Risk' | 'Moderate Risk' | 'High Risk'

export interface ScoreHistoryPoint {
  date: string
  score: number
}

export interface Vendor {
  id: string
  vendorName: string
  industry: string
  location: string
  annualRevenue: number
  yearsInBusiness: number
  employeeCount: number
  debtRatio: number
  paymentDelaysPastYear: number
  revenueTrend: RevenueTrend
  criticality: Criticality
  lastReviewed: string
  scoreHistory: ScoreHistoryPoint[]
}

export type VendorDraft = Omit<Vendor, 'id' | 'scoreHistory'>
