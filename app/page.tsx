import { getMenu } from '@/lib/menu'
import { SITE_URL } from '@/lib/site'
import MenuApp from '@/components/MenuApp'
import type { HoursEntry } from '@/lib/types'

export const revalidate = 60

const DAY_MAP: Record<string, string> = {
  Lunedì: 'Monday', Martedì: 'Tuesday', Mercoledì: 'Wednesday',
  Giovedì: 'Thursday', Venerdì: 'Friday', Sabato: 'Saturday', Domenica: 'Sunday',
}

function buildOpeningHours(hours: HoursEntry[]): string[] {
  const result: string[] = []
  for (const h of hours) {
    if (h.closed || !h.slots?.length) continue
    const day = DAY_MAP[h.day] ?? h.day
    for (const slot of h.slots) {
      result.push(`${day} ${slot.open}-${slot.close}`)
    }
  }
  return result
}

export default async function HomePage() {
  const { menu, info, hours, closures, banner } = await getMenu()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'MAYO Smasheria',
    description:
      'Smasheria di Lamezia Terme. Smash burger con doppia patty pressata sulla piastra, crosta caramellata, pane brioche tostato al burro.',
    url: SITE_URL,
    telephone: info.phone,
    address: {
      '@type': 'PostalAddress',
      streetAddress: info.address,
      addressLocality: 'Lamezia Terme',
      addressRegion: 'CZ',
      addressCountry: 'IT',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 38.9719,
      longitude: 16.3082,
    },
    servesCuisine: ['Smash Burger', 'American', 'Fast Food'],
    priceRange: '€€',
    currenciesAccepted: 'EUR',
    paymentAccepted: 'Cash, Credit Card',
    image: `${SITE_URL}/og-image.jpg`,
    sameAs: [info.igUrl],
    openingHours: buildOpeningHours(hours),
    hasMenu: `${SITE_URL}/#menu`,
    menu: {
      '@type': 'Menu',
      name: 'Menu MAYO',
      url: `${SITE_URL}/#menu`,
      hasMenuSection: menu.map((section) => ({
        '@type': 'MenuSection',
        name: section.label,
        hasMenuItem: section.items
          .filter((item) => !item.hidden)
          .map((item) => ({
            '@type': 'MenuItem',
            name: item.name,
            description: item.desc || undefined,
            offers: {
              '@type': 'Offer',
              price: item.price ?? item.variants?.[0]?.price ?? 0,
              priceCurrency: 'EUR',
            },
          })),
      })),
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <MenuApp menu={menu} info={info} hours={hours} closures={closures} banner={banner} />
    </>
  )
}
