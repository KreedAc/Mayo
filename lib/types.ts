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
}

export interface MenuSection {
  id: string
  label: string
  emoji: string
  blurb: string
  items: MenuItem[]
}

export interface HoursEntry {
  day: string
  time: string
  closed?: boolean
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

export type CartMap = Record<string, number>
export type NotesMap = Record<string, string>
