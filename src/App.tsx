import { useEffect, useRef, useState } from 'react'
import './App.css'
import { Dashboard } from './components/Dashboard'
import { VendorDetail } from './components/VendorDetail'
import { VendorForm } from './components/VendorForm'
import type { Vendor, VendorDraft } from './types'
import { exportVendorsCsv, parseVendorsCsv } from './utils/csv'
import { calculateAssessment } from './utils/scoring'
import { loadVendors, resetVendors, saveVendors } from './utils/storage'

type View = { name: 'dashboard' } | { name: 'detail'; vendorId: string } | { name: 'form'; vendorId?: string }
type Theme = 'dark' | 'light'

const App = () => {
  const [vendors, setVendors] = useState(loadVendors)
  const [view, setView] = useState<View>({ name: 'dashboard' })
  const [message, setMessage] = useState('')
  const [theme, setTheme] = useState<Theme>(() => localStorage.getItem('vendor-risk-tracker-theme') === 'light' ? 'light' : 'dark')
  const importInput = useRef<HTMLInputElement>(null)
  const selectedVendor = view.name !== 'dashboard' && view.vendorId ? vendors.find((vendor) => vendor.id === view.vendorId) : undefined

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('vendor-risk-tracker-theme', theme)
  }, [theme])

  const persist = (next: Vendor[], nextMessage: string) => {
    setVendors(next)
    saveVendors(next)
    setMessage(nextMessage)
  }

  const saveVendor = (draft: VendorDraft) => {
    if (selectedVendor) {
      const updated = { ...selectedVendor, ...draft }
      const score = calculateAssessment(updated).score
      updated.scoreHistory = [...selectedVendor.scoreHistory, { date: draft.lastReviewed, score }].slice(-6)
      persist(vendors.map((vendor) => vendor.id === selectedVendor.id ? updated : vendor), 'Vendor record updated.')
    } else {
      const id = `vendor-${Date.now()}`
      const vendor: Vendor = { id, ...draft, scoreHistory: [] }
      vendor.scoreHistory = [{ date: vendor.lastReviewed, score: calculateAssessment(vendor).score }]
      persist([...vendors, vendor], 'Vendor record added.')
    }
    setView({ name: 'dashboard' })
  }

  const deleteVendor = () => {
    if (!selectedVendor || !window.confirm(`Delete ${selectedVendor.vendorName}?`)) return
    persist(vendors.filter((vendor) => vendor.id !== selectedVendor.id), 'Vendor record deleted.')
    setView({ name: 'dashboard' })
  }

  const handleReset = () => {
    if (!window.confirm('Reset all changes and restore the original sample data?')) return
    setVendors(resetVendors())
    setView({ name: 'dashboard' })
    setMessage('Demo data restored.')
  }

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    try {
      const imported = parseVendorsCsv(await file.text())
      persist(imported, `${imported.length} vendor records imported.`)
      setView({ name: 'dashboard' })
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Unable to import this CSV file.')
    } finally {
      event.target.value = ''
    }
  }

  return (
    <div className="app-shell">
      <header>
        <div className="brand" onClick={() => setView({ name: 'dashboard' })}>
          <div className="brand-mark">VF</div>
          <div><h1>Vendor Financial Risk</h1><span>Health Tracker · Demo</span></div>
        </div>
        <nav>
          <button className="button secondary" onClick={() => importInput.current?.click()}>Import CSV</button>
          <input ref={importInput} type="file" accept=".csv,text/csv" hidden onChange={handleImport} />
          <button className="button secondary" onClick={() => exportVendorsCsv(vendors)}>Export CSV</button>
          <button className="button secondary" onClick={handleReset}>Reset demo data</button>
          <button className="button theme-button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}>
            <span aria-hidden="true">{theme === 'dark' ? '☀' : '☾'}</span> {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>
          <button className="button primary" onClick={() => setView({ name: 'form' })}>+ Add vendor</button>
        </nav>
      </header>
      {message && <div className="notice" role="status"><span>{message}</span><button onClick={() => setMessage('')}>×</button></div>}
      <main>
        {view.name === 'dashboard' && <Dashboard vendors={vendors} onSelect={(vendor) => setView({ name: 'detail', vendorId: vendor.id })} />}
        {view.name === 'detail' && selectedVendor && <VendorDetail vendor={selectedVendor} onBack={() => setView({ name: 'dashboard' })} onEdit={() => setView({ name: 'form', vendorId: selectedVendor.id })} onDelete={deleteVendor} />}
        {view.name === 'form' && <VendorForm vendor={selectedVendor} onCancel={() => setView({ name: 'dashboard' })} onSave={saveVendor} />}
      </main>
      <footer>Portfolio demo · Mock data only · Not financial, legal, or compliance advice</footer>
    </div>
  )
}

export default App
