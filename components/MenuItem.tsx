'use client'

import { useState } from 'react'
import type { MenuItem as MenuItemType, MenuVariant } from '@/lib/types'

interface MenuItemProps {
  item: MenuItemType
  getQty: (variantLabel: string) => number
  onAdd: (variant: MenuVariant) => void
  onInc: (variantLabel: string) => void
  onDec: (variantLabel: string) => void
}

export default function MenuItem({ item, getQty, onAdd, onInc, onDec }: MenuItemProps) {
  const variants: MenuVariant[] = item.variants || [{ label: '', price: item.price || 0 }]
  const singleNoLabel = variants.length === 1 && !variants[0].label
  const [showAllergens, setShowAllergens] = useState(false)

  return (
    <>
      <article className={`menu-item ${item.featured ? 'featured' : ''}`}>
        {item.img && (
          <div className="menu-item-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={item.img} alt={item.name} loading="lazy" />
            {item.badges && item.badges.length > 0 && (
              <div className="menu-item-badges photo-badges">
                {item.badges.map((b) => (
                  <span key={b} className={`badge ${b.toLowerCase()}`}>{b}</span>
                ))}
              </div>
            )}
          </div>
        )}
        <div className="menu-item-body">
          <div className="menu-item-head">
            <h4 className="menu-item-name">{item.name}</h4>
          </div>
          {item.desc && <p className="menu-item-desc">{item.desc}</p>}
          {!item.img && item.badges && item.badges.length > 0 && (
            <div className="menu-item-badges">
              {item.badges.map((b) => (
                <span key={b} className={`badge ${b.toLowerCase()}`}>{b}</span>
              ))}
            </div>
          )}

          {singleNoLabel ? (
            <div className="menu-item-foot">
              <span className="menu-item-price">€{variants[0].price.toFixed(2)}</span>
              {getQty(variants[0].label) > 0 ? (
                <div className="menu-item-qty">
                  <button onClick={() => onDec(variants[0].label)}>−</button>
                  <span className="q">{getQty(variants[0].label)}</span>
                  <button onClick={() => onInc(variants[0].label)}>+</button>
                </div>
              ) : (
                <button className="menu-item-add" onClick={() => onAdd(variants[0])}>
                  <span>AGGIUNGI</span><span>+</span>
                </button>
              )}
            </div>
          ) : (
            <div className="variants">
              {variants.map((v) => {
                const q = getQty(v.label)
                return (
                  <div key={v.label || 'def'} className="variant-row">
                    <span className="variant-label">{v.label || '—'}</span>
                    <span className="variant-price">€{v.price.toFixed(2)}</span>
                    {q > 0 ? (
                      <div className="menu-item-qty small">
                        <button onClick={() => onDec(v.label)}>−</button>
                        <span className="q">{q}</span>
                        <button onClick={() => onInc(v.label)}>+</button>
                      </div>
                    ) : (
                      <button className="menu-item-add small" onClick={() => onAdd(v)}>+</button>
                    )}
                  </div>
                )
              })}
            </div>
          )}

          {item.allergens && item.allergens.length > 0 && (
            <button
              className="allergen-btn"
              onClick={(e) => { e.stopPropagation(); setShowAllergens(true) }}
              aria-label="Mostra allergeni"
            >
              ⚠ Allergeni
            </button>
          )}
        </div>
      </article>

      {showAllergens && item.allergens && (
        <div className="allergen-overlay" onClick={() => setShowAllergens(false)}>
          <div className="allergen-modal" onClick={(e) => e.stopPropagation()}>
            <div className="allergen-modal-head">
              <span>ALLERGENI</span>
              <button onClick={() => setShowAllergens(false)} aria-label="Chiudi">✕</button>
            </div>
            <div className="allergen-modal-name">{item.name}</div>
            <div className="allergen-tags">
              {item.allergens.map((a) => (
                <span key={a} className="allergen-tag">{a}</span>
              ))}
            </div>
            <p className="allergen-modal-note">
              Informazioni sugli allergeni soggette a variazioni. In caso di allergie o intolleranze gravi, contatta il locale prima di ordinare.
            </p>
          </div>
        </div>
      )}
    </>
  )
}
