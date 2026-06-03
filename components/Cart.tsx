'use client'

import { useState, useEffect, useMemo, useRef } from 'react'
import type { CartMap, NotesMap, SiteInfo, HoursEntry, ClosureEntry } from '@/lib/types'

interface CartLine {
  key: string
  name: string
  variantLabel: string
  price: number
  qty: number
  sub: number
}

interface CartProps {
  open: boolean
  onClose: () => void
  cart: CartMap
  notes: NotesMap
  custName: string
  pickupTime: string
  menuFlat: Record<string, { name: string; variantLabel: string; price: number }>
  onInc: (key: string) => void
  onDec: (key: string) => void
  onNote: (key: string, text: string) => void
  onName: (name: string) => void
  onTime: (time: string) => void
  onCheckout: (lines: CartLine[], totals: { subtotal: number; total: number }) => void
  onClear: () => void
  info: SiteInfo
  hours: HoursEntry[]
  closures: ClosureEntry[]
}

type Step = 'name' | 'time' | 'ready'

function buildSlots(hours: HoursEntry[], closures: ClosureEntry[]): string[] {
  // Check special closures (single day or range)
  const todayStr = new Date().toISOString().slice(0, 10)
  if (closures.some((c) => todayStr >= c.from && todayStr <= c.to)) return []

  const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato']
  const entry = hours.find((h) => h.day === dayNames[new Date().getDay()])
  if (!entry || entry.closed || !entry.slots?.length) return []

  const now = new Date()
  const nowMin = now.getHours() * 60 + now.getMinutes()
  const slots: string[] = []

  for (const slot of entry.slots) {
    const [sh, sm] = slot.open.split(':').map(Number)
    const [eh, em] = slot.close.split(':').map(Number)
    const start = sh * 60 + sm
    let end = eh * 60 + em
    if (end <= start) end += 24 * 60
    for (let t = start; t <= end - 30; t += 15) {
      if (t < nowMin + 20) continue
      const hh = Math.floor(t / 60) % 24
      const mm = t % 60
      slots.push(`${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`)
    }
  }
  return slots
}

function initStep(custName: string, pickupTime: string): Step {
  if ((custName || '').trim().length >= 2 && pickupTime) return 'ready'
  if ((custName || '').trim().length >= 2) return 'time'
  return 'name'
}

export default function Cart({
  open, onClose, cart, notes, custName, pickupTime, menuFlat,
  onInc, onDec, onNote, onName, onTime, onCheckout, onClear, info, hours, closures,
}: CartProps) {
  const lines: CartLine[] = Object.keys(cart)
    .filter((id) => cart[id] > 0)
    .map((cartKey) => {
      const entry = menuFlat[cartKey]
      if (!entry) return null
      const qty = cart[cartKey]
      return { key: cartKey, name: entry.name, variantLabel: entry.variantLabel, price: entry.price, qty, sub: entry.price * qty }
    })
    .filter(Boolean) as CartLine[]

  const subtotal = lines.reduce((s, l) => s + l.sub, 0)
  const total = subtotal
  const aboveMin = subtotal >= info.minOrder
  const missing = Math.max(0, info.minOrder - subtotal)

  const [step, setStep] = useState<Step>(() => initStep(custName, pickupTime))
  const [nameInput, setNameInput] = useState(custName || '')
  const nameRef = useRef<HTMLInputElement>(null)
  const slots = useMemo(() => buildSlots(hours, closures), [hours, closures])

  // Reset on cart clear
  useEffect(() => {
    if (!custName && !pickupTime) {
      setStep('name')
      setNameInput('')
    }
  }, [custName, pickupTime])

  // Focus name input when drawer opens at step name
  useEffect(() => {
    if (open && step === 'name') {
      setTimeout(() => nameRef.current?.focus(), 320)
    }
  }, [open, step])

  const confirmName = () => {
    const n = nameInput.trim()
    if (n.length < 2) return
    onName(n)
    setStep('time')
  }

  const confirmTime = (slot: string) => {
    onTime(slot)
    setStep('ready')
  }

  const resetToName = () => {
    onName('')
    onTime('')
    setStep('name')
  }

  const resetToTime = () => {
    onTime('')
    setStep('time')
  }

  return (
    <>
      <div className={`cart-overlay ${open ? 'open' : ''}`} onClick={onClose} />
      <aside className={`cart-drawer ${open ? 'open' : ''}`}>
        <div className="cart-head">
          <h3>★ IL TUO ORDINE</h3>
          <button className="cart-close" onClick={onClose} aria-label="Chiudi">✕</button>
        </div>

        <div className="cart-body">
          {lines.length === 0 ? (
            <div className="cart-empty">
              <div style={{ fontSize: 60 }}>🍔</div>
              <div className="big">CARRELLO VUOTO</div>
              <div className="sub">aggiungi qualcosa, dai</div>
            </div>
          ) : (
            lines.map((l) => (
              <div className="cart-line" key={l.key}>
                <div className="cart-line-main">
                  <div className="cart-line-name">{l.name}</div>
                  {l.variantLabel && <div className="cart-line-variant">{l.variantLabel}</div>}
                  <div className="cart-line-price">€{l.price.toFixed(2)} cad.</div>
                  <div className="cart-line-controls">
                    <button onClick={() => onDec(l.key)} aria-label="Riduci">−</button>
                    <span className="q">{l.qty}</span>
                    <button onClick={() => onInc(l.key)} aria-label="Aumenta">+</button>
                  </div>
                  <input
                    className="cart-line-note"
                    type="text"
                    value={notes[l.key] || ''}
                    onChange={(e) => onNote(l.key, e.target.value)}
                    placeholder="+ Note (es. senza cipolla, ben cotto…)"
                    maxLength={120}
                  />
                </div>
                <div className="sub-total">€{l.sub.toFixed(2)}</div>
              </div>
            ))
          )}

          {lines.length > 0 && (
            <div className="cart-foot">
              <div className="cart-totals">
                <div className="row"><span>Subtotale</span><span>€{subtotal.toFixed(2)}</span></div>
                <div className="row total"><span>TOTALE</span><span>€{total.toFixed(2)}</span></div>
              </div>
            </div>
          )}
        </div>

        {lines.length > 0 && (
          <div className="cart-actions">
            {!aboveMin ? (
              <>
                <div className="cart-warn">
                  Mancano <b>€{missing.toFixed(2)}</b> per l&apos;ordine minimo (€{info.minOrder.toFixed(2)})
                </div>
                <button className="cart-checkout" disabled>MINIMO €{info.minOrder.toFixed(2)}</button>
                <button className="cart-clear" onClick={onClear}>Svuota</button>
              </>
            ) : step === 'name' ? (
              <>
                <div className="step-label">COME TI CHIAMI?</div>
                <div className="step-row">
                  <input
                    ref={nameRef}
                    className="step-input"
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && confirmName()}
                    placeholder="Il tuo nome…"
                    maxLength={40}
                    autoComplete="given-name"
                  />
                  <button
                    className="step-confirm"
                    onClick={confirmName}
                    disabled={nameInput.trim().length < 2}
                    aria-label="Conferma nome"
                  >✓</button>
                </div>
                <button className="cart-clear" onClick={onClear}>Svuota</button>
              </>
            ) : step === 'time' ? (
              <>
                <div className="step-confirmed-row">
                  <span className="step-confirmed-val">★ {custName.toUpperCase()}</span>
                  <button className="step-edit" onClick={resetToName} aria-label="Modifica nome">✎</button>
                </div>
                <div className="step-label">ORARIO DI RITIRO</div>
                {slots.length === 0 ? (
                  <div className="step-closed">Siamo chiusi oggi — torna domani!</div>
                ) : (
                  <div className="step-slots">
                    {slots.map((s) => (
                      <button key={s} className="slot-btn" onClick={() => confirmTime(s)}>{s}</button>
                    ))}
                  </div>
                )}
                <button className="cart-clear" onClick={onClear}>Svuota</button>
              </>
            ) : (
              <>
                <div className="step-confirmed-row">
                  <span className="step-confirmed-val">★ {custName.toUpperCase()} · {pickupTime}</span>
                  <div className="step-edit-group">
                    <button className="step-edit" onClick={resetToTime} title="Cambia orario" aria-label="Modifica orario">⏱</button>
                    <button className="step-edit" onClick={resetToName} title="Cambia nome" aria-label="Modifica nome">✎</button>
                  </div>
                </div>
                <button
                  className="cart-checkout"
                  onClick={() => onCheckout(lines, { subtotal, total })}
                >
                  PROCEDI SU WHATSAPP →
                </button>
                <button className="cart-clear" onClick={onClear}>Svuota</button>
              </>
            )}
          </div>
        )}
      </aside>
    </>
  )
}
