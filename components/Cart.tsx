import type { CartMap, NotesMap, SiteInfo } from '@/lib/types'

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
}

export default function Cart({
  open, onClose, cart, notes, custName, pickupTime, menuFlat,
  onInc, onDec, onNote, onName, onTime, onCheckout, onClear, info,
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
  const canCheckout = aboveMin && (custName || '').trim().length >= 2 && (pickupTime || '').trim().length > 0

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
        </div>
        {lines.length > 0 && (
          <div className="cart-foot">
            {!aboveMin && (
              <div className="cart-warn">
                Mancano <b>€{missing.toFixed(2)}</b> per l&apos;ordine minimo (€{info.minOrder.toFixed(2)})
              </div>
            )}
            <div className="cart-totals">
              <div className="row"><span>Subtotale</span><span>€{subtotal.toFixed(2)}</span></div>
              <div className="row total"><span>TOTALE</span><span>€{total.toFixed(2)}</span></div>
            </div>
            <div className="cart-name-field">
              <label className="cart-name-label">Il tuo nome <span className="req">*</span></label>
              <input
                className="cart-name-input"
                type="text"
                value={custName || ''}
                onChange={(e) => onName(e.target.value)}
                placeholder="Come ti chiami?"
                maxLength={40}
              />
            </div>
            <div className="cart-name-field">
              <label className="cart-name-label">Orario di ritiro <span className="req">*</span></label>
              <input
                className="cart-name-input"
                type="time"
                value={pickupTime || ''}
                onChange={(e) => onTime(e.target.value)}
              />
            </div>
            <button
              className="cart-checkout"
              disabled={!canCheckout}
              onClick={() => onCheckout(lines, { subtotal, total })}
            >
              {!aboveMin
                ? `MINIMO €${info.minOrder.toFixed(2)}`
                : (custName || '').trim().length < 2
                ? 'INSERISCI IL NOME'
                : !(pickupTime || '').trim()
                ? 'INSERISCI L\'ORARIO'
                : 'PROCEDI SU WHATSAPP →'}
            </button>
            <button className="cart-clear" onClick={onClear}>Svuota</button>
          </div>
        )}
      </aside>
    </>
  )
}
