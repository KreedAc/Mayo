import type { MenuItem } from '@/lib/types'

interface PreviewCardProps {
  item: MenuItem
}

export default function PreviewCard({ item }: PreviewCardProps) {
  const variants = item.variants || [{ label: '', price: item.price || 0 }]
  const singleNoLabel = variants.length === 1 && !variants[0].label

  return (
    <article className={`menu-item ${item.featured ? 'featured' : ''}`} style={{ pointerEvents: 'none' }}>
      {item.img && (
        <div className="menu-item-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.img} alt="" />
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
            <span className="menu-item-price">€{Number(variants[0].price).toFixed(2)}</span>
            <span className="menu-item-add"><span>AGGIUNGI</span><span>+</span></span>
          </div>
        ) : (
          <div className="variants">
            {variants.map((v, i) => (
              <div key={i} className="variant-row">
                <span className="variant-label">{v.label || '—'}</span>
                <span className="variant-price">€{Number(v.price).toFixed(2)}</span>
                <span className="menu-item-add small">+</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </article>
  )
}
