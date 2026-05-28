import type { MenuSection as MenuSectionType, MenuItem as MenuItemType, MenuVariant, CartMap } from '@/lib/types'
import MenuItem from './MenuItem'

interface MenuSectionProps {
  section: MenuSectionType
  idx: number
  cart: CartMap
  onAdd: (item: MenuItemType, variant: MenuVariant) => void
  onInc: (key: string) => void
  onDec: (key: string) => void
}

export default function MenuSection({ section, idx, cart, onAdd, onInc, onDec }: MenuSectionProps) {
  return (
    <section className="menu-section" id={`sec-${section.id}`}>
      <div className="cat-header">
        <span className="cat-number">{String(idx + 1).padStart(2, '0')}</span>
        <h3 className="cat-name">{section.label}</h3>
        {section.blurb && <p className="cat-blurb">{section.blurb}</p>}
      </div>
      <div className="menu-grid">
        {section.items.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            getQty={(variantLabel) => cart[`${item.id}::${variantLabel || ''}`] || 0}
            onAdd={(variant) => onAdd(item, variant)}
            onInc={(variantLabel) => onInc(`${item.id}::${variantLabel || ''}`)}
            onDec={(variantLabel) => onDec(`${item.id}::${variantLabel || ''}`)}
          />
        ))}
      </div>
    </section>
  )
}
