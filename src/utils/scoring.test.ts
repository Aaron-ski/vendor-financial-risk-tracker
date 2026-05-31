import { strict as assert } from 'node:assert'
import vendors from '../data/vendors.json'
import { calculateAssessment } from './scoring'
import type { Vendor } from '../types'

const vendorList = vendors as Vendor[]

assert.equal(calculateAssessment(vendorList[0]).score, 90)
assert.equal(calculateAssessment(vendorList[2]).score, 25)
assert.equal(calculateAssessment(vendorList[3]).score, 100)
assert.equal(calculateAssessment(vendorList[7]).riskLevel, 'High Risk')

console.log('Scoring checks passed.')
