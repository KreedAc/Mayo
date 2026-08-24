import { useState, useMemo } from 'react'
import type { MenuSection, MenuItem } from '@/lib/types'
import { supabase } from '@/lib/supabase'
import PreviewCard from './PreviewCard'

const BADGE_OPTIONS = ['NEW', 'HOT', 'CHEF', 'LIMITED', 'VEG']

const ALLERGEN_OPTIONS = [
  'Glutine', 'Crostacei', 'Uova', 'Pesce', 'Arachidi', 'Soia',
  'Latte', 'Frutta a guscio', 'Sedano', 'Senape', 'Sesamo',
  'Solfiti', 'Lupini', 'Molluschi',
]

interface Draft {
  id: string
  name: string
  desc: string
  img: string
  featured: boolean
  badges: string[]
  allergens: string[]
  priceMode: 'single' | 'variants'
  price: string
  variants: { label: string; price: string }[]
  _categoryId: string
}

export function emptyDraft(catId: string): Draft {
  return { id: '', name: '', desc: '', img: '', featured: false, badges: [], allergens: [], priceMode: 'single', price: '', variants: [{ label: '', price: '' }], _categoryId: catId }
}

export function draftFromItem(item: MenuItem, catId: string): Draft {
  const hasVariants = Array.isArray(item.variants) && item.variants.length > 0
  return {
    id: item.id,
    name: item.name || '',
    desc: item.desc || '',
    img: item.img || '',
    featured: !!item.featured,
    badges: [...(item.badges || [])],
    allergens: [...(item.allergens || [])],
    priceMode: hasVariants ? 'variants' : 'single',
    price: item.price != null ? String(item.price) : '',
    variants: hasVariants ? item.variants!.map((v) => ({ label: v.label || '', price: String(v.price) })) : [{ label: '', price: '' }],
    _categoryId: catId,
  }
}

interface ProductFormProps {
  catalog: MenuSection[]
  draft: Draft
  isNew: boolean
  onCancel: () => void
  onSave: (catId: string, item: MenuItem, isNew: boolean) => void
}

function slugify(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 24) || 'item'
}

export default function ProductForm({ catalog, draft: initial, isNew, onCancel, onSave }: ProductFormProps) {
  const [d, setD] = useState<Draft>(initial)
  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => setD((p) => ({ ...p, [k]: v }))
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    if (!supabase) return
    setUploading(true)
    const ext = file.name.split('.').pop() || 'jpg'
    const name = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error } = await supabase.storage
      .from('product-images')
      .upload(name, file, { contentType: file.type })
    if (!error) {
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(name)
      set('img', publicUrl)
    }
    setUploading(false)
  }

  const toggleBadge = (b: string) => {
    setD((p) => ({
      ...p,
      badges: p.badges.includes(b) ? p.badges.filter((x) => x !== b) : [...p.badges, b],
    }))
  }

  const toggleAllergen = (a: string) => {
    setD((p) => ({
      ...p,
      allergens: p.allergens.includes(a) ? p.allergens.filter((x) => x !== a) : [...p.allergens, a],
    }))
  }

  const setVariant = (i: number, k: 'label' | 'price', v: string) => {
    setD((p) => {
      const variants = p.variants.map((row, idx) => (idx === i ? { ...row, [k]: v } : row))
      return { ...p, variants }
    })
  }
  const addVariant = () => setD((p) => ({ ...p, variants: [...p.variants, { label: '', price: '' }] }))
  const removeVariant = (i: number) => setD((p) => ({ ...p, variants: p.variants.filter((_, idx) => idx !== i) }))

  const canSave =
    d.name.trim() &&
    d._categoryId &&
    (d.priceMode === 'single' ? d.price !== '' : d.variants.some((v) => v.price !== ''))

  const handleSave = () => {
    const item: MenuItem = {
      id: d.id || slugify(d.name) + '-' + Math.random().toString(36).slice(2, 6),
      name: d.name.trim(),
      desc: d.desc.trim(),
    }
    if (d.img.trim()) item.img = d.img.trim()
    if (d.featured) item.featured = true
    if (d.badges.length) item.badges = d.badges
    if (d.allergens.length) item.allergens = d.allergens
    if (d.priceMode === 'single') {
      item.price = parseFloat(d.price) || 0
    } else {
      const cleanVariants = d.variants
        .filter((v) => v.price !== '')
        .map((v) => ({ label: v.label.trim(), price: parseFloat(v.price) || 0 }))
      if (cleanVariants.length === 1 && !cleanVariants[0].label) {
        item.price = cleanVariants[0].price
      } else {
        item.variants = cleanVariants
      }
    }
    onSave(d._categoryId, item, isNew)
  }

  const previewItem = useMemo((): MenuItem => {
    const it: MenuItem = { id: 'prev', name: d.name || 'NOME PRODOTTO', desc: d.desc, img: d.img || undefined, featured: d.featured, badges: d.badges }
    if (d.priceMode === 'single') it.price = parseFloat(d.price) || 0
    else {
      const vs = d.variants.filter((v) => v.price !== '').map((v) => ({ label: v.label, price: parseFloat(v.price) || 0 }))
      it.variants = vs.length ? vs : [{ label: 'Variante', price: 0 }]
    }
    return it
  }, [d])

  return (
    <div>
      <h1 className="admin-h1">{isNew ? 'NUOVO' : 'MODIFICA'} <span className="accent">PRODOTTO</span></h1>
      <p className="admin-lead">Compila i campi. L&apos;anteprima a destra mostra come apparirà nel menu.</p>

      <div className="form-grid">
        <div className="form-card">
          <h3>★ Dati prodotto</h3>

          <div className="field">
            <label className="field-label">Categoria</label>
            <select className="sel" value={d._categoryId} onChange={(e) => set('_categoryId', e.target.value)}>
              {catalog.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>

          <div className="field">
            <label className="field-label">Nome prodotto</label>
            <input className="inp" value={d.name} onChange={(e) => set('name', e.target.value)} placeholder="es. MAYO ICON 🥓" />
            <div className="field-hint">Puoi includere emoji come negli altri prodotti.</div>
          </div>

          <div className="field">
            <label className="field-label">Descrizione</label>
            <textarea className="txa" value={d.desc} onChange={(e) => set('desc', e.target.value)} placeholder="Ingredienti e dettagli…" />
          </div>

          <div className="field">
            <label className="field-label">Immagine</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="inp" style={{ flex: 1 }} value={d.img} onChange={(e) => set('img', e.target.value)} placeholder="https://… oppure carica con il pulsante →" />
              {supabase && (
                <label className={`btn-outline-sm${uploading ? ' disabled' : ''}`} style={{ cursor: uploading ? 'default' : 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center' }}>
                  {uploading ? '…' : '↑ CARICA'}
                  <input type="file" accept="image/*" style={{ display: 'none' }} disabled={uploading} onChange={(e) => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }} />
                </label>
              )}
            </div>
            {d.img && <img src={d.img} alt="" style={{ marginTop: 8, height: 80, objectFit: 'cover', border: '1px solid var(--line)' }} />}
            <div className="field-hint">Carica direttamente su Supabase oppure incolla un URL. Lascia vuoto per nessuna foto.</div>
          </div>

          <div className="field">
            <label className="field-label">Prezzo</label>
            <div className="var-toggle">
              <button type="button" className={d.priceMode === 'single' ? 'on' : ''} onClick={() => set('priceMode', 'single')}>Prezzo unico</button>
              <button type="button" className={d.priceMode === 'variants' ? 'on' : ''} onClick={() => set('priceMode', 'variants')}>Varianti</button>
            </div>
            {d.priceMode === 'single' ? (
              <input className="inp" type="number" step="0.5" min="0" value={d.price} onChange={(e) => set('price', e.target.value)} placeholder="es. 9.00" />
            ) : (
              <div>
                {d.variants.map((v, i) => (
                  <div className="var-row" key={i}>
                    <input className="inp" value={v.label} onChange={(e) => setVariant(i, 'label', e.target.value)} placeholder="es. Doppio" />
                    <input className="inp" type="number" step="0.5" min="0" value={v.price} onChange={(e) => setVariant(i, 'price', e.target.value)} placeholder="€" />
                    <button className="icon-btn del" type="button" onClick={() => removeVariant(i)} disabled={d.variants.length === 1}>×</button>
                  </div>
                ))}
                <button className="var-add" type="button" onClick={addVariant}>+ AGGIUNGI VARIANTE</button>
                <div className="field-hint">Es. Singolo / Doppio / Triplo, oppure 5pz / 10pz.</div>
              </div>
            )}
          </div>

          <div className="field">
            <label className="field-label">Etichette (badge)</label>
            <div className="badge-picker">
              {BADGE_OPTIONS.map((b) => (
                <button type="button" key={b} className={`badge-pick ${d.badges.includes(b) ? 'on' : ''}`} onClick={() => toggleBadge(b)}>{b}</button>
              ))}
            </div>
            <div className="field-hint">NEW = novità · HOT = piccante · CHEF = consigliato · LIMITED = edizione limitata · VEG = vegetariano. Il tag <b>LIMITED</b> rende il prodotto una card grande, mostrata per prima nella sua categoria.</div>
          </div>

          <div className="field">
            <label className="field-label">Allergeni presenti</label>
            <div className="badge-picker">
              {ALLERGEN_OPTIONS.map((a) => (
                <button type="button" key={a} className={`badge-pick allergen-pick ${d.allergens.includes(a) ? 'on' : ''}`} onClick={() => toggleAllergen(a)}>{a}</button>
              ))}
            </div>
            <div className="field-hint">Seleziona tutti gli allergeni presenti nel prodotto (14 allergeni EU obbligatori per legge).</div>
          </div>

          <div className="form-actions">
            <button className="btn-save" disabled={!canSave} onClick={handleSave}>
              {isNew ? 'AGGIUNGI AL MENU' : 'SALVA MODIFICHE'} →
            </button>
            <button className="btn-ghost" onClick={onCancel}>Annulla</button>
          </div>
        </div>

        <div className="preview-wrap">
          <div className="form-card">
            <div className="preview-note">Anteprima live nel menu</div>
            <div className="menu-grid" style={{ gridTemplateColumns: '1fr' }}>
              <PreviewCard item={previewItem} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
