import type { MenuSection, MenuItem, HeroBanner, HoursEntry, ClosureEntry } from './types'
import { MAYO_MENU, MAYO_HOURS, MAYO_INFO, DEFAULT_CLOSURES } from './data'
import { supabase } from './supabase'

const DEFAULT_BANNER: HeroBanner = {
  line1: 'SMASH',
  line2: 'IT.',
  tagline:
    'Smasheria di Lamezia Terme. Doppia patty pressata sulla piastra, crosta caramellata, pane brioche tostato al burro. Senza compromessi.',
}

interface SiteConfigResult {
  banner: HeroBanner
  hours: HoursEntry[]
  closures: ClosureEntry[]
}

async function fetchSiteConfig(): Promise<SiteConfigResult> {
  if (!supabase) return { banner: DEFAULT_BANNER, hours: MAYO_HOURS, closures: DEFAULT_CLOSURES }
  try {
    const { data, error } = await supabase
      .from('site_config')
      .select('key, value')
    if (error || !data?.length) return { banner: DEFAULT_BANNER, hours: MAYO_HOURS, closures: DEFAULT_CLOSURES }
    const map = Object.fromEntries(data.map((r: { key: string; value: string }) => [r.key, r.value]))

    const banner: HeroBanner = {
      line1: map['hero_line1'] || DEFAULT_BANNER.line1,
      line2: map['hero_line2'] || DEFAULT_BANNER.line2,
      tagline: map['hero_tagline'] ?? DEFAULT_BANNER.tagline,
    }

    let hours = MAYO_HOURS
    try {
      const parsed = JSON.parse(map['weekly_hours'] ?? '[]') as HoursEntry[]
      if (parsed.length) hours = parsed
    } catch { /* keep default */ }

    let closures = DEFAULT_CLOSURES
    try {
      closures = JSON.parse(map['closures'] ?? '[]') as ClosureEntry[]
    } catch { /* keep default */ }

    return { banner, hours, closures }
  } catch {
    return { banner: DEFAULT_BANNER, hours: MAYO_HOURS, closures: DEFAULT_CLOSURES }
  }
}

interface SupabaseProduct {
  id: string
  category_id: string
  name: string
  description: string
  image_url: string | null
  price: number | null
  featured: boolean
  badges: string[]
  allergens: string[]
  hidden: boolean
  sort_order: number
  product_variants: { id: string; label: string; price: number; sort_order: number }[]
}

interface SupabaseCategory {
  id: string
  label: string
  emoji: string
  blurb: string
  sort_order: number
}

function transformToMenu(
  categories: SupabaseCategory[],
  products: SupabaseProduct[]
): MenuSection[] {
  return categories
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((cat) => ({
      id: cat.id,
      label: cat.label,
      emoji: cat.emoji || '',
      blurb: cat.blurb || '',
      items: products
        .filter((p) => p.category_id === cat.id && !p.hidden)
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((p): MenuItem => {
          const variants = p.product_variants
            ?.sort((a, b) => a.sort_order - b.sort_order)
            .map((v) => ({ label: v.label, price: Number(v.price) }))
          return {
            id: p.id,
            name: p.name,
            desc: p.description || '',
            img: p.image_url || undefined,
            price: p.price != null ? Number(p.price) : undefined,
            variants: variants?.length ? variants : undefined,
            featured: p.featured || false,
            badges: p.badges || [],
            allergens: p.allergens?.length ? p.allergens : undefined,
          }
        }),
    }))
    .filter((s) => s.items.length > 0)
}

export async function getMenu() {
  const [{ banner, hours, closures }, menuResult] = await Promise.all([
    fetchSiteConfig(),
    (async () => {
      if (supabase) {
        try {
          const [{ data: categories, error: catError }, { data: products, error: prodError }] =
            await Promise.all([
              supabase.from('categories').select('*').order('sort_order'),
              supabase
                .from('products')
                .select('*, product_variants(*)')
                .order('sort_order'),
            ])

          if (!catError && !prodError && categories?.length && products) {
            const menu = transformToMenu(
              categories as SupabaseCategory[],
              products as SupabaseProduct[]
            )
            if (menu.length) return menu
          }
        } catch {
          // fall through to static data
        }
      }
      return MAYO_MENU
    })(),
  ])

  return { menu: menuResult, info: MAYO_INFO, hours, closures, banner }
}
