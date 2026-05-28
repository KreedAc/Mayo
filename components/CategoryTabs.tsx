import type { MenuSection } from '@/lib/types'

interface CategoryTabsProps {
  sections: MenuSection[]
  active: string
  onPick: (id: string) => void
}

export default function CategoryTabs({ sections, active, onPick }: CategoryTabsProps) {
  return (
    <div className="cat-tabs">
      <div className="cat-tabs-inner">
        {sections.map((s) => (
          <button
            key={s.id}
            className={`cat-tab ${active === s.id ? 'active' : ''}`}
            onClick={() => onPick(s.id)}
          >
            <span className="emo">{s.emoji}</span>
            {s.label}
          </button>
        ))}
      </div>
    </div>
  )
}
