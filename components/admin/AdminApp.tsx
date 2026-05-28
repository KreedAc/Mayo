'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import type { MenuSection, MenuItem } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import { MAYO_MENU } from '@/lib/data'
import Login from './Login'
import Catalog from './Catalog'
import ProductForm, { emptyDraft, draftFromItem } from './ProductForm'

type View = 'catalog' | 'form'

interface EditTarget {
  draft: ReturnType<typeof emptyDraft>
  isNew: boolean
}

interface ConfirmDel {
  catId: string
  itemId: string
  name: string
}

async function fetchCatalogFromSupabase(): Promise<MenuSection[] | null> {
  if (!supabase) return null
  const [{ data: cats, error: ce }, { data: prods, error: pe }] = await Promise.all([
    supabase.from('categories').select('*').order('sort_order'),
    supabase.from('products').select('*, product_variants(*)').order('sort_order'),
  ])
  if (ce || pe || !cats || !prods) return null
  return (cats as { id: string; label: string; emoji: string; blurb: string; sort_order: number }[])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((cat) => ({
      id: cat.id, label: cat.label, emoji: cat.emoji || '', blurb: cat.blurb || '',
      items: (prods as (MenuItem & { category_id: string; description?: string; image_url?: string; sort_order: number; product_variants?: { label: string; price: number; sort_order: number }[] })[])
        .filter((p) => p.category_id === cat.id)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((p) => ({
          id: p.id, name: p.name,
          desc: (p as unknown as { description?: string }).description || '',
          img: (p as unknown as { image_url?: string }).image_url || undefined,
          price: p.price ?? undefined,
          variants: p.product_variants?.sort((a, b) => a.sort_order - b.sort_order).map((v) => ({ label: v.label, price: Number(v.price) })),
          featured: p.featured || false,
          badges: p.badges || [],
        })),
    }))
    .filter((s) => s.items.length > 0)
}

export default function AdminApp() {
  const [authed, setAuthed] = useState(false)
  const [catalog, setCatalog] = useState<MenuSection[]>(MAYO_MENU)
  const [view, setView] = useState<View>('catalog')
  const [editTarget, setEditTarget] = useState<EditTarget | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [confirmDel, setConfirmDel] = useState<ConfirmDel | null>(null)
  const toastRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Check existing session on mount
  useEffect(() => {
    if (!supabase) return
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setAuthed(true)
        loadCatalog()
      }
    })
  }, [])

  const loadCatalog = async () => {
    const data = await fetchCatalogFromSupabase()
    if (data) setCatalog(data)
  }

  const showToast = useCallback((msg: string) => {
    setToast(msg)
    if (toastRef.current) clearTimeout(toastRef.current)
    toastRef.current = setTimeout(() => setToast(null), 1800)
  }, [])

  const handleLogin = () => {
    setAuthed(true)
    loadCatalog()
  }

  const logout = async () => {
    if (supabase) await supabase.auth.signOut()
    setAuthed(false)
    setCatalog(MAYO_MENU)
  }

  const startNew = () => {
    setEditTarget({ draft: emptyDraft(catalog[0]?.id || ''), isNew: true })
    setView('form')
  }

  const startEdit = (catId: string, itemId: string) => {
    const sec = catalog.find((s) => s.id === catId)
    const item = sec?.items.find((i) => i.id === itemId)
    if (!item) return
    setEditTarget({ draft: draftFromItem(item, catId), isNew: false })
    setView('form')
  }

  const doDelete = (catId: string, itemId: string) => {
    const sec = catalog.find((s) => s.id === catId)
    const item = sec?.items.find((i) => i.id === itemId)
    if (!item) return
    setConfirmDel({ catId, itemId, name: item.name })
  }

  const confirmDelete = async () => {
    if (!confirmDel) return
    const { catId, itemId } = confirmDel
    if (supabase) {
      await supabase.from('products').delete().eq('id', itemId)
    }
    setCatalog((cat) =>
      cat.map((s) => s.id === catId ? { ...s, items: s.items.filter((i) => i.id !== itemId) } : s)
    )
    setConfirmDel(null)
    showToast('PRODOTTO ELIMINATO')
  }

  const saveProduct = async (catId: string, item: MenuItem, isNew: boolean) => {
    if (supabase) {
      if (isNew) {
        const { data: prod } = await supabase
          .from('products')
          .insert({ category_id: catId, name: item.name, description: item.desc, image_url: item.img || null, price: item.price ?? null, featured: item.featured || false, badges: item.badges || [], sort_order: 0 })
          .select().single()
        if (prod && item.variants?.length) {
          await supabase.from('product_variants').insert(
            item.variants.map((v, i) => ({ product_id: prod.id, label: v.label, price: v.price, sort_order: i }))
          )
          item = { ...item, id: prod.id }
        } else if (prod) {
          item = { ...item, id: prod.id }
        }
      } else {
        await supabase.from('products').update({ category_id: catId, name: item.name, description: item.desc, image_url: item.img || null, price: item.price ?? null, featured: item.featured || false, badges: item.badges || [] }).eq('id', item.id)
        await supabase.from('product_variants').delete().eq('product_id', item.id)
        if (item.variants?.length) {
          await supabase.from('product_variants').insert(
            item.variants.map((v, i) => ({ product_id: item.id, label: v.label, price: v.price, sort_order: i }))
          )
        }
      }
    }
    setCatalog((cat) => {
      let next = cat.map((s) => ({ ...s, items: s.items.filter((i) => i.id !== item.id) }))
      next = next.map((s) => s.id === catId ? { ...s, items: [...s.items, item] } : s)
      return next
    })
    setView('catalog')
    showToast(isNew ? 'PRODOTTO AGGIUNTO' : 'MODIFICHE SALVATE')
  }

  const exportJSON = () => {
    const blob = new Blob([JSON.stringify(catalog, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'mayo-catalogo.json'; a.click()
    URL.revokeObjectURL(url)
    showToast('JSON ESPORTATO')
  }

  if (!authed) return <Login onLogin={handleLogin} />

  return (
    <div className="admin-body">
      <nav className="admin-nav">
        <div className="admin-nav-inner">
          <div className="admin-brand">MAYO <span className="pill">ADMIN</span></div>
          <div className="admin-tabs">
            <button className={`admin-tab ${view === 'catalog' ? 'active' : ''}`} onClick={() => setView('catalog')}>Catalogo</button>
            <button className={`admin-tab ${view === 'form' ? 'active' : ''}`} onClick={startNew}>+ Aggiungi</button>
          </div>
          <div className="admin-spacer" />
          <a className="admin-link" href="/" target="_blank" rel="noreferrer">Vedi sito ↗</a>
          <button className="admin-logout" onClick={logout}>Esci</button>
        </div>
      </nav>

      <div className="admin-wrap">
        {view === 'catalog' && (
          <Catalog
            catalog={catalog}
            onEdit={startEdit}
            onDelete={doDelete}
            onAddNew={startNew}
            onExport={exportJSON}
          />
        )}
        {view === 'form' && editTarget && (
          <ProductForm
            catalog={catalog}
            draft={editTarget.draft}
            isNew={editTarget.isNew}
            onCancel={() => setView('catalog')}
            onSave={saveProduct}
          />
        )}
      </div>

      {confirmDel && (
        <div className="modal-overlay" onClick={() => setConfirmDel(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <h3>Eliminare?</h3>
            <p>Stai per eliminare <b>{confirmDel.name}</b> dal catalogo. L&apos;azione non è reversibile.</p>
            <div className="modal-actions">
              <button className="btn-save" style={{ background: 'var(--red)', color: '#fff' }} onClick={confirmDelete}>ELIMINA</button>
              <button className="btn-ghost" onClick={() => setConfirmDel(null)}>Annulla</button>
            </div>
          </div>
        </div>
      )}

      <div className={`toast ${toast ? 'show' : ''}`}>{toast}</div>
    </div>
  )
}
