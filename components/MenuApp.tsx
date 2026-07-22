'use client'

import { useState, useEffect, useRef, useMemo, useCallback } from 'react'
import type { MenuSection, MenuItem, MenuVariant, SiteInfo, HoursEntry, ClosureEntry, Cart, CartItem, HeroBanner } from '@/lib/types'
import Nav from './Nav'
import Hero from './Hero'
import Marquee from './Marquee'
import CategoryTabs from './CategoryTabs'
import MenuSectionComp from './MenuSection'
import CartComp from './Cart'
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

  const [cart, setCart] = useState<Cart>(() => {
    const v = readLocal<unknown>('mayo-cart', [])
    return Array.isArray(v) ? (v as Cart) : []
  })
  useEffect(() => { localStorage.setItem('mayo-cart', JSON.stringify(cart)) }, [cart])

  // Drop units whose product no longer exists in the menu (deleted/hidden by admin),
  // and clean up the localStorage key left over from the old notes model
  useEffect(() => {
    setCart((c) => {
      const valid = c.filter((i) => menuFlat[i.productKey])
      return valid.length === c.length ? c : valid
    })
    try { localStorage.removeItem('mayo-cart-notes') } catch { /* ignore */ }
  }, [menuFlat])

  const [custName, setCustName] = useState<string>(() => {
    if (typeof window === 'undefined') return ''
    try { return localStorage.getItem('mayo-cust-name') || '' } catch { return '' }
  })
  useEffect(() => { localStorage.setItem('mayo-cust-name', custName) }, [custName])

  const [pickupTime, setPickupTime] = useState<string>('')

  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [nudge, setNudge] = useState(true)
  useEffect(() => { const t = setTimeout(() => setNudge(false), 10000); return () => clearTimeout(t) }, [])
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const cartCount = cart.length

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastRef.current) clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(null), 1800)
  }, [])

  const addItem = useCallback((item: MenuItem, variant: MenuVariant) => {
    const productKey = `${item.id}::${variant.label || ''}`
    const newItem: CartItem = { id: crypto.randomUUID(), productKey, note: '' }
    setCart((c) => [...c, newItem])
    const variantStr = variant.label ? ` (${variant.label})` : ''
    showToast(`+ ${item.name.toUpperCase()}${variantStr}`)
  }, [showToast])

  const incItem = useCallback((productKey: string, note = '') => {
    const newItem: CartItem = { id: crypto.randomUUID(), productKey, note }
    setCart((c) => [...c, newItem])
  }, [])

  const decItem = useCallback((productKey: string) => {
    setCart((c) => {
      const idx = [...c].map((i, j) => [i, j] as [CartItem, number]).reverse().find(([i]) => i.productKey === productKey)?.[1]
      if (idx === undefined) return c
      return c.filter((_, j) => j !== idx)
    })
  }, [])

  const removeItem = useCallback((itemId: string) => {
    setCart((c) => c.filter((i) => i.id !== itemId))
  }, [])

  const setItemNote = useCallback((itemId: string, note: string) => {
    setCart((c) => c.map((i) => i.id === itemId ? { ...i, note } : i))
  }, [])

  const getQty = useCallback((productKey: string) => {
    return cart.filter((i) => i.productKey === productKey).length
  }, [cart])

  const pendingClearRef = useRef(false)

  const checkout = useCallback(
    (lines: { id: string; productKey: string; name: string; variantLabel: string; price: number; note: string }[], totals: { subtotal: number; total: number }) => {
      const L: string[] = []
      L.push('🍔 *NUOVO ORDINE — MAYO*')
      L.push('')
      L.push(`*Nome:* ${(custName || '').trim()}`)
      L.push(`*Orario ritiro:* ${pickupTime}`)
      L.push('')

      const grouped = new Map<string, { name: string; variantLabel: string; price: number; qty: number; note: string }>()
      lines.forEach((l) => {
        const gk = `${l.productKey}||${l.note.trim()}`
        const ex = grouped.get(gk)
        if (ex) ex.qty++
        else grouped.set(gk, { name: l.name, variantLabel: l.variantLabel, price: l.price, qty: 1, note: l.note.trim() })
      })
      grouped.forEach((g) => {
        const variant = g.variantLabel ? ` (${g.variantLabel})` : ''
        L.push(`▪️ ${g.qty}× ${g.name}${variant} — €${(g.price * g.qty).toFixed(2)}`)
        if (g.note) L.push(`   _↳ ${g.note}_`)
      })

      L.push('')
      L.push(`*TOTALE: €${totals.total.toFixed(2)}*`)
      L.push('')
      const text = encodeURIComponent(L.join('\n'))
      const url = `https://wa.me/39${info.phoneRaw}?text=${text}`
      window.open(url, '_blank')
      // Don't clear right away: if WhatsApp fails to open the order would be lost.
      // The cart is emptied when the user comes back to this tab (see effect below).
      pendingClearRef.current = true
    },
    [custName, pickupTime, info]
  )

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && pendingClearRef.current) {
        pendingClearRef.current = false
        setCart([])
        setPickupTime('')
        setCartOpen(false)
      }
    }
    document.addEventListener('visibilitychange', onVisible)
    return () => document.removeEventListener('visibilitychange', onVisible)
  }, [])

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
      {nudge && (
        <div className="order-nudge">
          🛍 Vuoi ordinare da asporto? Aggiungi i prodotti al carrello e completa l&apos;ordine via WhatsApp.
        </div>
      )}
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
            getQty={getQty}
            onAdd={addItem}
            onInc={incItem}
            onDec={decItem}
          />
        ))}
      </main>

      <Info hours={hours} info={info} />
      <Footer info={info} />

      <CartComp
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        custName={custName}
        pickupTime={pickupTime}
        menuFlat={menuFlat}
        onAddItem={incItem}
        onRemoveItem={removeItem}
        onSetNote={setItemNote}
        onName={setCustName}
        onTime={setPickupTime}
        onCheckout={checkout}
        onClear={() => { setCart([]); setPickupTime(''); showToast('CARRELLO SVUOTATO') }}
        info={info}
        hours={hours}
        closures={closures}
      />

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </>
  )
}
