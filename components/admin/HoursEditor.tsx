'use client'

import { useState } from 'react'
import type { HoursEntry, ClosureEntry } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface HoursEditorProps {
  hours: HoursEntry[]
  closures: ClosureEntry[]
  onToast: (msg: string) => void
}

const DAYS = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato', 'Domenica']

function formatDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

export default function HoursEditor({ hours: initialHours, closures: initialClosures, onToast }: HoursEditorProps) {
  const [hours, setHours] = useState<HoursEntry[]>(() => {
    // Ensure all 7 days are present in order
    return DAYS.map((day) => initialHours.find((h) => h.day === day) ?? { day, closed: false, slots: [] })
  })
  const [closures, setClosures] = useState<ClosureEntry[]>(initialClosures)
  const [savingHours, setSavingHours] = useState(false)

  // New closure form state
  const [newLabel, setNewLabel] = useState('')
  const [newFrom, setNewFrom] = useState('')
  const [newTo, setNewTo] = useState('')
  const [savingClosure, setSavingClosure] = useState(false)

  // --- Hours helpers ---
  const toggleDay = (idx: number) => {
    setHours((prev) => prev.map((h, i) =>
      i === idx ? { ...h, closed: !h.closed, slots: h.closed ? (h.slots?.length ? h.slots : [{ open: '18:30', close: '23:30' }]) : h.slots } : h
    ))
  }

  const updateSlot = (dayIdx: number, slotIdx: number, field: 'open' | 'close', value: string) => {
    setHours((prev) => prev.map((h, i) => {
      if (i !== dayIdx) return h
      const slots = [...(h.slots ?? [])]
      slots[slotIdx] = { ...slots[slotIdx], [field]: value }
      return { ...h, slots }
    }))
  }

  const addSlot = (dayIdx: number) => {
    setHours((prev) => prev.map((h, i) =>
      i === dayIdx ? { ...h, slots: [...(h.slots ?? []), { open: '12:30', close: '14:30' }] } : h
    ))
  }

  const removeSlot = (dayIdx: number, slotIdx: number) => {
    setHours((prev) => prev.map((h, i) =>
      i === dayIdx ? { ...h, slots: (h.slots ?? []).filter((_, si) => si !== slotIdx) } : h
    ))
  }

  const saveHours = async () => {
    if (!supabase || savingHours) return
    setSavingHours(true)
    const { error } = await supabase.from('site_config').upsert(
      [{ key: 'weekly_hours', value: JSON.stringify(hours) }],
      { onConflict: 'key' }
    )
    setSavingHours(false)
    onToast(error ? 'ERRORE NEL SALVATAGGIO' : 'ORARI AGGIORNATI ✓')
  }

  // --- Closures helpers ---
  const addClosure = async () => {
    if (!supabase || !newFrom || savingClosure) return
    setSavingClosure(true)
    const entry: ClosureEntry = {
      id: crypto.randomUUID(),
      label: newLabel.trim() || 'Chiusura',
      from: newFrom,
      to: newTo || newFrom,
    }
    const updated = [...closures, entry]
    const { error } = await supabase.from('site_config').upsert(
      [{ key: 'closures', value: JSON.stringify(updated) }],
      { onConflict: 'key' }
    )
    if (!error) { setClosures(updated); setNewLabel(''); setNewFrom(''); setNewTo('') }
    setSavingClosure(false)
    onToast(error ? 'ERRORE NEL SALVATAGGIO' : 'CHIUSURA AGGIUNTA ✓')
  }

  const removeClosure = async (id: string) => {
    if (!supabase) return
    const updated = closures.filter((c) => c.id !== id)
    const { error } = await supabase.from('site_config').upsert(
      [{ key: 'closures', value: JSON.stringify(updated) }],
      { onConflict: 'key' }
    )
    if (!error) setClosures(updated)
    onToast(error ? 'ERRORE' : 'CHIUSURA RIMOSSA ✓')
  }

  return (
    <div className="hours-editor">

      {/* ── Weekly hours ── */}
      <section className="he-section">
        <h2 className="he-title">Orari Settimanali</h2>
        <p className="he-hint">Aggiungi o rimuovi fasce orarie per ogni giorno. Puoi avere pranzo e cena separati.</p>

        <div className="he-days">
          {hours.map((h, dayIdx) => (
            <div key={h.day} className={`he-day-row ${h.closed ? 'he-day-closed' : ''}`}>
              <div className="he-day-header">
                <span className="he-day-name">{h.day}</span>
                <button
                  className={`he-toggle ${h.closed ? 'he-toggle-closed' : 'he-toggle-open'}`}
                  onClick={() => toggleDay(dayIdx)}
                >
                  {h.closed ? 'CHIUSO' : 'APERTO'}
                </button>
              </div>

              {!h.closed && (
                <div className="he-slots">
                  {(h.slots ?? []).map((slot, slotIdx) => (
                    <div key={slotIdx} className="he-slot">
                      <input
                        className="he-time-input"
                        type="time"
                        value={slot.open}
                        onChange={(e) => updateSlot(dayIdx, slotIdx, 'open', e.target.value)}
                      />
                      <span className="he-arrow">→</span>
                      <input
                        className="he-time-input"
                        type="time"
                        value={slot.close}
                        onChange={(e) => updateSlot(dayIdx, slotIdx, 'close', e.target.value)}
                      />
                      <button className="he-remove-slot" onClick={() => removeSlot(dayIdx, slotIdx)} aria-label="Rimuovi fascia">×</button>
                    </div>
                  ))}
                  <button className="he-add-slot" onClick={() => addSlot(dayIdx)}>+ Aggiungi fascia</button>
                </div>
              )}
            </div>
          ))}
        </div>

        <button className="btn-save he-save" onClick={saveHours} disabled={savingHours}>
          {savingHours ? 'SALVATAGGIO…' : 'SALVA ORARI'}
        </button>
      </section>

      {/* ── Special closures ── */}
      <section className="he-section">
        <h2 className="he-title">Chiusure Straordinarie</h2>
        <p className="he-hint">Chiudi un giorno specifico o un periodo di ferie. Lascia "al" vuoto per un singolo giorno.</p>

        <div className="he-closure-form">
          <input
            className="he-closure-input"
            placeholder="Motivo (es. Ferie estive)"
            value={newLabel}
            onChange={(e) => setNewLabel(e.target.value)}
            maxLength={60}
          />
          <div className="he-closure-dates">
            <label className="he-date-label">
              Dal
              <input className="he-date-input" type="date" value={newFrom} onChange={(e) => setNewFrom(e.target.value)} />
            </label>
            <label className="he-date-label">
              Al
              <input className="he-date-input" type="date" value={newTo} min={newFrom} onChange={(e) => setNewTo(e.target.value)} />
            </label>
            <button className="btn-save he-closure-add" onClick={addClosure} disabled={!newFrom || savingClosure}>
              {savingClosure ? '…' : 'AGGIUNGI'}
            </button>
          </div>
        </div>

        {closures.length === 0 ? (
          <p className="he-empty">Nessuna chiusura straordinaria programmata.</p>
        ) : (
          <ul className="he-closure-list">
            {closures.map((c) => (
              <li key={c.id} className="he-closure-item">
                <div className="he-closure-info">
                  <span className="he-closure-label">{c.label}</span>
                  <span className="he-closure-range">
                    {c.from === c.to ? formatDate(c.from) : `${formatDate(c.from)} → ${formatDate(c.to)}`}
                  </span>
                </div>
                <button className="he-closure-delete" onClick={() => removeClosure(c.id)} aria-label="Elimina chiusura">×</button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
