import { useState, useMemo } from 'react'
import type { MenuSection, MenuItem } from '@/lib/types'

interface CatalogProps {
  catalog: MenuSection[]
  dbSynced: boolean
  syncing: boolean
  onEdit: (catId: string, itemId: string) => void
  onDelete: (catId: string, itemId: string) => void
  onAddNew: () => void
  onExport: () => void
  onSync: () => void
}

function priceLabel(item: MenuItem): string {
  const vs = item.variants || (item.price != null ? [{ label: '', price: item.price }] : [])
  if (vs.length === 0) return '—'
  if (vs.length === 1) return `€${Number(vs[0].price).toFixed(2)}`
  const min = Math.min(...vs.map((v) => Number(v.price)))
  return `da €${min.toFixed(2)}`
}

export default function Catalog({ catalog, dbSynced, syncing, onEdit, onDelete, onAddNew, onExport, onSync }: CatalogProps) {
  const [query, setQuery] = useState('')
  const [catFilter, setCatFilter] = useState('all')

  const groups = useMemo(() => {
    const q = query.trim().toLowerCase()
    return catalog
      .filter((sec) => catFilter === 'all' || sec.id === catFilter)
      .map((sec) => ({
        ...sec,
        items: sec.items.filter(
          (it) => !q || it.name.toLowerCase().includes(q) || (it.desc || '').toLowerCase().includes(q)
        ),
      }))
      .filter((sec) => sec.items.length > 0)
  }, [catalog, query, catFilter])

  const total = groups.reduce((s, g) => s + g.items.length, 0)

  return (
    <div>
      {!dbSynced && (
        <div className="sync-banner">
          <div>
            <strong>DATABASE VUOTO</strong> — Stai vedendo il catalogo statico di default.
            Importalo nel database per poter modificare i prodotti online.
          </div>
          <button className="btn-primary-sm" onClick={onSync} disabled={syncing}>
            {syncing ? 'IMPORTAZIONE…' : '↑ CARICA NEL DATABASE'}
          </button>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 className="admin-h1">CATALOGO <span className="accent">PRODOTTI</span></h1>
          <p className="admin-lead">Gestisci i prodotti già in menu. Modifica, elimina o aggiungine di nuovi.</p>
        </div>
        <div style={{ display: 'flex', gap: 10, marginBottom: 28 }}>
          <button className="btn-outline-sm" onClick={onExport}>↓ ESPORTA JSON</button>
          <button className="btn-primary-sm" onClick={onAddNew}>+ NUOVO PRODOTTO</button>
        </div>
      </div>

      <div className="cat-toolbar">
        <input
          className="inp"
          placeholder="Cerca per nome o descrizione…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <select className="sel" value={catFilter} onChange={(e) => setCatFilter(e.target.value)}>
          <option value="all">Tutte le categorie</option>
          {catalog.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        <span className="toolbar-count">{total} prodotti</span>
      </div>

      {groups.length === 0 ? (
        <div className="empty-state">
          <div style={{ fontSize: 48 }}>🔍</div>
          <div className="big">NESSUN PRODOTTO</div>
          <div>Prova a cambiare ricerca o filtro.</div>
        </div>
      ) : (
        groups.map((sec) => (
          <div className="cat-group" key={sec.id}>
            <div className="cat-group-head">
              <h3>{sec.label}</h3>
              <span className="ct">{sec.items.length} prodotti</span>
            </div>
            {sec.items.map((item) => (
              <div className="prod-row" key={item.id}>
                {item.img
                  ? <img className="prod-thumb" src={item.img} alt="" loading="lazy" />
                  : <div className="prod-thumb placeholder">🍔</div>}
                <div className="prod-info">
                  <div className="prod-name">
                    {item.name}
                    {item.featured && <span className="mini-badge feat">FEAT</span>}
                    {(item.badges || []).map((b) => (
                      <span key={b} className={`mini-badge ${b.toLowerCase()}`}>{b}</span>
                    ))}
                  </div>
                  {item.desc && <div className="prod-desc">{item.desc}</div>}
                </div>
                <span className="prod-price">{priceLabel(item)}</span>
                <div className="prod-actions">
                  <button className="icon-btn" title="Modifica" onClick={() => onEdit(sec.id, item.id)}>✎</button>
                  <button className="icon-btn del" title="Elimina" onClick={() => onDelete(sec.id, item.id)}>🗑</button>
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
