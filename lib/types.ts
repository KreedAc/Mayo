export interface MenuVariant {
  label: string
  price: number
}

export interface MenuItem {
  id: string
  name: string
  desc: string
  img?: string
  price?: number
  variants?: MenuVariant[]
  featured?: boolean
  badges?: string[]
  allergens?: string[]
  hidden?: boolean
}

export interface MenuSection {
  id: string
  label: string
  emoji: string
  blurb: string
  items: MenuItem[]
}

export interface HoursSlot {
  open: string   // "18:30"
  close: string  // "23:30"
}

export interface HoursEntry {
  day: string
  closed?: boolean
  slots?: HoursSlot[]
}

export interface ClosureEntry {
  id: string
  label: string
  from: string  // "YYYY-MM-DD"
  to: string    // "YYYY-MM-DD"
}

export interface SiteInfo {
  address: string
  city: string
  phone: string
  phoneRaw: string
  instagram: string
  igUrl: string
  cover: number
  minOrder: number
}

export interface HeroBanner {
  line1: string
  line2: string
  tagline: string
}

export type CartMap = Record<string, number>
export type NotesMap = Record<string, string>
