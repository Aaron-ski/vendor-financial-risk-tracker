import type { Criticality, RevenueTrend, Vendor } from '../types'

const HEADERS = [
  'vendorName',
  'industry',
  'location',
  'annualRevenue',
  'yearsInBusiness',
  'employeeCount',
  'debtRatio',
  'paymentDelaysPastYear',
  'revenueTrend',
  'criticality',
  'lastReviewed',
]

const escapeCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`

export const exportVendorsCsv = (vendors: Vendor[]) => {
  const lines = [
    HEADERS.join(','),
    ...vendors.map((vendor) => HEADERS.map((header) => escapeCell(vendor[header as keyof Vendor] as string | number)).join(',')),
  ]
  const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'vendor-financial-risk-report.csv'
  anchor.click()
  URL.revokeObjectURL(url)
}

const parseCsvLine = (line: string) => {
  const cells: string[] = []
  let current = ''
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === '"' && line[index + 1] === '"' && quoted) {
      current += '"'
      index += 1
    } else if (char === '"') {
      quoted = !quoted
    } else if (char === ',' && !quoted) {
      cells.push(current.trim())
      current = ''
    } else {
      current += char
    }
  }
  cells.push(current.trim())
  return cells
}

export const parseVendorsCsv = (content: string): Vendor[] => {
  const lines = content.split(/\r?\n/).filter(Boolean)
  if (lines.length < 2) throw new Error('The CSV file does not contain any vendor rows.')

  const headers = parseCsvLine(lines[0])
  const missingHeaders = HEADERS.filter((header) => !headers.includes(header))
  if (missingHeaders.length) throw new Error(`Missing columns: ${missingHeaders.join(', ')}`)

  return lines.slice(1).map((line, index) => {
    const row = Object.fromEntries(headers.map((header, cellIndex) => [header, parseCsvLine(line)[cellIndex] ?? '']))
    const vendorName = row.vendorName.trim()
    const revenueTrend = row.revenueTrend as RevenueTrend
    const criticality = row.criticality as Criticality

    if (!vendorName) throw new Error(`Row ${index + 2}: vendorName is required.`)
    if (!['Growing', 'Stable', 'Declining'].includes(revenueTrend)) throw new Error(`Row ${index + 2}: revenueTrend must be Growing, Stable, or Declining.`)
    if (!['Low', 'Medium', 'High'].includes(criticality)) throw new Error(`Row ${index + 2}: criticality must be Low, Medium, or High.`)

    const numberValue = (key: string) => {
      const value = Number(row[key])
      if (!Number.isFinite(value) || value < 0) throw new Error(`Row ${index + 2}: ${key} must be a non-negative number.`)
      return value
    }

    return {
      id: `import-${Date.now()}-${index}`,
      vendorName,
      industry: row.industry,
      location: row.location,
      annualRevenue: numberValue('annualRevenue'),
      yearsInBusiness: numberValue('yearsInBusiness'),
      employeeCount: numberValue('employeeCount'),
      debtRatio: numberValue('debtRatio'),
      paymentDelaysPastYear: numberValue('paymentDelaysPastYear'),
      revenueTrend,
      criticality,
      lastReviewed: row.lastReviewed,
      scoreHistory: [],
    }
  })
}
