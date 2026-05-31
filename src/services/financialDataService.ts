import type { Vendor } from '../types'

// Future API integrations belong here. The MVP intentionally uses local mock data only.
// Possible sources include commercial credit APIs, customer questionnaires, CSV exports,
// or public filings for publicly traded vendors.
export const fetchVendorFinancialData = async (): Promise<Vendor[]> => {
  return Promise.resolve([])
}
