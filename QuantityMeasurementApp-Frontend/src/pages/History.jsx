import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import * as api from '../api/client'
import './Page.css'
import './History.css'

function resultUnitClassName(unit) {
  const s = String(unit ?? '').toLowerCase()
  if (s === 'true') return 'history-unit history-unit--bool is-true'
  if (s === 'false') return 'history-unit history-unit--bool is-false'
  return 'history-unit'
}

function formatTimestamp(ts) {
  if (ts == null) return '—'
  if (typeof ts === 'string') return ts
  if (Array.isArray(ts) && ts.length >= 6) {
    const [y, mo, d, h, mi, s] = ts
    const pad = (n) => String(n).padStart(2, '0')
    return `${y}-${pad(mo)}-${pad(d)} ${pad(h)}:${pad(mi)}:${pad(s)}`
  }
  return String(ts)
}

export default function History() {
  const [rows, setRows] = useState([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setError('')
    setLoading(true)
    try {
      const data = await api.fetchHistory()
      setRows(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err.message || 'Could not load history')
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <div className="page-shell history-page">
      <header className="history-header">
        <button
          type="button"
          className="btn btn-secondary history-refresh"
          onClick={load}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="history-spin" aria-hidden />
              Refreshing
            </>
          ) : (
            'Refresh'
          )}
        </button>
      </header>

      {error ? <p className="form-error history-error">{error}</p> : null}

      {!loading && rows.length === 0 && !error ? (
        <div className="history-empty card">
          <div className="history-empty-icon" aria-hidden>
            ∅
          </div>
          <h2 className="history-empty-title">No entries yet</h2>
          <p className="history-empty-text">
            Run operations from the calculator while signed in — they will show up here.
          </p>
          <Link to="/calculator" className="btn-cta">
            Open calculator
          </Link>
        </div>
      ) : null}

      {rows.length > 0 ? (
        <div className="table-wrap table-wrap--flush history-table-wrap">
          <table className="data">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>Operation</th>
                <th>Type</th>
                <th>Input 1</th>
                <th>Input 2</th>
                <th>Result</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id}>
                  <td>{formatTimestamp(r.timestamp)}</td>
                  <td>
                    <span className="history-pill">{r.operationType}</span>
                  </td>
                  <td>{r.measurementType}</td>
                  <td>
                    {r.inputValue1} {r.unit1}
                  </td>
                  <td>
                    {r.inputValue2 != null && r.unit2
                      ? `${r.inputValue2} ${r.unit2}`
                      : '—'}
                  </td>
                  <td>
                    <span className="history-result-cell">
                      {r.result}{' '}
                      <span className={resultUnitClassName(r.resultUnit)}>{r.resultUnit}</span>
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : null}
    </div>
  )
}
