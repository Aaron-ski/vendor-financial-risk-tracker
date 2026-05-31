import sampleVendors from '../data/vendors.json'
import type { Vendor } from '../types'

const STORAGE_KEY = 'vendor-risk-tracker-vendors'

export const getSampleVendors = () => structuredClone(sampleVendors) as Vendor[]

export const loadVendors = (): Vendor[] => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) return getSampleVendors()

  try {
    return JSON.parse(stored) as Vendor[]
  } catch {
    return getSampleVendors()
  }
}

export const saveVendors = (vendors: Vendor[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(vendors))
}

export const resetVendors = () => {
  const vendors = getSampleVendors()
  saveVendors(vendors)
  return vendors
}
