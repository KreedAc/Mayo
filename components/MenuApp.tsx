'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import type { MenuSection, MenuItem, MenuVariant, SiteInfo, HoursEntry, ClosureEntry, CartMap, NotesMap, HeroBanner } from '@/lib/types'
import Nav from './Nav'
import Hero from './Hero'
import Marquee from './Marquee'
import CategoryTabs from './CategoryTabs'
import MenuSectionComp from './MenuSection'
import Cart from './Cart'
import Info from './Info'
import Footer from './Footer'

interface MenuAppProps {
  menu: MenuSection[]
  info: SiteInfo
  hours: HoursEntry[]
  closures: ClosureEntry[]
  banner: HeroBanner
}

const MARQUEE_ITEMS = [
  'SMASH BURGER', 'LAMEZIA TERME', 'OPEN LATE',
  '100% MANZO CAL', 'CRAFT BEERS', 'A BURGER EXPERIENCE',
  'NO COMPROMISE', 'DOUBLE PATTY', 'SINCE 2023',
]

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const v = localStorage.getItem(key)
    return v ? JSON.parse(v) : fallback
  } catch { return fallback }
}

export default function MenuApp({ menu, info, hours, closures, banner }: MenuAppProps) {
  const menuFlat = useMemo(() => {
    const f: Record<string, { name: string; variantLabel: string; price: number }> = {}
    menu.forEach((s) =>
      s.items.forEach((item) => {
        const variants: MenuVariant[] = item.variants || [{ label: '', price: item.price || 0 }]
        variants.forEach((v) => {
          f[`${item.id}::${v.label || ''}`] = { name: item.name, variantLabel: v.label, price: v.price }
        })
      })
    )
    return f
  }, [menu])

  const [cart, setCart] = useState<CartMap>(() => readLocal('mayo-cart', {}))
  useEffect(() => { localStorage.setItem('mayo-cart', JSON.stringify(cart)) }, [cart])

  const [notes, setNotes] = useState<NotesMap>(() => readLocal('mayo-cart-notes', {}))
  useEffect(() => { localStorage.setItem('mayo-cart-notes', JSON.stringify(notes)) }, [notes])

  const [custName, setCustName] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    try { return localStorage.getItem('mayo-cust-name') || '' } catch { return '' }
  })
  useEffect(() => { localStorage.setItem('mayo-cust-name', custName) }, [custName])

  const [pickupTime, setPickupTime] = useState<string>('')

  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cartCount = Object.values(cart).reduce((s, v) => s + v, 0)

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastRef.current) clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(null), 1800)
  }, [])

  const addItem = useCallback((item: MenuItem, variant: MenuVariant) => {
    const key = `${item.id}::${variant.label || ''}`
    setCart((c) => ({ ...c, [key]: (c[key] || 0) + 1 }))
    const variantStr = variant.label ? ` (${variant.label})` : ''
    showToast(`+ ${item.name.toUpperCase()}${variantStr}`)
  }, [showToast])

  const incItem = useCallback((id: string) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }))
  }, [])

  const decItem = useCallback((id: string) => {
    setCart((c) => {
      const next = { ...c }
      if ((next[id] || 0) <= 1) delete next[id]
      else next[id] = next[id] - 1
      return next
    })
  }, [])

  const setNote = useCallback((key: string, text: string) => {
    setNotes((n) => ({ ...n, [key]: text }))
  }, [])

  const checkout = useCallback(
    (lines: { key: string; name: string; variantLabel: string; qty: number; sub: number }[], totals: { total: number }) => {
      const L: string[] = []
      L.push('🍔 *NUOVO ORDINE — MAYO*')
      L.push('')
      L.push(`*Nome:* ${(custName || '').trim()}`)
      L.push(`*Orario ritiro:* ${pickupTime}`)
      L.push('')
      lines.forEach((l) => {
        const variant = l.variantLabel ? ` (${l.variantLabel})` : ''
        L.push(`▪️ ${l.qty}× ${l.name}${variant} — €${l.sub.toFixed(2)}`)
        const note = (notes[l.key] || '').trim()
        if (note) L.push(`   _↳ ${note}_`)
      })
      L.push('')
      L.push(`*TOTALE: €${totals.total.toFixed(2)}*`)
      L.push('')
      const text = encodeURIComponent(L.join('\n'))
      const url = `https://wa.me/39${info.phoneRaw}?text=${text}`
      window.open(url, '_blank')
    },
    [notes, custName, pickupTime, info]
  )

  const pullStartRef = useRef(-1)
  const pullPctRef = useRef(0)
  const [pullPct, setPullPct] = useState(0)

  useEffect(() => {
    const THRESHOLD = 80
    const onTouchStart = (e: TouchEvent) => {
      pullStartRef.current = window.scrollY === 0 ? e.touches[0].clientY : -1
    }
    const onTouchMove = (e: TouchEvent) => {
      if (pullStartRef.current < 0) return
      const dy = e.touches[0].clientY - pullStartRef.current
      const pct = dy > 0 ? Math.min(dy / THRESHOLD, 1.25) : 0
      pullPctRef.current = pct
      setPullPct(pct)
    }
    const onTouchEnd = () => {
      if (pullStartRef.current >= 0 && pullPctRef.current >= 1) { window.location.reload(); return }
      pullStartRef.current = -1
      pullPctRef.current = 0
      setPullPct(0)
    }
    document.addEventListener('touchstart', onTouchStart, { passive: true })
    document.addEventListener('touchmove', onTouchMove, { passive: true })
    document.addEventListener('touchend', onTouchEnd)
    return () => {
      document.removeEventListener('touchstart', onTouchStart)
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }
  }, [])

  const [activeCat, setActiveCat] = useState(menu[0]?.id || '')

  useEffect(() => {
    const opts = { rootMargin: '-180px 0px -55% 0px', threshold: 0 }
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const id = (e.target as HTMLElement).id.replace('sec-', '')
          setActiveCat(id)
        }
      })
    }, opts)
    menu.forEach((s) => {
      const el = document.getElementById(`sec-${s.id}`)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [menu])

  const onPickCat = useCallback((id: string) => {
    const el = document.getElementById(`sec-${id}`)
    if (el) {
      const top = el.getBoundingClientRect().top + window.pageYOffset - 150
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }, [])

  return (
    <>
      {pullPct > 0.05 && (
        <div className="ptr-indicator" style={{ opacity: Math.min(pullPct * 1.2, 1) }}>
          {pullPct >= 1 ? '↻ RILASCIA' : '↓ AGGIORNA'}
        </div>
      )}
      <Nav cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />
      <div className="order-nudge">
        🛍 Vuoi ordinare in asporto? Aggiungi i prodotti al carrello e completa l&apos;ordine via WhatsApp.
      </div>
      <Hero banner={banner} />
      <Marquee items={MARQUEE_ITEMS} />

      <main className="menu-wrap" id="menu">
        <div className="section-eyebrow">★ — Il Menu</div>
        <h2 className="section-title">
          MORDI <span className="accent">QUI</span>.
        </h2>
        <p className="section-lead">Tutto fresco, tutto fatto al momento. Scegli, aggiungi, mangia.</p>

        <CategoryTabs sections={menu} active={activeCat} onPick={onPickCat} />

        {menu.map((s, idx) => (
          <MenuSectionComp
            key={s.id}
            section={s}
            idx={idx}
            cart={cart}
            onAdd={addItem}
            onInc={incItem}
            onDec={decItem}
          />
        ))}
      </main>

      <Info hours={hours} info={info} />
      <Footer info={info} />

      <Cart
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        notes={notes}
        custName={custName}
        pickupTime={pickupTime}
        menuFlat={menuFlat}
        onInc={incItem}
        onDec={decItem}
        onNote={setNote}
        onName={setCustName}
        onTime={setPickupTime}
        onCheckout={checkout}
        onClear={() => { setCart({}); setNotes({}); setPickupTime(''); showToast('CARRELLO SVUOTATO') }}
        info={info}
        hours={hours}
        closures={closures}
      />

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  )
}
