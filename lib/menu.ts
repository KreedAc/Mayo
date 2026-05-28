import type { MenuSection, MenuItem } from './types'
import { MAYO_MENU, MAYO_HOURS, MAYO_INFO } from './data'
import { supabase } from './supabase'

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
        .filter((p) => p.category_id === cat.id)
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
        if (menu.length) {
          return { menu, info: MAYO_INFO, hours: MAYO_HOURS }
        }
      }
    } catch {
      // fall through to static data
    }
  }

  return { menu: MAYO_MENU, info: MAYO_INFO, hours: MAYO_HOURS }
}
