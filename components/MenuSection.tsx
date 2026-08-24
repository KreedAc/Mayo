import type { MenuSection as MenuSectionType, MenuItem as MenuItemType, MenuVariant } from '@/lib/types'
import MenuItem from './MenuItem'

interface MenuSectionProps {
  section: MenuSectionType
  idx: number
  getQty: (key: string) => number
  onAdd: (item: MenuItemType, variant: MenuVariant) => void
  onInc: (key: string) => void
  onDec: (key: string) => void
}

// A hero (full-width) card is any item tagged LIMITED
const isHero = (i: MenuItemType) => !!i.badges?.includes('LIMITED')

export default function MenuSection({ section, idx, getQty, onAdd, onInc, onDec }: MenuSectionProps) {
  // Hero cards always render first in their category so the grid below them
  // stays aligned (a hero in the middle would break the 2-column flow)
  const orderedItems = [
    ...section.items.filter(isHero),
    ...section.items.filter((i) => !isHero(i)),
  ]
  return (
    <section className="menu-section" id={`sec-${section.id}`}>
      <div className="cat-header">
        <span className="cat-number">{String(idx + 1).padStart(2, '0')}</span>
        <h3 className="cat-name">{section.label}</h3>
        {section.blurb && <p className="cat-blurb">{section.blurb}</p>}
      </div>
      <div className="menu-grid">
        {orderedItems.map((item) => (
          <MenuItem
            key={item.id}
            item={item}
            getQty={(variantLabel) => getQty(`${item.id}::${variantLabel || ''}`)}
            onAdd={(variant) => onAdd(item, variant)}
            onInc={(variantLabel) => onInc(`${item.id}::${variantLabel || ''}`)}
            onDec={(variantLabel) => onDec(`${item.id}::${variantLabel || ''}`)}
          />
        ))}
      </div>
    </section>
  )
}
